"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs"));
var ejs = _interopRequireWildcard(require("ejs"));
var ts = _interopRequireWildcard(require("typescript"));
var _typescriptParser = _interopRequireDefault(require("./typescript-parser.js"));
var _util = _interopRequireDefault(require("./util.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // const path = require('path');
// const fs = require('fs');
// const ejs = require('ejs');
// const ts = require('typescript');
// const TypescriptParser = require('./typescript-parser');
// const Util = require('./util.js');
// convert Typescript-parsed nodes to an array
function __toArray(el) {
  return Array.isArray(el) ? el : el && el.node ? [el] : [];
}
function __get(node) {
  node = node.node || node;
  var name = node.name && node.name.escapedText;
  var type;
  if (node.type && node.type.typeName) {
    type = node.type.typeName.escapedText;
  } else if (node.type && node.type.kind) {
    type = ts.SyntaxKind[node.type.kind].replace(/Keyword/, '').toLowerCase();
  }
  var decorator;
  if (node.decorators) {
    var _name = node.decorators[0].expression.expression.escapedText;
    var param = (node.decorators[0].expression.arguments[0] || {}).text;
    decorator = {
      name: _name,
      param: param
    };
  }
  return {
    type: type,
    name: name,
    decorator: decorator
  };
}
function __getKlassDecorator(klass) {
  var klassDecorator = {};
  var props = klass.get('Decorator').get('CallExpression').get('ObjectLiteralExpression').get('PropertyAssignment');
  __toArray(props).forEach(function (el) {
    var key = el.children[0].node.escapedText;
    var value = el.children[1].node;
    klassDecorator[key] = value;
  });
  return klassDecorator;
}

// all imports info. from typescript
// { Component: { moduleName: xxx, alias: xxx } }
function getImports() {
  var imports = [];
  // Iterate through Typescript to find imports needed there
  var parsed = new _typescriptParser["default"](this.typescript);
  __toArray(parsed.rootNode.get('ImportDeclaration')).map(function (prop) {
    var moduleName = prop.node.moduleSpecifier.text;
    var namedImports = prop.get('ImportClause').get('NamedImports');
    var namespaceImport = prop.get('ImportClause').get('NamespaceImport');
    if (namespaceImport.node) {
      var alias = namespaceImport.node.name.escapedText;
      imports.push({
        name: '*',
        alias: alias,
        moduleName: moduleName
      });
    } else if (namedImports.node) {
      namedImports.node.elements.forEach(function (node) {
        var name = node.name.escapedText;
        imports.push({
          name: name,
          alias: undefined,
          moduleName: moduleName
        });
      });
    }
  });

  // Iterate through HTML associated with Typescript to find imports that are needed in pipes
  // These pipes are assumed to be generated through Angular and will be built in a specific way
  var htmlProcess = this.html;
  var nextPipe = htmlProcess ? htmlProcess.indexOf("|") : -1;
  var _loop = function _loop() {
    var i = htmlProcess.indexOf("|");
    if (htmlProcess.charAt(i + 1) === "|") {
      // Avoid processing || operator as a pipe

      nextPipe += 2;
    } else {
      var newPipe = "";

      // In case the first character AFTER "|" isn't whitespace, check if there is a character there.
      if (htmlProcess.charAt(nextPipe + 1).match(/[a-z]/i)) {
        i++;
      } else {
        i += 2;
      }

      // Look through HTML until it finds a non-letter.
      // For example, if the HTML snippet is "... | filter:filterData ...", we want "filter"
      do {
        newPipe = newPipe.concat(htmlProcess.charAt(i));
        i++;
      } while (htmlProcess.charAt(i).match(/[a-z]/i));
      var pipeDirectory = 'src/app/pipes/' + newPipe + '.pipe';
      var pipeName = newPipe[0].toUpperCase() + newPipe.substring(1) + "Pipe";

      // Prevent adding repeat pipes
      var containsPipe = imports.some(function (el) {
        return el.name === pipeName;
      });
      if (!containsPipe) {
        imports.push({
          name: pipeName,
          alias: undefined,
          moduleName: pipeDirectory
        });
      }
    }
    htmlProcess = htmlProcess.substring(nextPipe + 1);
    nextPipe = htmlProcess.indexOf("|");
  };
  while (nextPipe >= 0) {
    _loop();
  }
  return imports;
}
function getKlassProperties() {
  return __toArray(this.klass.get('PropertyDeclaration')).concat(this.klass.get('SetAccessor')).concat(this.klass.get('GetAccessor')).map(function (prop) {
    return __get(prop);
  }).filter(function (el) {
    return el.name;
  });
}
function getKlassSetters() {
  return __toArray(this.klass.get('SetAccessor'));
}
function getKlassGetters() {
  return __toArray(this.klass.get('GetAccessor'));
}
function getKlassMethods() {
  return __toArray(this.klass.get('MethodDeclaration'));
}
function getKlass() {
  var parsed = new _typescriptParser["default"](this.typescript);
  var fileBasedKlassName = _util["default"].getClassName(this.tsPath);
  var klassDeclarations = __toArray(parsed.rootNode.get('ClassDeclaration'));
  var klass = klassDeclarations.find(function (decl) {
    return decl.node.name.escapedText === fileBasedKlassName;
  }) || klassDeclarations[0];
  if (!klass) {
    throw new Error("Error:TypeScriptParser Could not find " + "".concat(fileBasedKlassName || 'a class', " from ").concat(this.tsPath));
  }
  return klass;
}
function getAngularType() {
  return (__get(this.klass).decorator || {}).name;
}

// import statement mocks;
function getImportMocks() {
  var _this = this;
  var importMocks = [];
  var klassName = this.klass.node.name.escapedText;
  var moduleName = path.basename(this.tsPath).replace(/.ts$/, '');
  var imports = {};
  if (['component', 'directive'].includes(this.angularType)) {
    imports["@angular/core"] = ['Component'];
  }
  imports["./".concat(moduleName)] = [klassName];
  if (this.klass.get('Constructor').node) {
    var paremeters = this.klass.get('Constructor').node.parameters;
    paremeters.forEach(function (param) {
      var _get = __get(param),
        name = _get.name,
        type = _get.type,
        decorator = _get.decorator;
      var exportName = decorator ? decorator.name : type;
      var emport = _this.imports.find(function (el) {
        return el.name === exportName;
      }); // name , alias

      var importStr = emport.alias ? "".concat(exportName, " as ").concat(emport.alias) : exportName;
      if (exportName === 'Inject') {
        // do not import Inject, but import Inject name
        var commonTypes = ['APP_BASE_HREF', 'DOCUMENT', 'LOCATION_INITIALIZED', 'Time'];
        var importLib = commonTypes.includes(decorator.param) ? '@angular/common' : '@angular/core';
        imports[importLib] = (imports[importLib] || []).concat(decorator.param);
      } else {
        if (importStr === 'ToastrService') {
          imports[emport.moduleName] = (imports[emport.moduleName] || []).concat('ToastrModule');
        }
        imports[emport.moduleName] = (imports[emport.moduleName] || []).concat(importStr);
      }
    });
  }
  for (var lib in imports) {
    var fileNames = imports[lib].join(', ');
    importMocks.push("import { ".concat(fileNames, " } from '").concat(lib, "';"));
  }

  // Iterate through HTML associated with Typescript to find imports that are needed in pipes
  // These pipes are assumed to be generated through Angular and will be built in a specific way
  var htmlProcess = this.html;
  var nextPipe = htmlProcess ? htmlProcess.indexOf("|") : -1;
  var _loop2 = function _loop2() {
    var i = htmlProcess.indexOf("|");
    if (htmlProcess.charAt(i + 1) === "|") {
      // Avoid processing || operator as a pipe

      nextPipe += 2;
    } else {
      var newPipe = "";

      // In case the first character AFTER "|" isn't whitespace, check if there is a character there.
      if (htmlProcess.charAt(nextPipe + 1).match(/[a-z]/i)) {
        i++;
      } else {
        i += 2;
      }

      // Look through HTML until it finds a non-letter.
      // For example, if the HTML snippet is "... | filter:filterData ...", we want "filter"
      do {
        newPipe = newPipe.concat(htmlProcess.charAt(i));
        i++;
      } while (htmlProcess.charAt(i).match(/[a-z]/i));
      var pipeDirectory = 'src/app/pipes/' + newPipe + '.pipe';
      var pipeName = newPipe[0].toUpperCase() + newPipe.substring(1) + "Pipe";

      // Prevent adding repeat pipes
      var containsPipe = importMocks.some(function (el) {
        return el.indexOf(pipeName) >= 0;
      });
      if (!containsPipe) {
        importMocks.push("import { ".concat(pipeName, " } from '").concat(pipeDirectory, "';"));
      }
    }
    htmlProcess = htmlProcess.substring(nextPipe + 1);
    nextPipe = htmlProcess.indexOf("|");
  };
  while (nextPipe >= 0) {
    _loop2();
  }
  return importMocks;
}
function getProviderMocks(ctorMockData) {
  var _this2 = this;
  var providerMocks = {
    providers: [],
    mocks: []
  };
  if (!this.klass.get('Constructor').node) {
    return providerMocks;
  }
  var paremeters = this.klass.get('Constructor').node.parameters;
  paremeters.forEach(function (param) {
    var _get2 = __get(param),
      name = _get2.name,
      type = _get2.type,
      decorator = _get2.decorator;
    var injectClassName = decorator && decorator.name === 'Inject' && decorator.param;
    var injectUseStatement = injectClassName === 'DOCUMENT' ? "useClass: MockDocument" : injectClassName === 'PLATFORM_ID' ? "useValue: 'browser'" : injectClassName === 'LOCALE_ID' ? "useValue: 'en'" : "useValue: ".concat(injectClassName);
    var mockData = ctorMockData[name];
    mockData && delete mockData['undefiend'];
    var mockDataJS = !mockData ? [] : Object.entries(mockData).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      return "".concat(k, " = ").concat(_util["default"].objToJS(v), ";");
    });
    var emport = _this2.imports.find(function (el) {
      return el.name === type;
    }); // name , alias, moduleName
    var emportFromFile = !!(emport && emport.moduleName.match(/^(\.|src\/)/));
    var configMockJS = _this2.config.providerMocks[type];
    var mockFn;
    if (type !== 'Object' && emportFromFile) {
      mockFn = (mockDataJS || []).concat(configMockJS);
    } else if (configMockJS) {
      mockFn = (mockDataJS || []).concat(configMockJS);
    }
    if (type.includes('Service') && mockFn) {
      if (emport && emport.moduleName) {
        var pathName = emport.moduleName.split('../').pop();
        var specPath = path.resolve(_this2.config.srcPath + '\\src\\app', pathName) + ".ts";
        var readServiceFile = fs.readFileSync(specPath, 'utf8');
        var parsed = new _typescriptParser["default"](readServiceFile);
        var methodName = parsed.rootNode.children.filter(function (nodeN) {
          return nodeN.syntaxKind === "ClassDeclaration";
        })[0].children.filter(function (el) {
          return el.syntaxKind === "MethodDeclaration";
        });
        mockFn = methodName.map(function (value) {
          var fnName = value.nodeText.split('{')[0];
          if (!fnName.includes("ng")) {
            return fnName + '{}';
          }
        });
      }
    }
    if (mockFn) {
      providerMocks.mocks.push(_util["default"].indent("\n        @Injectable()\n        class Mock".concat(type, " {\n          ").concat(mockFn.join('\n'), "\n        }")).replace(/\n\s*?\n/gm, '\n') // remove empty lines
      .replace(/\{\s+?}\s*?/gm, '{}\n') // ...{\n} to ...{}
      );
    }

    // code for providers section at @Component({providers: XXXXXXXXX}
    if (type === 'ActivatedRoute') {
      providerMocks.providers.push("{\n          provide: ActivatedRoute,\n          useValue: {\n            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},\n            url: observableOf('url'),\n            params: observableOf({}),\n            queryParams: observableOf({}),\n            fragment: observableOf('fragment'),\n            data: observableOf({})\n          }\n        }");
    } else if (_this2.config.providerMocks[type]) {
      // if mock is given from config
      providerMocks.providers.push("{ provide: ".concat(type, ", useClass: Mock").concat(type, " }"));
    } else if (emportFromFile) {
      providerMocks.providers.push("{ provide: ".concat(type, ", useClass: Mock").concat(type, " }"));
    } else if (injectClassName) {
      providerMocks.providers.push("{ provide: '".concat(injectClassName, "', ").concat(injectUseStatement, " }"));
    } else {
      providerMocks.providers.push(type);
    }
  });
  return providerMocks;
}
function getInputMocks() {
  var inputMocks = {
    html: [],
    js: []
  };
  this.klassProperties.forEach(function (_ref3) {
    var type = _ref3.type,
      name = _ref3.name,
      decorator = _ref3.decorator;
    if (decorator && decorator.name === 'Input') {
      inputMocks.html.push("[".concat(decorator.param || name, "]=\"").concat(name, "\""));
      inputMocks.js.push("".concat(name, ": ").concat(type, ";"));
    }
  });
  return inputMocks;
}
function getOutputMocks() {
  var outputMocks = {
    html: [],
    js: []
  };
  this.klassProperties.forEach(function (_ref4) {
    var type = _ref4.type,
      name = _ref4.name,
      decorator = _ref4.decorator;
    var funcName = "on".concat(name.replace(/^[a-z]/, function (x) {
      return x.toUpperCase();
    }));
    if (decorator && decorator.name === 'Output') {
      outputMocks.html.push("(".concat(decorator.param || name, ")=\"").concat(funcName, "($event)\""));
      outputMocks.js.push("".concat(funcName, "(event): void { /* */ }"));
    }
  });
  return outputMocks;
}
function getComponentProviderMocks() {
  var mocks = [];
  var decorator = __getKlassDecorator(this.klass);
  if (decorator.providers) {
    var klassNames = decorator.providers.elements.map(function (el) {
      return el.escapedText;
    });
    var providerMocks = klassNames.filter(function (name) {
      return name;
    }).map(function (name) {
      return "{ provide: ".concat(name, ", useClass: Mock").concat(name, " }");
    });
    if (providerMocks.length) {
      mocks.push("set: { providers: [".concat(providerMocks.join(',\n'), "] }"));
    }
  }
  return mocks;
}
function getDirectiveSelector() {
  var decorator = __getKlassDecorator(this.klass);
  if (decorator.selector) {
    var selectorTxt = decorator.selector.text;
    if (selectorTxt.match(/^\[/)) {
      return {
        type: 'attribute',
        value: selectorTxt,
        name: selectorTxt.match(/[^\[\]]+/)[0]
      };
    } else if (selectorTxt.match(/^\./)) {
      return {
        type: 'class',
        value: selectorTxt,
        name: selectorTxt.match(/[^\.]+/)[0]
      };
    } else if (selectorTxt.match(/^[a-z]/i)) {
      return {
        type: 'element',
        value: selectorTxt,
        name: selectorTxt.match(/[a-z-]+/)[0]
      };
    }
  }
}
function getExistingTests(ejsData, existingTestCodes) {
  var existingTests = {};
  var allTests = Object.assign({}, ejsData.accessorTests || {}, ejsData.functionTests || {});
  for (var funcName in allTests) {
    // e.g. compoent.myFuncName(any, goes, here);
    var re = new RegExp("\\S+.".concat(funcName, "\\(?[\\s\\S]*\\)?;"), 'm');
    existingTests[funcName] = !!existingTestCodes.match(re);
  }
  return existingTests;
}
function getGenerated(ejsData, options) {
  var generated;
  var funcName = options.method;
  var specPath = path.resolve(this.tsPath.replace(/\.ts$/, '.spec.ts'));
  var existingTestCodes = fs.existsSync(specPath) && fs.readFileSync(specPath, 'utf8');
  if (funcName) {
    // if user asks to generate only one function
    generated = ejsData.functionTests[funcName] || ejsData.accessorTests[funcName];
  } else if (existingTestCodes && specPath && !options.force && !options.forcePrint) {
    // if there is existing tests, then add only new function tests at the end
    var existingTests = getExistingTests(ejsData, existingTestCodes);
    var newTests = [];
    var allTests = Object.assign({}, ejsData.accessorTests || {}, ejsData.functionTests || {});
    // get only new tests
    for (var method in existingTests) {
      existingTests[method] !== true && newTests.push('  // new test by createngtest' + allTests[method]);
    }
    if (newTests.length) {
      // add new tests at the end
      var re = /(\s+}\);?\s+)(}\);?\s*)$/;
      var testEndingMatch = existingTestCodes.match(re); // file ending parts
      if (testEndingMatch) {
        generated = existingTestCodes.replace(re, function (m0, m1, m2) {
          var newCodes = newTests.join('\n').replace(/[ ]+$/, '');
          return "".concat(m1).concat(newCodes).concat(m2);
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
function writeToSpecFile(specPath, generated) {
  fs.writeFileSync(specPath, generated);
  console.log('Generated unit test to', specPath);
}
function backupExistingFile(specPath, generated) {
  if (fs.existsSync(specPath)) {
    var backupTime = new Date().toISOString().replace(/[^\d]/g, '').slice(0, -5);
    var backupContents = fs.readFileSync(specPath, 'utf8');
    if (backupContents !== generated) {
      fs.writeFileSync("".concat(specPath, ".").concat(backupTime), backupContents, 'utf8'); // write backup
      console.log('Backup the exisiting file to', "".concat(specPath, ".").concat(backupTime));
    }
  }
}
;
function writeGenerated(generated, options) {
  var toFile = options.spec;
  var force = options.force;
  var specPath = path.resolve(this.tsPath.replace(/\.ts$/, '.spec.ts'));
  generated = generated.replace(/\r\n/g, '\n');
  var specFileExists = fs.existsSync(specPath);
  if (toFile && specFileExists && force) {
    backupExistingFile(specPath, generated);
    writeToSpecFile(specPath, generated);
  } else if (toFile && specFileExists && !force) {
    var readline = require('readline');
    var rl = readline.createInterface(process.stdin, process.stdout);
    console.warn('\x1b[33m%s\x1b[0m', "WARNING!!, Spec file, ".concat(specPath, " already exists. Overwrite it?"));
    rl.question('Continue? ', function (answer) {
      if (answer.match(/y/i)) {
        backupExistingFile(specPath, generated);
        writeToSpecFile(specPath, generated);
      } else {
        process.stdout.write(generated);
      }
      rl.close();
    });
  } else if (toFile && !specFileExists) {
    backupExistingFile(specPath, generated);
    writeToSpecFile(specPath, generated);
  } else if (!toFile) {
    process.stdout.write(generated);
  }
}
function getImportArray() {
  var importArray = [];
  var toaster = this.imports.find(function (el) {
    return el.name === 'ToastrService';
  });
  if (toaster) {
    importArray.push('ToastrModule.forRoot()');
  }
  return importArray;
}
function getPipeArray() {
  var pipeArray = [];
  var pipes = this.imports.filter(function (el) {
    return el.name.includes('Pipe');
  });
  pipes.forEach(function (pipe) {
    pipeArray.push(pipe.name);
  });
  return pipeArray;
}
var CommonGenFunctions = {
  getKlass: getKlass,
  getImports: getImports,
  getKlassProperties: getKlassProperties,
  getKlassGetters: getKlassGetters,
  getKlassSetters: getKlassSetters,
  getKlassMethods: getKlassMethods,
  getAngularType: getAngularType,
  getInputMocks: getInputMocks,
  // input coddes
  getOutputMocks: getOutputMocks,
  // output codes
  getImportMocks: getImportMocks,
  // import statements code
  getProviderMocks: getProviderMocks,
  // module provider code
  getComponentProviderMocks: getComponentProviderMocks,
  getDirectiveSelector: getDirectiveSelector,
  getImportArray: getImportArray,
  getPipeArray: getPipeArray,
  getGenerated: getGenerated,
  writeGenerated: writeGenerated
};
var _default = CommonGenFunctions; //module.exports = CommonGenFunctions;
exports["default"] = _default;