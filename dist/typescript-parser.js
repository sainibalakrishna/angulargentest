"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _typescript = _interopRequireDefault(require("typescript"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } //const ts = require('typescript');
var TypescriptParser = /*#__PURE__*/function () {
  function TypescriptParser(code) {
    _classCallCheck(this, TypescriptParser);
    var sourceFile = _typescript["default"].createSourceFile('temp.ts', code, _typescript["default"].ScriptTarget.Latest);
    this.rootNode = this.getRecursiveFrom(sourceFile, sourceFile);
  }
  _createClass(TypescriptParser, [{
    key: "getRecursiveFrom",
    value: function getRecursiveFrom(node, sourceFile) {
      var _this = this;
      var syntaxKind = _typescript["default"].SyntaxKind[node.kind];
      var nodeText = node.getText(sourceFile);
      var children = [];
      node.forEachChild(function (child) {
        children.push(_this.getRecursiveFrom(child, sourceFile));
      });
      var getFunc = function getFunc() {
        return {
          get: getFunc
        };
      };
      var get = function get(kind) {
        var all = this.children.filter(function (el) {
          return el.syntaxKind === kind;
        });
        return all.length === 0 ? {
          get: getFunc
        } : all.length === 1 ? all[0] : all;
      };
      return {
        node: node,
        syntaxKind: syntaxKind,
        nodeText: nodeText,
        children: children,
        get: get
      };
    }
  }]);
  return TypescriptParser;
}();
var _default = TypescriptParser; // 
// var Parser = require('./src/typescript-parser.js');
// 
// var typescript = `
// @Component({
//   selector: 'app-root',
//   template: '<div>Example Component</div>',
//   styles: [''],
//   providers: [FooKlass],
//   x: {foo:1, bar:2}
// })
// class X {}
// `;
// 
// var parsed = new Parser(typescript);
// const klassDecorator = {};
// parsed.rootNode.get('ClassDeclaration')
//   .get('Decorator')
//   .get('CallExpression')
//   .get('ObjectLiteralExpression')
//   .get('PropertyAssignment')
//   .forEach(el => {
//     const key = el.children[0].node.escapedText;
//     const value = el.children[1].node;
//     klassDecorator[key] = value;
//    })
// 
// console.log(klassDecorator)
exports["default"] = _default;