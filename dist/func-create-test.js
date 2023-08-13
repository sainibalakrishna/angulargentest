"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var jsParser = _interopRequireWildcard(require("acorn"));
var Util = _interopRequireWildcard(require("./util.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // const jsParser = require('acorn').Parser;
// const Util = require('./util.js');
var FuncTestGen = /*#__PURE__*/function () {
  // TODO: differntiate the same name getter/setter function getter/setter
  function FuncTestGen(Klass, funcName, funcType) {
    var _this = this;
    _classCallCheck(this, FuncTestGen);
    this.Klass = Klass;
    this.funcName = funcName;
    this.funcType = funcType; // constructor, get, set, method
    this.classCode = '' + Klass.prototype.constructor;
    this.klassDecl = jsParser.Parser.parse(this.classCode).body[0];
    var methodDefinition = this.klassDecl.body.body.find(function (node) {
      return node.kind === _this.funcType && node.key.name === _this.funcName;
    });
    if (methodDefinition) {
      this.funcCode = this.classCode.substring(methodDefinition.start, methodDefinition.end);
      this.isAsync = this.funcCode.includes('return __awaiter(this, void 0, void 0, function* ()');
    }
  }
  _createClass(FuncTestGen, [{
    key: "getCode",
    value: function getCode(node) {
      return this.classCode.substring(node.start, node.end);
    }
  }, {
    key: "getInitialParameters",
    value: function getInitialParameters() {
      var _this2 = this;
      var params = {};
      // TODO:  differntiate the same name function getter/setter
      var methodDefinition = this.klassDecl.body.body.find(function (node) {
        return node.kind === _this2.funcType && node.key.name === _this2.funcName;
      });
      if (methodDefinition) {
        methodDefinition.value.params.forEach(function (el) {
          return params[el.name] = {};
        });
      }
      return params;
    }
  }, {
    key: "getExpressionStatements",
    value: function getExpressionStatements() {
      var _this3 = this;
      var methodDefinition = this.klassDecl.body.body.find(function (node) {
        return node.key.name === _this3.funcName;
      });
      if (methodDefinition) {
        var block = methodDefinition.value.body;
        return block.body; // array of ExpressionStatements
      }

      return [];
    }

    /**
     * Iterate function expressions one by one
     *  then, sets the given props, params, maps from the expressinns
     */
  }, {
    key: "setMockData",
    value: function setMockData(node, mockData, returnValue) {
      var _this4 = this;
      // node: ExpressionStatement
      if (!node) return;
      Util.DEBUG && console.log('    *** EXPRESSION ' + node.type + ' ***', this.getCode(node));
      if (['BreakStatement', 'Identifier', 'Literal', 'ThisExpression', 'ThrowStatement', 'ContinueStatement', 'DebuggerStatement'].includes(node.type)) {
        // ignore these expressions/statements, which is meaningless for mockData
      } else if (node.type === 'ArrayExpression') {
        node.elements.forEach(function (element) {
          _this4.setMockData(element, mockData);
        });
      } else if (node.type === 'ArrayPattern') {
        node.elements.forEach(function (element) {
          _this4.setMockData(element, mockData);
        });
      } else if (node.type === 'ArrowFunctionExpression') {
        // params, body
        this.setMockData(node.body, mockData);
      } else if (node.type === 'BinaryExpression') {
        this.setMockData(node.right, mockData);
        this.setMockData(node.left, mockData);
      } else if (node.type === 'BlockStatement') {
        node.body.forEach(function (expr) {
          _this4.setMockData(expr, mockData);
        });
      } else if (node.type === 'CatchClause') {
        this.setMockData(node.block, mockData);
        this.setMockData(node.handler, mockData);
      } else if (node.type === 'ConditionalExpression') {
        this.setMockData(node.test, mockData);
        this.setMockData(node.consequent, mockData);
        this.setMockData(node.alternate, mockData);
      } else if (node.type === 'ExpressionStatement') {
        this.setMockData(node.expression, mockData);
      } else if (node.type === 'ForInStatement') {
        this.setMockData(node.left, mockData);
        this.setMockData(node.body, mockData);
      } else if (node.type === 'ForOfStatement') {
        this.setMockData(node.left, mockData);
        this.setMockData(node.right, mockData);
        this.setMockData(node.body, mockData);
      } else if (node.type === 'ForStatement') {
        // init, test, updte, boby
        this.setMockData(node.body, mockData);
      } else if (node.type === 'FunctionExpression') {
        // params, body
        this.setMockData(node.body, mockData);
      } else if (node.type === 'IfStatement') {
        this.setMockData(node.test, mockData);
        this.setMockData(node.consequent, mockData);
        this.setMockData(node.alternate, mockData);
      } else if (node.type === 'LogicalExpression') {
        this.setMockData(node.left, mockData);
        this.setMockData(node.right, mockData);
      } else if (node.type === 'NewExpression') {
        node.arguments.forEach(function (argument) {
          _this4.setMockData(argument, mockData);
        });
      } else if (node.type === 'ObjectExpression') {
        node.properties.forEach(function (property) {
          _this4.setMockData(property.value, mockData);
        });
      } else if (node.type === 'ReturnStatement') {
        this.setMockData(node.argument, mockData);
      } else if (node.type === 'SpreadElement') {
        this.setMockData(node.argument, mockData);
      } else if (node.type === 'SwitchStatement') {
        this.setMockData(node.discriminant, mockData);
        node.cases.forEach(function (kase) {
          _this4.setMockData(kase.test, mockData);
          kase.consequent.forEach(function (stmt) {
            return _this4.setMockData(stmt, mockData);
          });
        });
      } else if (node.type === 'TemplateLiteral') {
        node.expressions.forEach(function (expr) {
          return _this4.setMockData(expr, mockData);
        });
      } else if (node.type === 'TryStatement') {
        this.setMockData(node.block, mockData);
      } else if (node.type === 'UnaryExpression') {
        this.setMockData(node.argument, mockData);
      } else if (node.type === 'UpdateExpression') {
        this.setMockData(node.argument, mockData);
      } else if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(function (decl) {
          // decl.id, decl.init
          _this4.setMockDataMap(decl, mockData);
          var declReturn = Util.getObjFromVarPattern(decl.id);
          _this4.setMockData(decl.init, mockData, declReturn);
        });
      } else if (node.type === 'WhileStatement') {
        this.setMockData(node.test, mockData);
        this.setMockData(node.body, mockData);
      } else if (node.type === 'WhileExpression') {
        this.setMockData(node.test, mockData);
        this.setMockData(node.body, mockData);
      } else if (node.type === 'YieldExpression') {
        this.setMockData(node.argument, mockData);
      } else if (node.type === 'AssignmentExpression') {
        var mapped = this.setMockDataMap(node, mockData); // setting map data for this expression
        if (mapped.type !== 'param') {
          // do NOT remove this
          // skip param mapping e.g. `this.param = param`, which causes a bug. 
          // map, `map[this.param] = param` will be used later
          this.setMockData(node.right, mockData);
          this.setMockData(node.left, mockData);
        }
      } else if (node.type === 'CallExpression') {
        // callee, arguments
        var kode = this.getCode(node);
        var funcReturn = Util.getFuncReturn(kode);
        var exprReturnValue = returnValue || funcReturn;
        this.setPropsOrParams(kode, mockData, exprReturnValue);
        this.setMockData(node.callee, mockData);
        node.arguments.forEach(function (argument) {
          return _this4.setMockData(argument, mockData);
        });

        // const funcExpArg = Util.isFunctionExpr(node) && node.arguments[0];
        // if (funcExpArg) { // when call arg is a function, process a FunctionExpression
        //   this.setMockData(funcExpArg, mockData);
        // }
      } else if (node.type === 'MemberExpression') {
        this.setPropsOrParams(node, mockData);
        this.setMockData(node.object, mockData);
      } else {
        console.error("ERROR: Invalid JS node type ".concat(node.type, " '").concat(this.getCode(node), "'"));
        throw new Error("ERROR: Invalid JS node type ".concat(node.type, " '").concat(this.getCode(node), "'"));
      }
    }

    /**
     * set mockdata map for AssignmentExpression return mapped key and value
     * only if right-side source start with . this.xxxx or a parameter
     *   and left-side target is following
     *      . starts with this.yyyy or yyyy
     *      . and this.yyyy or yyyy used in this.funcCode at least twice. search it with this.xxx. or xxx.
     *      . e.g., `\{\nxxx.yyy.zzz, \n   xx.yy \n foo.bar.xxx.yyy\n\n this.a=xxx.yys`.match(/[^\.]xxx\./g)
     */
  }, {
    key: "setMockDataMap",
    value: function setMockDataMap(node, mockData) {
      if (!['AssignmentExpression', 'VariableDeclarator'].includes(node.type)) throw '%%%%%%%%%%%%%%% Error in setMockDataMap type, ' + node.type;
      var nodeLeft, nodeRight;
      var rightTypes = ['LogicalExpression', 'MemberExpression', 'CallExpression', 'Identifier'];
      if (node.type === 'AssignmentExpression' && rightTypes.includes(node.right.type)) {
        nodeLeft = node.left;
        nodeRight = node.right.type === 'LogicalExpression' ? node.right.left : node.right;
      } else if (node.type === 'VariableDeclarator' && node.init) {
        if (rightTypes.includes(node.init.type)) {
          nodeLeft = node.id;
          nodeRight = node.init.type === 'LogicalExpression' ? node.init.left : node.init;
        }
      }
      var mapped = {};
      if (
      // ignore if left-side is a ObjectExpression or Array Pattern
      nodeLeft && nodeRight && ['Identifier', 'MemberExpression'].includes(nodeLeft.type)) {
        var _ref = [this.getCode(nodeLeft), this.getCode(nodeRight)],
          leftCode = _ref[0],
          rightCode = _ref[1];
        var paramNames = Object.keys(mockData.params);
        var paramMatchRE = paramNames.length ? new RegExp("^(".concat(paramNames.join('|'), ")$")) : undefined;

        // only if left-side is a this.llll or llll
        if (leftCode.match(/^this\.[a-zA-Z0-9_$]+$/) || leftCode.match(/^[a-zA-Z0-9_$]+$/)) {
          var numLeftCodeRepeats = (this.funcCode.match(new RegExp("[^\\.]".concat(leftCode, "\\."), 'g')) || []).length;
          var rightCodeVarName = rightCode.replace(/\s+/g, '').replace(/\(.*\)/g, '()');
          if (!mockData.map[leftCode] && paramMatchRE && rightCode.match(paramMatchRE)) {
            if (leftCode !== rightCodeVarName) {
              // ignore map to the same name, it causes a bug
              mockData.map[leftCode] = rightCodeVarName;
              mapped = {
                type: 'param',
                key: leftCode,
                value: rightCodeVarName
              };
            }
            // or right-side starts with . this.xxxx 
          } else if (!mockData.map[leftCode] && numLeftCodeRepeats > 0) {
            mockData.map[leftCode] = rightCodeVarName;
            mapped = {
              type: 'this',
              key: leftCode,
              value: rightCodeVarName
            };
          }
        }
      }
      return mapped;
    }

    /**
     * Process single expression and sets 'this' or params refrencing props to param map
     */
  }, {
    key: "setPropsOrParams",
    value: function setPropsOrParams(codeOrNode, mockData, returns) {
      // MemberExpression, CallExpression
      var props = mockData.props,
        params = mockData.params,
        map = mockData.map,
        globals = mockData.globals;
      var nodeToUse, obj, one, two, code;
      if (typeof codeOrNode === 'string') {
        nodeToUse = Util.getNode(codeOrNode);
        code = codeOrNode;
        obj = Util.getObjectFromExpression(code, returns);
        // this.prop
        var _codeOrNode$split = codeOrNode.split('.');
        var _codeOrNode$split2 = _slicedToArray(_codeOrNode$split, 2);
        one = _codeOrNode$split2[0];
        two = _codeOrNode$split2[1];
      } else {
        nodeToUse = /* eslint-disable */
        codeOrNode.type === 'LogicalExpression' ? codeOrNode.left : codeOrNode.type === 'BinaryExpression' ? codeOrNode.left : codeOrNode; /* eslint-enable */
        code = this.getCode(codeOrNode);
        obj = Util.getObjectFromExpression(code, returns);
        // this.prop
        var _code$split = code.split('.');
        var _code$split2 = _slicedToArray(_code$split, 2);
        one = _code$split2[0];
        two = _code$split2[1];
      }
      Util.DEBUG && console.log('      ** setPropsOrParams', {
        one: one,
        two: two,
        code: code
      });
      var variableExpression = code.replace(/\s+/g, '').replace(/\(.*\)/g, '');
      var mapKey = (variableExpression.match(/(this\.)?[a-zA-Z0-9_\$]+/) || [])[0]; // foo or this.foo
      var exprFoundInMap = Object.entries(map).find(
      // set map only if `expression.` is used
      function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          k = _ref3[0],
          v = _ref3[1];
        return variableExpression.startsWith(k + '.');
      });
      var loopCondition = exprFoundInMap && exprFoundInMap[1].startsWith(exprFoundInMap[0]);
      if (map[mapKey] && params[map[mapKey]]) {
        // if param mapped
        if (one === 'this' && two && map["this.".concat(two)]) {
          // if param map found
          Util.merge(obj["this"], params);
        } else {
          Util.merge(code, obj, params);
        }
      } else if (map[mapKey] && exprFoundInMap && !loopCondition) {
        // if non-param map found
        var newlyMappedCode = code.replace(mapKey, map[mapKey]);
        this.setPropsOrParams(newlyMappedCode, mockData, returns);
      } else {
        if (one === 'this' && two) {
          Util.merge(obj["this"], props);
        } else if (params[one] && two) {
          Util.merge(obj, params);
        } else if (one === 'window' || obj === 'document') {
          Util.merge(obj, globals);
        }
      }
    }
  }]);
  return FuncTestGen;
}();
var _default = FuncTestGen;
exports["default"] = _default;