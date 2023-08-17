#!/usr/bin/env node
import * as jsParser from 'acorn';
import fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import ts from 'typescript';
import requireFromString from 'require-from-string';
import * as glob from 'glob';
import * as appRoot from 'app-root-path';
import config from './createngtest.config.js';
import Util from './src/util.js';
import FuncTestGen from './src/func-create-test.js';
import ComponentTestGen from './src/component/component-create-test.js';
import DirectiveTestGen from './src/directive/directive-create-test.js';
import serviceTestGen from './src/service/service-create-test.js';
import PipeTestGen from './src/pipe/pipe-create-test.js';
import ClassTestGen from './src/class/class-create-test.js';
import generateSpecFile from './call_all.js';

import { createRequire } from "module";
//const require = createRequire(import.meta.url);

// global.require = require;
//import * as hideBin  from 'yargs/helpers'
//const _yargs = yargs(hideBin(process.argv))

//const _yargs = yargs();

//import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { exit } from 'process';
const yarg = yargs(hideBin(process.argv))


const argv = yarg.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' },
    'a': { alias: 'all', describe: 'create or update all spec file in the app', type: 'boolean'},
    'f': {
      alias: 'force', 
      describe: 'It prints out a new test file, and it does not ask a question when overwrite spec file',
      type: 'boolean'
    },
    'F': {
      alias: 'forcePrint', 
      describe: 'It prints out to console, and it does not ask a question',
      type: 'boolean'
    },
    'm': { alias: 'method', describe: 'Show code only for this method', type: 'string' },
    'v': { alias: 'verbose', describe: 'log verbose debug messages', type: 'boolean' },
    'framework': { describe: 'test framework, jest or karma', type: 'string' },
    'c': { alias: 'config', describe: 'The configuration file to load options from', type: 'string', default: 'createngtest.config.js' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

Util.DEBUG = argv.verbose;
if (argv.a) {
  generateSpecFile(path.join(process.cwd(), '/src/app/'))
  process.exit(0);
  //return false;
}

Util.DEBUG = argv.verbose;
const tsFile = argv._[0].replace(/\.spec\.ts$/, '.ts');
// const writeToSpec = argv.spec;
if (!(tsFile && fs.existsSync(tsFile))) {
  console.error('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

if (argv.c && fs.existsSync(path.resolve(argv.c))) {
  loadConfig(path.resolve(argv.c));
} else {
  Util.DEBUG && console.log(`${argv.c} not found. Using default config instead.`)
}
Util.DEBUG && console.log('  *** config ***', config);

Util.FRAMEWORK = config.framework || argv.framework;

function loadConfig(filePath) {

  const userConfig = createRequire(filePath);
  for (var key in userConfig) {
    config[key] = userConfig[key];
  }
}

function getFuncMockData (Klass, funcName, funcType) {
  const funcTestGen = new FuncTestGen(Klass, funcName, funcType);
  const funcMockData = {
    isAsync: funcTestGen.isAsync,
    props: {},
    params: funcTestGen.getInitialParameters(),
    map: {},
    globals: {}
  };
  funcTestGen.getExpressionStatements().forEach((expr, ndx) => {
    const code = funcTestGen.classCode.substring(expr.start, expr.end);
    Util.DEBUG && console.log('  *** EXPRESSION ***', ndx, code.replace(/\n+/g, '').replace(/\s+/g, ' '));
    funcTestGen.setMockData(expr, funcMockData);
  });

  return funcMockData;
}

function getTestGenerator (tsPath, config) {
  const typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
  const angularType = Util.getAngularType(typescript).toLowerCase();
  const testGenerator = /* eslint-disable */
    angularType === 'component' ? new ComponentTestGen(tsPath, config) :
    angularType === 'directive' ? new DirectiveTestGen(tsPath, config) :
    angularType === 'service' ? new serviceTestGen(tsPath, config) :
    angularType === 'pipe' ? new PipeTestGen(tsPath, config) :
    new ClassTestGen(tsPath, config); /* eslint-enable */
  return testGenerator;
}

function getFuncTest(Klass, funcName, funcType, angularType) {
  Util.DEBUG &&
    console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING #${funcName}`);

  const funcMockData = getFuncMockData(Klass, funcName, funcType);
  const [allFuncMockJS, asserts] = Util.getFuncMockJS(funcMockData, angularType, Klass);
  const funcMockJS = [...new Set(allFuncMockJS)];
  const funcParamJS = Util.getFuncParamJS(funcMockData.params);

  const funcAssertJS = asserts.map(el => `// expect(${el.join('.')}).toHaveBeenCalled()`);
  let jsToRun;
  if (funcName == 'canActivate') {
    let klassCode = '' + Klass.prototype.constructor;
            // console.log('jsParser.parse(klassCode).body[0]', jsParser.parse(klassCode).body[0].id.name)
            let ckassDec  = jsParser.Parser.parse(klassCode).body[0].id.name;
    jsToRun = `${angularType}${ckassDec}.${funcName}({url: '/'} as any, { snapshot: {}, url: '/'} as any)`
  } else {
    jsToRun = funcType === 'set' ? `${angularType}.${funcName} = ${funcParamJS || '{}'}`: 
    funcType === 'get' ? `const ${funcName} = ${angularType}.${funcName}` : 
    `${angularType}.${funcName}(${funcParamJS})`;
  }
  // const jsToRun = 
  //   funcType === 'set' ? `${angularType}.${funcName} = ${funcParamJS || '{}'}`: 
  //   funcType === 'get' ? `const ${funcName} = ${angularType}.${funcName}` : 
  //   `${angularType}.${funcName}(${funcParamJS})`;
  const itBlockName = 
    funcType === 'method' ? `should run #${funcName}()` : 
    funcType === 'get' ? `should run GetterDeclaration #${funcName}` :
    funcType === 'set' ? `should run SetterDeclaration #${funcName}` : '';
  const asyncStr = funcMockData.isAsync ? 'await ' : '';

  return `
    it('${itBlockName}', async () => {
      ${funcMockJS.join(';\n')}${funcMockJS.length ? ';' : ''}
      ${asyncStr}${jsToRun};
      ${funcAssertJS.join(';\n')}${funcAssertJS.length ? ';' : ''}
    });
    `;
}
function doimport (str) {
  const url = `data:text/javascript;base64,${Buffer.from(str).toString(`base64`)}`;
  //const url = `data:text/javascript;base64,${Buffer.from('export let AppComponent = class AppComponent {}').toString(`base64`)}`;
  return  import(url)
}

async function run (tsFile) {
  try {
    const testGenerator = getTestGenerator(tsFile, config);
    const typescript = fs.readFileSync(path.resolve(tsFile), 'utf8');
    const angularType = Util.getAngularType(typescript).toLowerCase();
    const {ejsData} = testGenerator.getData();
    ejsData.config = config;
    // mockData is set after each statement is being analyzed from getFuncMockData
    ejsData.ctorParamJs; // declarition only, will be set from mockData
    ejsData.providerMocks; //  declarition only, will be set from mockData
    ejsData.accessorTests = {}; //  declarition only, will be set from mockData
    ejsData.functionTests = {}; //  declarition only, will be set from mockData

    const result = ts.transpileModule(typescript, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        experimentalDecorators: true,
        removeComments: true,
        target: ts.ScriptTarget.ES2020
      }
    });

    // replace invalid require statements
    let replacedOutputText = result.outputText
      .replace(/require\("\.(.*)"\)/gm, '{}') // replace require statement to a variable, {}
      .replace(/super\(.*\);/gm, '') // remove inheritance code
      .replace(/super\./gm, 'this.') // change inheritance call to this call
      .replace(/\s+extends\s\S+ {/gm, ' extends Object {') // rchange inheritance to an Object
      .replace(/\bimport\b\s+(.*)\s+from[^\n;]*/gm, (match, p1) => {
        return p1.split(',').map(item => {
            item = item.replace(/[{}]/g, '').trim();
            let s = item.search(/\bas\b/g);
            if (s > -1) {
                item = item.substring(s+2);
            }
            return `var ${item.trim()}=()=>{}`;
        }).join(';');
      })
      .replace(/\bimport\b[^\n;]*/gm, '')
      .replace(/\bwindow\b/g, 'globalThis')

    config.replacements.forEach( ({from,to}) => {
      replacedOutputText = replacedOutputText.replace(new RegExp(from, 'gm'), to);
    })

    const modjule = await doimport(replacedOutputText);

    const Klass = modjule[ejsData.className];
    Util.DEBUG &&
      console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${Klass.ctor && Klass.ctor.name} constructor`);
    const ctorMockData = getFuncMockData(Klass, 'constructor', 'constructor');
    const ctorParamJs = Util.getFuncParamJS(ctorMockData.params);
    ejsData.ctorMockDataParams = Object.keys(ctorMockData.params)
    ejsData.ctorParamJs = Util.indent(ctorParamJs, ' '.repeat(6)).trim();
    ejsData.providerMocks = testGenerator.getProviderMocks(ctorMockData.params);
    // for (var key in ejsData.providerMocks) {
    //   ejsData.providerMocks[key] = Util.indent(ejsData.providerMocks[key]).replace(/\{\s+\}/gm, '{}');
    // }

    const errors = [];
    testGenerator.klassSetters.forEach(setter => {
      const setterName = setter.node.name.escapedText;
      ejsData.accessorTests[`${setterName} SetterDeclaration`] =
        Util.indent(getFuncTest(Klass, setterName, 'set', angularType), '  ');
    });
    testGenerator.klassGetters.forEach(getter => {
      const getterName = getter.node.name.escapedText;
      ejsData.accessorTests[`${getterName} GetterDeclaration`] =
        Util.indent(getFuncTest(Klass, getterName, 'get', angularType), '  ');
    });

    testGenerator.klassMethods.forEach(method => {
      const methodName = method.node.name.escapedText;
      try {
        ejsData.functionTests[methodName] =
          Util.indent(getFuncTest(Klass, methodName, 'method', angularType), '  ');
      } catch (e) {
        const msg = '    // '+ e.stack;
        const itBlock = `it('should run #${method.name}()', async () => {\n` +
          `${msg.replace(/\n/g, '\n    // ')}\n` +
          `  });\n`
        ejsData.functionTests[methodName] = itBlock;
        errors.push(e);
      }
    });

    const generated = testGenerator.getGenerated(ejsData, argv);
    generated && testGenerator.writeGenerated(generated, argv);

    errors.forEach( e => console.error(e) );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const isDir = fs.lstatSync(tsFile).isDirectory();
if (isDir) {
  const files = glob.sync('**/!(*.spec).ts', {cwd: tsFile})
  files.forEach(file => {
    const includeMatch = config.includeMatch.map(re => file.match(re)).some(e => !!e);
    const excludeMatch = config.excludeMatch.map(re => file.match(re)).some(e => !!e);
    if (excludeMatch) {
      console.log(' *** NOT processing (in excludeMatch)', path.join(tsFile, file));
    } else if (includeMatch) {
      console.log(' *** processing', path.join(tsFile, file));
      run(path.join(tsFile, file));
    } else {
      console.log(' *** NOT processing (not in includeMatch)', path.join(tsFile, file));
    }
  });
} else {
  run(tsFile);
}
