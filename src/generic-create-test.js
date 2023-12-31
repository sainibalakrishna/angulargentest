import path from 'path';
import  fs from 'fs';
import ejs from 'ejs';
import ts from 'typescript';
import TypescriptParser from './typescript-parser.js';
import Util from './util.js';

// convert Typescript-parsed nodes to an array
function __toArray(el) {
  return Array.isArray(el) ? el : 
  el && el.node ? [el] :
  [];
}

function __get(node) {
  node = node.node || node;

  const name = node.name && node.name.escapedText;
  let type;
  if (node.type && node.type.typeName) {
    type = node.type.typeName.escapedText;
  } else if (node.type && node.type.kind) {
    type = ts.SyntaxKind[node.type.kind]?.replace(/Keyword/,'').toLowerCase()
  } 

  let decorator;
  if (node.decorators) {
    const name = node.decorators[0].expression.expression.escapedText;
    const param = (node.decorators[0].expression.arguments[0] || {}).text;
    decorator = {name, param}
  }

  return {type, name, decorator};
}

function __getKlassDecorator(klass) {
  const klassDecorator = {};
  const props = klass.get('Decorator')
    .get('CallExpression')
    .get('ObjectLiteralExpression')
    .get('PropertyAssignment')

  __toArray(props).forEach(el => {
      const key = el.children[0].node.escapedText;
      const value = el.children[1].node;
      klassDecorator[key] = value;
    });

  return klassDecorator;
}


// all imports info. from typescript
// { Component: { moduleName: xxx, alias: xxx } }
function getImports() {
  let imports = [];
  // Iterate through Typescript to find imports needed there
  const parsed = new TypescriptParser(this.typescript);
  __toArray(parsed.rootNode.get('ImportDeclaration'))
    .map(prop => {
    const moduleName = prop.node.moduleSpecifier.text;
    const namedImports = prop.get('ImportClause').get('NamedImports');
    const namespaceImport = prop.get('ImportClause').get('NamespaceImport');

    if (namespaceImport.node) {
      const alias = namespaceImport.node.name.escapedText;
      imports.push({name: '*', alias, moduleName});
    } else if (namedImports.node) {
      namedImports.node.elements.forEach(node => {
        const name = node.name.escapedText;
        imports.push({name, alias: undefined, moduleName});
      })
    }
  });


  // Iterate through HTML associated with Typescript to find imports that are needed in pipes
  // These pipes are assumed to be generated through Angular and will be built in a specific way
  let htmlProcess = this.html;
  let nextPipe = htmlProcess ? htmlProcess.indexOf("|"): -1;
  while(nextPipe >= 0) {
    let i = htmlProcess.indexOf("|");
    if(htmlProcess.charAt(i + 1) === "|") {

      // Avoid processing || operator as a pipe

      nextPipe += 2;

    } else {
    let newPipe = "";

    // In case the first character AFTER "|" isn't whitespace, check if there is a character there.
    if(htmlProcess.charAt(nextPipe + 1).match(/[a-z]/i)) {
      i++;
    } else {
      i+=2;
    }

    // Look through HTML until it finds a non-letter.
    // For example, if the HTML snippet is "... | filter:filterData ...", we want "filter"
    do {
      newPipe = newPipe.concat(htmlProcess.charAt(i));
      i++;
    } while (htmlProcess.charAt(i).match(/[a-z]/i))
    let pipeDirectory = 'src/app/pipes/' + newPipe + '.pipe';
    let pipeName = newPipe[0].toUpperCase() + newPipe.substring(1) + "Pipe";

    // Prevent adding repeat pipes
    let containsPipe = imports.some(function(el) { return el.name === pipeName; })
    if(!containsPipe) {
      imports.push({name: pipeName, alias: undefined, moduleName: pipeDirectory});
    }
   }
    htmlProcess = htmlProcess.substring(nextPipe + 1);
    nextPipe = htmlProcess.indexOf("|");
  }
  return imports;
}

function getKlassProperties() {
  return __toArray(this.klass.get('PropertyDeclaration'))
    .concat(this.klass.get('SetAccessor'))
    .concat(this.klass.get('GetAccessor'))
  .map(prop => {
    return __get(prop);
  })
  .filter(el => el.name);
}

function getKlassSetters() { return __toArray(this.klass.get('SetAccessor')); }
function getKlassGetters() { return __toArray(this.klass.get('GetAccessor')); }
function getKlassMethods() { 
  return __toArray(this.klass.get('MethodDeclaration')); 
}

function getKlass() {
  const parsed = new TypescriptParser(this.typescript);
  const fileBasedKlassName = Util.getClassName(this.tsPath);
  
  const klassDeclarations = __toArray(parsed.rootNode.get('ClassDeclaration'));
  const klass =
    klassDeclarations.find(decl => decl.node.name.escapedText === fileBasedKlassName) ||
    klassDeclarations[0];
  if (!klass) {
    throw new Error(`Error:TypeScriptParser Could not find ` +
      `${fileBasedKlassName || 'a class'} from ${this.tsPath}`);
  }

  return klass;
}

function getAngularType() {
  return (__get(this.klass).decorator || {}).name;
}

// import statement mocks;
function getImportMocks() {
//   const importMocks = [];
//   const klassName = this.klass.node.name.escapedText;
//   const moduleName = path.basename(this.tsPath).replace(/.ts$/, '');
 
//   const imports = {};
//   if (['component', 'directive'].includes(this.angularType)) {
//     imports[`@angular/core`] = ['Component'];
//   }
//   imports[`./${moduleName}`] = [klassName]

//   if (this.klass.get('Constructor').node) {
//     const paremeters = this.klass.get('Constructor').node.parameters;
//     paremeters.forEach(param => {
//       const {name, type, decorator} = __get(param);
//       const exportName = decorator ? decorator.name : type;
//       const emport = this.imports.find(el => el.name === exportName); // name , alias


//       const importStr = emport.alias ? `${exportName} as ${emport.alias}` : exportName;
//       if (exportName === 'Inject') { // do not import Inject, but import Inject name
//         const commonTypes = ['APP_BASE_HREF', 'DOCUMENT', 'LOCATION_INITIALIZED', 'Time'];
//         const importLib = commonTypes.includes(decorator.param) ? '@angular/common' : '@angular/core';
//         imports[importLib] = (imports[importLib] || []).concat(decorator.param);
//       } else {
//         if(importStr === 'ToastrService'){
//           imports[emport.moduleName] = (imports[emport.moduleName] || []).concat('ToastrModule');
//         }
//         imports[emport.moduleName] = (imports[emport.moduleName] || []).concat(importStr);
//       }
//     });
//   }

//   for (var lib in imports) {
//     const fileNames = imports[lib].join(', ');
//     importMocks.push(`import { ${fileNames} } from '${lib}';`)
//   }

//   // Iterate through HTML associated with Typescript to find imports that are needed in pipes
//   // These pipes are assumed to be generated through Angular and will be built in a specific way
//   let htmlProcess = this.html;
//   let nextPipe = htmlProcess ? htmlProcess.indexOf("|"): -1;
//   while(nextPipe >= 0) {
//     let i = htmlProcess.indexOf("|");
//     if(htmlProcess.charAt(i + 1) === "|") {

//       // Avoid processing || operator as a pipe

//       nextPipe += 2;

//     } else {
//     let newPipe = "";

//     // In case the first character AFTER "|" isn't whitespace, check if there is a character there.
//     if(htmlProcess.charAt(nextPipe + 1).match(/[a-z]/i)) {
//       i++;
//     } else {
//       i+=2;
//     }

//     // Look through HTML until it finds a non-letter.
//     // For example, if the HTML snippet is "... | filter:filterData ...", we want "filter"
//     do {
//       newPipe = newPipe.concat(htmlProcess.charAt(i));
//       i++;
//     } while (htmlProcess.charAt(i).match(/[a-z]/i))
//     let pipeDirectory = 'src/app/pipes/' + newPipe + '.pipe';
//     let pipeName = newPipe[0].toUpperCase() + newPipe.substring(1) + "Pipe";

//     // Prevent adding repeat pipes
//     let containsPipe = importMocks.some(function(el) { return el.indexOf(pipeName) >= 0 })
//     if(!containsPipe) {
//       importMocks.push(`import { ${pipeName} } from '${pipeDirectory}';`);
//     }
//    }
//     htmlProcess = htmlProcess.substring(nextPipe + 1);
//     nextPipe = htmlProcess.indexOf("|");
//   } 


//   return importMocks;

let imports = [];

  const parsed = new TypescriptParser(this.typescript);
  __toArray(parsed.rootNode.get('ImportDeclaration'))
    .map(prop => {
    //   console.log(prop);
    // const moduleName = prop.node.moduleSpecifier.text;
    // const namedImports = prop.get('ImportClause').get('NamedImports');
    // const namespaceImport = prop.get('ImportClause').get('NamespaceImport');

    // if (namespaceImport.node) {
    //   const alias = namespaceImport.node.name.escapedText;
    //   imports.push({name: '*', alias, moduleName});
    // } else if (namedImports.node) {
    //   namedImports.node.elements.forEach(node => {
    //     const name = node.name.escapedText;
    //     //imports.push({name, alias: name, moduleName});
    //     
    //   })
    // }
    imports.push(prop.nodeText);
  });



  return imports;
}

function getProviderMocks(ctorMockData) {
  const providerMocks = {providers: [], mocks: []};
  if (!this.klass.get('Constructor').node) {
    return providerMocks;
  }

  const paremeters = this.klass.get('Constructor').node.parameters
  paremeters.forEach(param => {
    const {name, type, decorator} = __get(param);
    const injectClassName = decorator && decorator.name === 'Inject' && decorator.param;
    const injectUseStatement = 
      injectClassName === 'DOCUMENT' ? `useClass: MockDocument` :
      injectClassName === 'PLATFORM_ID' ? `useValue: 'browser'` :
      injectClassName === 'LOCALE_ID' ? `useValue: 'en'` : `useValue: ${injectClassName}`;

    const mockData = ctorMockData[name];
    mockData && (delete mockData['undefiend']);
    const mockDataJS = !mockData ? [] : 
      Object.entries(mockData).map(([k, v]) => `${k} = ${Util.objToJS(v)};`)
    const emport = this.imports.find(el => el.name === type); // name , alias, moduleName
    const emportFromFile = !!(emport && emport.moduleName.match(/^(\.|src\/)/));
    const configMockJS = this.config.providerMocks[type];
    let mockFn;
    if (type !== 'Object' && emportFromFile) {
      mockFn = (mockDataJS || []).concat(configMockJS);
    } else if (configMockJS) {
      mockFn = (mockDataJS || []).concat(configMockJS);
    }
    if (type.includes('Service') && mockFn) {
      if (emport && emport.moduleName) {
        let pathName = emport.moduleName.split('../').pop()
        var specPath = path.resolve((this.config.srcPath + '\\src\\app'),pathName) + ".ts"
        let readServiceFile = fs.readFileSync(specPath, 'utf8');
        const parsed = new TypescriptParser(readServiceFile);
        let methodName = parsed.rootNode.children.filter(nodeN => nodeN.syntaxKind === "ClassDeclaration")[0].children.filter(el => el.syntaxKind === "MethodDeclaration")
        mockFn = methodName.map(value => {
          let fnName = value.nodeText.split('{')[0]
          if(!fnName.includes("ng")) {
            return fnName + '{}'
          }
        })
      }
    }
    if (mockFn) {
      providerMocks.mocks.push(Util.indent(`
        @Injectable()
        class Mock${type} {
          ${mockFn.join('\n')}
        }`)
        .replace(/\n\s*?\n/gm, '\n') // remove empty lines
        .replace(/\{\s+?}\s*?/gm, '{}\n') // ...{\n} to ...{}
      );
    }

    // code for providers section at @Component({providers: XXXXXXXXX}
    if (type === 'ActivatedRoute') {
      providerMocks.providers.push(`{
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }`);
    } else if (this.config.providerMocks[type]) { // if mock is given from config
      providerMocks.providers.push(`{ provide: ${type}, useClass: Mock${type} }`);
    } else if (emportFromFile) {
      providerMocks.providers.push(`{ provide: ${type}, useClass: Mock${type} }`);
    } else if (injectClassName) {
      providerMocks.providers.push(`{ provide: '${injectClassName}', ${injectUseStatement} }`);
    } else {
      providerMocks.providers.push(type);
    }
  });

  return providerMocks;
}

function getInputMocks() {
  const inputMocks = {html: [], js: []};
  this.klassProperties.forEach(({type, name, decorator}) => {
    if (decorator && decorator.name === 'Input') {
      inputMocks.html.push(`[${decorator.param || name}]="${name}"`);
      inputMocks.js.push(`${name}: ${type};`);
    }
  });

  return inputMocks;
}

function getOutputMocks() {
  const outputMocks = {html: [], js: []};

  this.klassProperties.forEach(({type, name, decorator}) => {
    const funcName = `on${name.replace(/^[a-z]/, x => x.toUpperCase())}`;
    if (decorator && decorator.name === 'Output') {
      outputMocks.html.push(`(${decorator.param || name})="${funcName}($event)"`);
      outputMocks.js.push(`${funcName}(event): void { /* */ }`);
    }
  });

  return outputMocks;
}

function getComponentProviderMocks() {
  const mocks = [];

  const decorator = __getKlassDecorator(this.klass);
  if (decorator.providers) {
    const klassNames = decorator.providers.elements.map(el => el.escapedText);
    const providerMocks = klassNames.filter(name => name).map(name =>  {
      return `{ provide: ${name}, useClass: Mock${name} }`;
    });
    if (providerMocks.length) {
      mocks.push(`set: { providers: [${providerMocks.join(',\n')}] }`);
    }
  } 

  return mocks;
}

function getDirectiveSelector() {
  const decorator = __getKlassDecorator(this.klass);

  if (decorator.selector) {
    const selectorTxt = decorator.selector.text;
    if (selectorTxt.match(/^\[/)) {
      return { type: 'attribute', value: selectorTxt, name: selectorTxt.match(/[^\[\]]+/)[0] };
    } else if (selectorTxt.match(/^\./)) {
      return { type: 'class', value: selectorTxt, name: selectorTxt.match(/[^\.]+/)[0] };
    } else if (selectorTxt.match(/^[a-z]/i)) {
      return { type: 'element', value: selectorTxt, name: selectorTxt.match(/[a-z-]+/)[0] };
    }
  }
}

function getExistingTests(ejsData, existingTestCodes) {
  const existingTests = {};
  const allTests = Object.assign({}, ejsData.accessorTests || {}, ejsData.functionTests || {});
  for (var funcName in allTests) {
    // e.g. compoent.myFuncName(any, goes, here);
    const re = new RegExp(`\\S+\.${funcName}\\(?[\\s\\S]*\\)?;`, 'm');
    existingTests[funcName] = !!existingTestCodes.match(re);
  }

  return existingTests;
}

function getGenerated (ejsData, options) {
  let generated;
  const funcName = options.method;
  const specPath = path.resolve(this.tsPath.replace(/\.ts$/, '.spec.ts')); 
  const existingTestCodes = fs.existsSync(specPath) && fs.readFileSync(specPath, 'utf8');
  if (funcName) {
    // if user asks to generate only one function
    generated = ejsData.functionTests[funcName] || ejsData.accessorTests[funcName];
  } else if (existingTestCodes && specPath && !options.force && !options.forcePrint) {
    // if there is existing tests, then add only new function tests at the end
    const existingTests = getExistingTests(ejsData, existingTestCodes);
    const newTests = [];
    const allTests = Object.assign({}, ejsData.accessorTests || {}, ejsData.functionTests || {});
    // get only new tests
    for (var method in existingTests) {
      (existingTests[method] !== true) && newTests.push('  // new test by createngtest' + allTests[method]); 
    }
    if (newTests.length) {
      // add new tests at the end
      const re = /(\s+}\);?\s+)(}\);?\s*)$/;
      const testEndingMatch = existingTestCodes.match(re); // file ending parts
      if (testEndingMatch) {
        generated = existingTestCodes.replace(re, (m0, m1, m2) => {
          const newCodes = newTests.join('\n').replace(/[ ]+$/, '');
          return `${m1}${newCodes}${m2}`;
        });
      }
    } else {
      generated = ejs.render(this.template, ejsData).replace(/\n\s+$/gm, '\n');
    }
  } else {
    // if no existing tests
    generated = ejs.render(this.template, ejsData).replace(/\n\s+$/gm, '\n');
  }
  return generated;
}

function writeToSpecFile (specPath, generated) {
  fs.writeFileSync(specPath, generated);
  console.log('Generated unit test to', specPath);
}

function backupExistingFile (specPath, generated) {
  if (fs.existsSync(specPath)) {
    const backupTime = (new Date()).toISOString().replace(/[^\d]/g, '').slice(0, -5);
    const backupContents = fs.readFileSync(specPath, 'utf8');
    if (backupContents !== generated) {
      fs.writeFileSync(`${specPath}.${backupTime}`, backupContents, 'utf8'); // write backup
      console.log('Backup the exisiting file to', `${specPath}.${backupTime}`);
    }
  }
};

function writeGenerated (generated, options) {
  const toFile = options.spec;
  const force = options.force;
  const specPath = path.resolve(this.tsPath.replace(/\.ts$/, '.spec.ts'));
  generated = generated.replace(/\r\n/g, '\n');

  const specFileExists = fs.existsSync(specPath);

  if (toFile && specFileExists && force) {
    backupExistingFile(specPath, generated);
    writeToSpecFile(specPath, generated);
  } else if (toFile && specFileExists && !force) {
 
    
    const readline = import('readline').then(read => {
      const rl = read.createInterface(process.stdin, process.stdout);
      console.warn('\x1b[33m%s\x1b[0m',
        `WARNING!!, Spec file, ${specPath} already exists. Overwrite it?`);
      rl.question('Continue? ', answer => {
        if (answer.match(/y/i)) {
          backupExistingFile(specPath, generated);
          writeToSpecFile(specPath, generated);
        } else {
          process.stdout.write(generated);
        }
        rl.close();
      });
    });

 
  } else if (toFile && !specFileExists) {
    backupExistingFile(specPath, generated);
    writeToSpecFile(specPath, generated);
  } else if (!toFile) {
    process.stdout.write(generated);
  }
}
function getImportArray(){
  const importArray = [];
  const toaster = this.imports.find(el => el.name === 'ToastrService')
  if(toaster){
    importArray.push('ToastrModule.forRoot()')
  }
  this.imports.forEach(pipe => {
    importArray.push(pipe.name);
  });
  return importArray;
}

function getPipeArray() {  
  const pipeArray = [];
  const pipes = this.imports.filter(el => el.name.includes('Pipe'));
  pipes.forEach(pipe => {
    pipeArray.push(pipe.name);
  });
 return pipeArray;
}

const CommonGenFunctions = {
  getKlass,
  getImports,
  getKlassProperties,
  getKlassGetters,
  getKlassSetters,
  getKlassMethods,
  getAngularType,

  getInputMocks, // input coddes
  getOutputMocks, // output codes
  getImportMocks, // import statements code
  getProviderMocks, // module provider code
  getComponentProviderMocks,
  getDirectiveSelector,
  getImportArray,
  getPipeArray,
  getGenerated,
  writeGenerated
};
export default CommonGenFunctions;
//module.exports = CommonGenFunctions;
