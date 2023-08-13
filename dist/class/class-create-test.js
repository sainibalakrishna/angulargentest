"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs"));
var CommonTestGen = _interopRequireWildcard(require("../generic-create-test.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // const path = require('path');
// const fs = require('fs');
//const CommonTestGen = require('../generic-create-test.js');
var ClassTestGen = /*#__PURE__*/function () {
  function ClassTestGen(tsPath, config) {
    _classCallCheck(this, ClassTestGen);
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
      this.config = config;
    } else {
      throw new Error("Error. invalid typescript file.");
    }
    this.tsPath = tsPath;
    console.log("tsPath", this.tsPath);
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
    this.template = config.templates.klass;
    this.klass = CommonTestGen.getKlass.bind(this)();
    this.imports = CommonTestGen.getImports.bind(this)();
    this.angularType = CommonTestGen.getAngularType.bind(this)();
    this.klassProperties = CommonTestGen.getKlassProperties.bind(this)();
    this.klassGetters = CommonTestGen.getKlassGetters.bind(this)(), this.klassSetters = CommonTestGen.getKlassSetters.bind(this)(), this.klassMethods = CommonTestGen.getKlassMethods.bind(this)(), this.getProviderMocks = CommonTestGen.getProviderMocks.bind(this);
    this.getGenerated = CommonTestGen.getGenerated.bind(this);
    this.writeGenerated = CommonTestGen.writeGenerated.bind(this);
  }
  _createClass(ClassTestGen, [{
    key: "getData",
    value: function getData() {
      var ejsData = {
        className: this.klass.node.name.escapedText,
        importMocks: CommonTestGen.getImportMocks.bind(this)(),
        inputMocks: CommonTestGen.getInputMocks.bind(this)(),
        outpuMocks: CommonTestGen.getOutputMocks.bind(this)(),
        componentProviderMocks: CommonTestGen.getComponentProviderMocks.bind(this)(),
        importArray: CommonTestGen.getImportArray.bind(this)(),
        ctorParamJs: undefined,
        // declarition only, will be set from mockData
        providerMocks: undefined,
        //  declarition only, will be set from mockData
        accessorTests: undefined,
        //  declarition only, will be set from mockData
        functionTests: undefined //  declarition only, will be set from mockData
      };

      return {
        ejsData: ejsData
      };
    }
  }]);
  return ClassTestGen;
}();
var _default = ClassTestGen;
exports["default"] = _default;