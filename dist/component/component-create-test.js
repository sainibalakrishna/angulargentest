"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs"));
var _genericCreateTest = _interopRequireDefault(require("../generic-create-test.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var ComponentTestGen = /*#__PURE__*/function () {
  function ComponentTestGen(tsPath, config) {
    _classCallCheck(this, ComponentTestGen);
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
      this.config = config;
    } else {
      throw new Error("Error. invalid typescript file. e.g., Usage $0 ".concat(tsPath, " [options]"));
    }
    this.tsPath = tsPath;
    this.html = fs.readFileSync(path.resolve(tsPath.replace('.ts', '.html')), 'utf8');
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
    this.template = config.templates.component;
    this.klass = _genericCreateTest["default"].getKlass.bind(this)();
    this.imports = _genericCreateTest["default"].getImports.bind(this)();
    this.angularType = _genericCreateTest["default"].getAngularType.bind(this)();
    this.klassProperties = _genericCreateTest["default"].getKlassProperties.bind(this)();
    this.klassGetters = _genericCreateTest["default"].getKlassGetters.bind(this)(), this.klassSetters = _genericCreateTest["default"].getKlassSetters.bind(this)(), this.klassMethods = _genericCreateTest["default"].getKlassMethods.bind(this)(), this.getProviderMocks = _genericCreateTest["default"].getProviderMocks.bind(this);
    this.getGenerated = _genericCreateTest["default"].getGenerated.bind(this);
    this.writeGenerated = _genericCreateTest["default"].writeGenerated.bind(this);
  }
  _createClass(ComponentTestGen, [{
    key: "getData",
    value: function getData() {
      var ejsData = {
        className: this.klass.node.name.escapedText,
        importMocks: _genericCreateTest["default"].getImportMocks.bind(this)(),
        inputMocks: _genericCreateTest["default"].getInputMocks.bind(this)(),
        outputMocks: _genericCreateTest["default"].getOutputMocks.bind(this)(),
        componentProviderMocks: _genericCreateTest["default"].getComponentProviderMocks.bind(this)(),
        importArray: _genericCreateTest["default"].getImportArray.bind(this)(),
        pipeArray: _genericCreateTest["default"].getPipeArray.bind(this)(),
        selector: _genericCreateTest["default"].getDirectiveSelector.bind(this)(),
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
  return ComponentTestGen;
}();
var _default = ComponentTestGen;
exports["default"] = _default;