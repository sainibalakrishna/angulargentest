"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var jsParser = _interopRequireWildcard(require("acorn"));
var path = _interopRequireWildcard(require("path"));
var indentJs = _interopRequireWildcard(require("indent.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // const jsParser = require('acorn').Parser;
// const path = require('path');
// const indentJs = require('indent.js');
var strFuncRE = /^(slice|trim|substr|replace|split|toLowerCase|toUpperCase|match)$/;
var arrFuncRE = /^(forEach|map|reduce|slice|filter)$/;
var obsFuncRE = /^(subscribe|pipe|post|put)$/;
var Util = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }
  _createClass(Util, null, [{
    key: "DEBUG",
    get: function get() {
      return !!Util.__debug;
    },
    set: function set(bool) {
      Util.__debug = bool;
    }
  }, {
    key: "getCode",
    value: function getCode(node, code) {
      return code.substring(node.start, node.end);
    }
  }, {
    key: "isFunctionExpr",
    value: function isFunctionExpr(node) {
      return node.arguments && node.arguments[0] && node.arguments[0].type.match(/FunctionExpression/);
    }

    // returns function parameters as a named object
    // node.type Identifier, ObjectPattern, ArrayPattern 
    // e.g. function >>>> ([a,b,{c,d},[e,f]]) <<<< {} returns ['a', 'b', {c:{}, d: {}}, ['e', 'f']]
  }, {
    key: "getObjFromVarPattern",
    value: function getObjFromVarPattern(node) {
      if (node.type === 'Identifier') {
        return node.name;
      } else if (node.type === 'ObjectPattern') {
        var obj = {};
        node.properties.forEach(function (prop) {
          return obj[prop.key.name] = {};
        });
        return obj;
      } else if (node.type === 'ArrayPattern') {
        var arr = [];
        node.elements.forEach(function (el) {
          return arr.push(Util.getObjFromVarPattern(el));
        });
        return arr;
      }
    }
  }, {
    key: "getAngularType",
    value: function getAngularType(typescript) {
      return typescript.match(/^\s*@Component\s*\(/m) ? 'component' : /* eslint-disable */
      typescript.match(/^\s*@Directive\s*\(/m) ? 'directive' : typescript.match(/^\s*@Injectable\s*\(/m) ? 'service' : typescript.match(/^\s*@Pipe\s*\(/m) ? 'pipe' : 'obj'; /* eslint-enable */
    }
  }, {
    key: "getClassName",
    value: function getClassName(tsPath) {
      return path.basename(tsPath).replace(/\.[a-z]+$/, '') // remove extension
      .split(/[^a-z0-9]/i) // each word
      .map(function (el) {
        return el[0].toUpperCase() + el.slice(1);
      }) // capitalize 1st ch.
      .join('');
    }
  }, {
    key: "indent",
    value: function indent(str) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      // const opts = Object.assign({ indent_size: 2 }, moreOpts);
      // return beautify(str, opts);
      str = indentJs.ts(str, {
        tabString: '  '
      });
      str = str + prefix;
      str = str.replace(/\n/gm, '\n' + prefix);
      return str;
    }
  }, {
    key: "getCallExhaustedReturn",
    value: function getCallExhaustedReturn(obj) {
      var firstKey = _typeof(obj) === 'object' && !Array.isArray(obj) && Object.keys(obj).filter(function (k) {
        return k !== 'undefined';
      })[0];
      if (typeof obj === 'function') {
        return Util.getCallExhaustedReturn(obj);
      } else if (firstKey && typeof obj[firstKey] === 'function') {
        return Util.getCallExhaustedReturn(obj[firstKey]());
      } else {
        return obj;
      }
    }
  }, {
    key: "objToJS",
    value: function objToJS(obj) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var exprs = [];
      var indent = ' '.repeat(level * 2);
      var firstKey = _typeof(obj) === 'object' && Object.keys(obj).filter(function (k) {
        return k !== 'undefined';
      })[0];
      if (typeof obj === 'function') {
        var objRet = obj();
        var objRet1stKey = Util.getFirstKey(objRet);
        if (!objRet1stKey) {
          return 'function() {}';
        } else {
          var funcRet = Util.objToJS(objRet, level + 1);
          return "function() {\n".concat(indent, "  return ").concat(funcRet, ";\n").concat(indent, "}");
        }
      } else if (firstKey && firstKey.match(strFuncRE)) {
        // sring function
        return "'createngtest'";
      } else if (firstKey && firstKey.match(arrFuncRE)) {
        // array function
        var paramArray = Util.getCallExhaustedReturn(obj);
        var paramValues = [].concat(paramArray).map(function (el) {
          return Util.objToJS(Util.getCallExhaustedReturn(el));
        });
        return "[".concat(paramValues.join(', '), "]");
      } else if (firstKey && firstKey.match(obsFuncRE)) {
        // observable function
        var _paramArray = Util.getCallExhaustedReturn(obj); // {}
        var _paramValues = [].concat(_paramArray).map(function (el) {
          return Util.objToJS(Util.getCallExhaustedReturn(el));
        });
        var valuesStr = _paramValues.length ? _paramValues.join(', ') : '{}';
        return "observableOf(".concat(valuesStr, ")");
      } else if (Array.isArray(obj)) {
        return JSON.stringify(obj, null, '  ');
      } else {
        for (var key in obj) {
          if (key === 'undefined' || !obj.hasOwnProperty(key)) {
            continue;
          }
          var obj1stKey = Util.getFirstKey(obj[key]);
          if (_typeof(obj[key]) === 'object' && !obj1stKey) {
            // is empty obj, e.g. {}
            exprs.push("".concat(key, ": ").concat(Util.objToJS(obj[key])));
          } else if (obj1stKey && obj1stKey.match(strFuncRE)) {
            // string in form of an object
            exprs.push("".concat(key, ": '").concat(key, "'"));
          } else if (_typeof(obj[key]) === 'object') {
            exprs.push("".concat(key, ": ").concat(Util.objToJS(obj[key], level + 1)));
          } else if (typeof obj[key] === 'function') {
            exprs.push("".concat(key, ": ").concat(Util.objToJS(obj[key], level + 1)));
          } else if (typeof obj[key] === 'string') {
            exprs.push("".concat(key, ": \"").concat(obj[key], "\""));
          } else {
            exprs.push("".concat(key, ": ").concat(obj[key]));
          }
        }
        return !exprs.length ? '{}' : '{\n' + exprs.map(function (el) {
          return "".concat(indent).concat(el);
        }).join(',\n') + '\n' + indent.substr(2) + '}';
      }
    }

    /**
     * set value from source ONLY IF target value does not exists
     *
     * For example, assuming source is {foo: {bar: 1}}, and target is {foo: {baz: 2}}
     * AFter this function, target wil become { foo: {bar: 1, baz: 2}}
     */
  }, {
    key: "merge",
    value: function merge(source, target) {
      var firstKey = Object.keys(source)[0];
      if (firstKey && !target[firstKey]) {
        target[firstKey] = source[firstKey];
      } else if (typeof source[firstKey] === 'function') {
        var sourceFuncRet = source[firstKey]();
        if (_typeof(sourceFuncRet) === 'object') {
          var targetFuncRet = typeof target[firstKey] === 'function' ? target[firstKey]() : {};
          var isTarget0EmptyObj = targetFuncRet[0] &&
          // e.g.,  { 0 : {} }
          Object.keys(targetFuncRet[0]).length === 0 && targetFuncRet[0].constructor === Object;
          var isTarget0Exists = targetFuncRet[0] &&
          // e.g.,  { 0 : {foo;bar} }
          Object.keys(targetFuncRet[0]).length !== 0 && targetFuncRet[0].constructor === Object;
          if (typeof targetFuncRet === 'string') {
            // ignore string values bcoz it's from var xxx = foo.bar()
            target[firstKey] = function () {
              return sourceFuncRet;
            };
          } else if (isTarget0EmptyObj) {
            delete target[firstKey][0];
            target[firstKey] = function () {
              return sourceFuncRet;
            };
          } else if (isTarget0Exists) {
            var ret = Object.assign({}, sourceFuncRet[0], targetFuncRet[0]);
            target[firstKey] = function () {
              return [ret];
            };
            // console.log('###################################', {sourceFuncRet, targetFuncRet})
          } else {
            var mergedFuncRet = Object.assign({}, sourceFuncRet, targetFuncRet);
            target[firstKey] = function () {
              return mergedFuncRet;
            };
          }
        } else if (typeof sourceFuncRet === 'string') {
          target[firstKey] = function () {
            return sourceFuncRet;
          };
        }
      } else if (firstKey && typeof source[firstKey] !== 'function') {
        Util.merge(source[firstKey], target[firstKey]);
      }
    }
  }, {
    key: "getNode",
    value: function getNode(code) {
      var parsed;
      if (code.replace(/\n/g, '').match(/^{.*}$/m)) {
        code = "(".concat(code, ")");
      }
      try {
        parsed = jsParser.Parser.parse(code);
      } catch (e) {
        throw new Error("ERROR Util.getNode JS code is invalid, \"".concat(code, "\""));
      }
      // const parsed = jsParser.parse(code);
      var firstNode = parsed.body[0];
      var node = firstNode.type === 'BlockStatement' ? firstNode.body[0] : firstNode.type === 'ExpressionStatement' ? firstNode.expression : null;
      return node;
    }

    /**
     * Returns dot(.) separated members as an array from an code expression in reverse order
     *
     * MemberExpression e.g., foo.bar().x -> [x, (), bar, foo]
     * CallExpression   e.g.  foo.x.bar() -> [(), bar, x, foo]
     * ThisExpression   e.g.  this -> [this]
     * Identifier       e.g.  foo -> [foo]
     */
  }, {
    key: "getExprMembers",
    value: function getExprMembers(code) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (typeof code !== 'string') throw new Error('%%%%%%%%%%%%%%%%%');
      var node = Util.getNode(code);
      var type = node.type,
        property = node.property,
        object = node.object,
        callee = node.callee;
      var member = /* eslint-disable */
      type === 'MemberExpression' ? property.name || property.raw : type === 'CallExpression' ? "(".concat(Util.getFuncArgNames(code), ")") : type === 'ThisExpression' ? 'this' : type === 'Identifier' ? node.name : undefined;
      member && result.push(member); /* eslint-enable */

      if (object) {
        // MemberExpression
        var kode = Util.getCode(object, code);
        result = Util.getExprMembers(kode, result);
      } else if (callee) {
        // CallExpression
        var _kode = Util.getCode(callee, code);
        result = Util.getExprMembers(_kode, result);
      } else if (node.left) {
        // BinaryExpression
        var _kode2 = Util.getCode(node.left, code);
        result = Util.getExprMembers(_kode2, result);
      }
      return result;
    }

    /**
     * return simplified function arguments in string format
     * e.g. from `myFunc(x => [x.y])`
     *     returns, 'x => [x.y]'
     * e.g. from `myFunc(foo, bar, [1,2], a||b, x(), foo.bar, {}, a ? b:c)`
     *     returns, 'foo,bar,[],BIN_EXPR,CALL_EXPR,MBR_EXPR,UNRU_EXPR,COND_EXPR'
     */
  }, {
    key: "getFuncArgNames",
    value: function getFuncArgNames(code) {
      if (typeof code !== 'string') throw new Error('%%%%%%%%%%%%%%%%% getFuncArgNames');
      var node = Util.getNode(code);
      var argNames = node.arguments.map(function (arg) {
        if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') {
          return code.substring(arg.start, arg.end);
        } else if (arg.params && arg.params[0] && arg.params[0].type === 'ArrayPattern') {
          return "ARR_PTRN";
        } else if (arg.type === 'ArrayExpression') {
          return "[]";
        } else if (typeof arg.value !== 'undefined') {
          return arg.raw || arg.value;
        } else if (arg.type === 'Identifier' && arg.name) {
          return arg.name;
        } else if (arg.type === 'BinaryExpression') return 'BIN_EXPR';else if (arg.type === 'CallExpression') return 'CALL_EXPR';else if (arg.type === 'LogicalExpression') return 'LOGI_EXPR';else if (arg.type === 'MemberExpression') return 'MBR_EXPR';else if (arg.type === 'NewExpression') return 'NEW_EXPR';else if (arg.type === 'ObjectExpression') return 'OBJ_EXPR';else if (arg.type === 'TemplateLiteral') return 'TMPL_LTRL';else if (arg.type === 'ThisExpression') return 'THIS_EXPR';else if (arg.type === 'UnaryExpression') return 'UNRY_EXPR';else if (arg.type === 'ConditionalExpression') return 'COND_EXPR';else if (arg.type === 'SpreadElement') return '...' + arg.name;else {
          console.error('\x1b[31m%s\x1b[0m', "Invalid function argument expression", arg);
          throw new Error("Invalid function argument type, ".concat(arg.type));
        }
      });
      return argNames.join(',');
    }

    /**
     * Build a Javascript object from expression by parsing expression members
     *
     * MemberExpression     e.g., foo.bar.x().y
     *   returns {foo: {bar: x: function() { return {y: {}}}}}
     * Identifier           e.g., foo
     *   returns {}
     * LogicalExpresssion   e.g., foo.bar.x().y || a.b
     *   returns {foo: {bar: x: function() { return {y: {}}}}}
     */
  }, {
    key: "getObjectFromExpression",
    value: function getObjectFromExpression(code) {
      var returns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getObjectFromExpression';
      if (code.match(/yield /)) {
        code = code.replace(/yield /g, '');
      }
      var node = Util.getNode(code);
      var exprMembers = Util.getExprMembers(code);
      var nxt, obj;
      var firstExpr = exprMembers[0];
      var isFirstExprFuncLike = firstExpr && firstExpr.startsWith('(');
      if (isFirstExprFuncLike && firstExpr === '()') {
        obj = function obj() {
          return returns;
        };
      } else if (isFirstExprFuncLike) {
        var _node = Util.getNode(firstExpr);
        if (_node.type.match(/FunctionExpression$/)) {
          var funcArguments = Util.getFuncArguments(firstExpr);
          obj = function obj() {
            return funcArguments;
          };
        } else {
          obj = function obj() {
            return returns;
          };
        }
      } else {
        obj = returns;
      }
      exprMembers.forEach(function (str, ndx) {
        nxt = exprMembers[ndx + 1];
        if (nxt && nxt.startsWith('(')) {
          var fnRet = _defineProperty({}, str, obj);
          obj = function obj() {
            return fnRet;
          };
        } else if (str && !str.startsWith('(')) {
          obj = _defineProperty({}, str, obj);
        }
      });
      return obj;
    }

    /**
     * return function argument value from a CallExpression code.
     * e.g. `x.y.z(foo => foo.bar.baz)` returns [{bar: {baz: {}} }
     * e.g. `x.y.z()` returns  undefined
     */
  }, {
    key: "getFuncReturn",
    value: function getFuncReturn(code) {
      if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncReturn';
      try {
        jsParser.Parser.parse(code);
      } catch (e) {
        throw new Error("ERROR this JS code is invalid, \"".concat(code, "\""));
      }
      var node = Util.getNode(code);
      var funcExprArg = Util.isFunctionExpr(node) && node.arguments[0];
      if (funcExprArg) {
        // if the first argument is a function
        var funcCode = code.substring(funcExprArg.start, funcExprArg.end);
        var funcArguments = Util.getFuncArguments(funcCode);
        return funcArguments;
      }
    }

    /**
     * return value-filled function arguments in array format
     * e.g. `foo => foo.bar.baz` returns [{bar: {baz: {}}]
     * e.g. `(foo,bar) => {}` returns [{}, {}]
     * e.g. `([foo,bar]) => {}` returns [[{}, {}]]
     * e.g. `({foo,bar}) => {}` returns [{foo:{}, bar:{}}]
     */
  }, {
    key: "getFuncArguments",
    value: function getFuncArguments(code) {
      if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncArguments ' + code;
      var paramValues = Util.getFuncParamObj(code); // {param1: value1, param2: value2}
      var node = Util.getNode(code);
      var funcParams = [];
      node.params.forEach(function (param, index) {
        if (param.type === 'ArrayPattern') {
          param.elements.forEach(function (prop) {
            var ret;
            if (prop.type === 'Identifier') {
              ret = paramValues[prop.name];
            } else if (prop.type === 'ArrayPattern') {
              ret = prop.elements.map(function (el) {
                return paramValues[el.name];
              });
            } else if (prop.type === 'ObjectPattern') {
              ret = {};
              prop.properties.forEach(function (prop) {
                ret[prop.key.name] = paramValues[prop.key.name];
              });
            }
            funcParams.push(ret);
          });
        } else if (param.type === 'ObjectPattern') {
          funcParams[index] = {};
          param.properties.forEach(function (prop) {
            funcParams[index][prop.key.name] = paramValues[prop.key.name];
          });
        } else if (param.type === 'Identifier') {
          funcParams[index] = paramValues[param.name];
        }
      });
      return funcParams;
    }

    /**
     *  Returns function param as an object from CallExpression
     *  e.g. 'foo.bar.x(event => { event.x.y.z() }' returns  {x : { y: z: function() {} }}
     */
  }, {
    key: "getFuncParamObj",
    value: function getFuncParamObj(code) {
      // CallExpression
      if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncParamObj';
      var node = Util.getNode(code);
      if (!node.type.match(/FunctionExpression$/)) return false;
      var funcRetExprsRaw = Util.getFuncParamCodes(code);
      var funcRetExprsFlat = funcRetExprsRaw.reduce(function (acc, val) {
        return acc.concat(val);
      }, []);
      var funcRetExprs = Array.from(new Set(funcRetExprsFlat));
      var funcParam = {};
      (funcRetExprs || []).forEach(function (funcExpr) {
        // e.g., ['event.urlAfterRedirects.substr(1)', ..]
        var matches = funcExpr.match(/([\(\[])(['"]*)[^)]*$/); // 1: [ or ( 2: ' or "
        var endEncloser = matches && (matches[1] === '(' ? ')' : ']');
        if (matches && !funcExpr.endsWith(endEncloser)) {
          // if parenthesis or [ not closed
          var _matches = _slicedToArray(matches, 3),
            _ = _matches[0],
            staEncloser = _matches[1],
            quotation = _matches[2];
          if (quotation && funcExpr.endsWith(staEncloser + quotation)) {
            // e.g. ...('
            funcExpr = "".concat(funcExpr).concat(quotation).concat(endEncloser);
          } else if (quotation && funcExpr.endsWith(quotation)) {
            // e.g. ...('----'
            funcExpr = "".concat(funcExpr).concat(endEncloser);
          } else if (quotation && !funcExpr.endsWith(quotation + endEncloser)) {
            // e.g. ('----
            funcExpr = "".concat(funcExpr).concat(quotation).concat(endEncloser);
          } else {
            funcExpr = "".concat(funcExpr).concat(endEncloser);
          }
        }
        var newReturn = Util.getFuncReturn(funcExpr);
        var newObj = Util.getObjectFromExpression(funcExpr, newReturn);
        Util.merge(newObj, funcParam);
      });
      return funcParam;
    }

    /**
     * returns function parameter related codes from a function codes
     */
  }, {
    key: "getFuncParamCodes",
    value: function getFuncParamCodes(code) {
      var paramCodes = [];
      var paramNames1 = Util.getFuncParamNames(code);
      var paramNames = paramNames1.reduce(function (acc, val) {
        return acc.concat(val);
      }, []);
      // const codeShortened = code.replace(/\n+/g, '').replace(/\s+/g, ' ');

      paramNames.forEach(function (paramName) {
        var paramNameMatchRE = new RegExp("[^a-z]".concat(paramName, "(\\.[^\\s\\;\\)\\+\\-\\]\\}\\,]+)+"), 'img');
        var matches = code.match(paramNameMatchRE);
        if (matches) {
          // remove the invalid first character. e.g. '\nmyParam.foo.bar'
          paramCodes.push(matches.map(function (el) {
            return el.slice(1);
          }));
        }
      });
      return paramCodes;
    }

    // returns function parameters names
    // e.g. function(a,b,{c,d},[e,f]) {...} returns ['a', 'b', 'c', 'd', 'e', 'f']
  }, {
    key: "getFuncParamNames",
    value: function getFuncParamNames(code) {
      var names = [];
      var node = typeof code === 'string' ? Util.getNode(code) : code;
      if (node.type === 'Identifier') {
        names.push(node.name);
      } else if (node.type === 'ObjectPattern') {
        node.properties.forEach(function (prop) {
          names.push(prop.key.name);
        });
      } else if (node.type === 'ArrayPattern') {
        node.elements.forEach(function (el) {
          var elPropName = Util.getFuncParamNames(el);
          names.push(elPropName);
        });
      } else if (node.params) {
        node.params.forEach(function (param) {
          var elPropName = Util.getFuncParamNames(param);
          names.push(elPropName);
        });
      } else {
        throw new Error("ERROR getFuncParamNames type error, \"".concat(node.type, "\""));
      }
      return names.reduce(function (acc, val) {
        return acc.concat(val);
      }, []);
    }
  }, {
    key: "getMockFn",
    value: function getMockFn(keys, returns) {
      // e.g. x, y, z, {a:1, b:2}
      if (Util.FRAMEWORK === 'karma') {
        var lastVarName = keys.slice(-1);
        var baseVarName = keys.slice(0, -1).join('.');
        var mockFnJS = "spyOn(".concat(baseVarName, ", '").concat(lastVarName, "')");
        var mockReturnJS = returns ? ".and.returnValue(".concat(returns, ")") : '';
        return mockFnJS + mockReturnJS;
      } else {
        var _mockFnJS = "".concat(keys.join('.'), " = jest.fn()");
        var _mockReturnJS = returns ? ".mockReturnValue(".concat(returns, ")") : '';
        return _mockFnJS + _mockReturnJS;
      }
    }
  }, {
    key: "getFuncMockJS",
    value: function getFuncMockJS(mockData) {
      var thisName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'component';
      var klass = arguments.length > 2 ? arguments[2] : undefined;
      var js = [];
      var asserts = [];
      var klassCode = '' + klass.prototype.constructor;
      var ckassDec = jsParser.Parser.parse(klassCode).body[0].id.name;
      Object.entries(mockData.props).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key1 = _ref2[0],
          value = _ref2[1];
        if (typeof value === 'function') {
          var funcRetVal = value();
          if (typeof funcRetVal === 'string' || Object.keys(funcRetVal).length === 0) {
            // e.g.{}, or  myVar from `const myVar = this.foo.var();`
            js.push(Util.getMockFn([thisName, key1], null));
          } else {
            js.push(Util.getMockFn([thisName, key1], Util.objToJS(funcRetVal)));
          }
          asserts.push([thisName, key1]);
        } else {
          var valueFiltered = Object.entries(value).filter(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              k = _ref4[0],
              v = _ref4[1];
            return k !== 'undefined';
          });
          valueFiltered.forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
              key2 = _ref6[0],
              value2 = _ref6[1];
            if (thisName == 'service' && Object.keys(mockData.params).includes('route')) {
              js.push("const service".concat(ckassDec, ": ").concat(ckassDec, " = TestBed.get(").concat(ckassDec, ")\n            let router = TestBed.get(Router)\n            spyOn(router, 'navigate')"));
            } else {
              js.push("".concat(thisName, ".").concat(key1, " = ").concat(thisName, ".").concat(key1, " || {}"));
            }
            // js.push(`${thisName}.${key1} = ${thisName}.${key1} || {}`);
            if (typeof value2 === 'function' && key2.match(/^(post|put)$/)) {
              js.push(Util.getMockFn([thisName, key1, key2], "observableOf('".concat(key2, "')")));
              asserts.push([thisName, key1, key2]);
            } else if (key2.match(arrFuncRE)) {
              if (typeof value2[key2] === 'function') {
                var arrElValue = value2[key2]();
                var arrElValueJS = Util.objToJS(arrElValue);
                js.push("".concat(thisName, ".").concat(key1, " = ").concat(arrElValueJS));
              } else {
                js.push("".concat(thisName, ".").concat(key1, " = ['").concat(key1, "']"));
              }
            } else if (typeof value2 === 'function' && JSON.stringify(value2()) === '{}') {
              var _funcRetVal = value2();
              var funcRet1stKey = Util.getFirstKey(_funcRetVal);
              if (_typeof(_funcRetVal) === 'object' && ['toPromise'].includes(funcRet1stKey)) {
                var retStr = Util.objToJS(_funcRetVal[funcRet1stKey]());
                js.push(Util.getMockFn([thisName, key1, key2], "observableOf(".concat(retStr, ")")));
              } else if (_typeof(_funcRetVal) === 'object' && ['filter'].includes(funcRet1stKey)) {
                var _retStr = Util.objToJS(_funcRetVal[funcRet1stKey]());
                js.push(Util.getMockFn([thisName, key1, key2], "[".concat(_retStr, "]")));
              } else if (_typeof(_funcRetVal) === 'object' && funcRet1stKey) {
                js.push(Util.getMockFn([thisName, key1, key2], "".concat(Util.objToJS(_funcRetVal))));
              } else {
                js.push(Util.getMockFn([thisName, key1, key2]));
              }
              asserts.push([thisName, key1, key2]);
              // const funcRetValEmpty = Object.as`funcRetVal
            } else if (['length'].includes(key2)) {
              // do nothing
            } else if (typeof value2 === 'function') {
              var _funcRetVal2 = value2();
              if (typeof _funcRetVal2 === 'string' || Object.keys(_funcRetVal2).length === 0) {
                // e.g. myVar from `const myVar = this.foo.var();`
                js.push(Util.getMockFn([thisName, key1, key2]));
              } else {
                js.push(Util.getMockFn([thisName, key1, key2], "".concat(Util.objToJS(_funcRetVal2))));
              }
              asserts.push([thisName, key1, key2]);
            } else if (Array.isArray(value2)) {
              // const fnValue2 = Util.objToJS(value2).replace(/\{\s+\}/gm, '{}');
              js.push("".concat(thisName, ".").concat(key1, ".").concat(key2, " = ['gentest']"));
            } else {
              var objVal21stKey = Object.keys(value2)[0];
              if (objVal21stKey && objVal21stKey.match(arrFuncRE)) {
                if (typeof value2[objVal21stKey] === 'function') {
                  var _arrElValue = value2[objVal21stKey]();
                  var _arrElValueJS = Util.objToJS(_arrElValue);
                  js.push("".concat(thisName, ".").concat(key1, ".").concat(key2, " = ").concat(_arrElValueJS));
                } else {
                  js.push("".concat(thisName, ".").concat(key1, ".").concat(key2, " = ['").concat(key2, "']"));
                }
              } else if (objVal21stKey && objVal21stKey.match(strFuncRE)) {
                js.push("".concat(thisName, ".").concat(key1, ".").concat(key2, " = '").concat(key2, "'"));
              } else {
                var objValue2 = Util.objToJS(value2).replace(/\{\s+\}/gm, '{}');
                if (objValue2 === '{}') {
                  js.push("".concat(thisName, ".").concat(key1, ".").concat(key2, " = '").concat(key2, "'"));
                } else {
                  js.push("".concat(thisName, ".").concat(key1, ".").concat(key2, " = ").concat(objValue2));
                }
              }
            }
          });
        }
      });
      Object.entries(mockData.globals).forEach(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
          key1 = _ref8[0],
          value = _ref8[1];
        // window, document
        Object.entries(value).forEach(function (_ref9) {
          var _ref10 = _slicedToArray(_ref9, 2),
            key2 = _ref10[0],
            value2 = _ref10[1];
          // location
          if (typeof value2 === 'function') {
            js.push(Util.getMockFn([key1, key2]));
            asserts.push([key1, key2]);
          } else {
            Object.entries(value2).forEach(function (_ref11) {
              var _ref12 = _slicedToArray(_ref11, 2),
                key3 = _ref12[0],
                value3 = _ref12[1];
              // location
              if (typeof value3 === 'function') {
                js.push(Util.getMockFn([key1, key2, key3]));
                asserts.push([key1, key2, key3]);
              } else if (value3) {
                var objValue3 = Util.objToJS(value3).replace(/\{\s+\}/gm, '{}');
                js.push("".concat(key1, ".").concat(key2, ".").concat(key3, " = ").concat(objValue3));
              }
            });
          }
        });
      });
      ckassDec == 'AuthService' ? js.pop() : js;
      return [js, asserts];
    }

    /**
     * Return JS expression of parameter
     */
  }, {
    key: "getFuncParamJS",
    value: function getFuncParamJS(params) {
      var js = [];
      Object.entries(params).forEach(function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 2),
          key2 = _ref14[0],
          value2 = _ref14[1];
        var value21stKey = _typeof(value2) === 'object' && Object.keys(value2).filter(function (k) {
          return k !== 'undefined';
        })[0];
        if (key2 !== 'undefined') {
          var objValue2 = Util.objToJS(value2);
          var jsValue = objValue2 === "'createngtest'" ? "'".concat(key2, "'") : objValue2 === "['createngtest']" ? "['".concat(key2, "']") : "".concat(objValue2);
          js.push("".concat(jsValue));
        }
      });
      return js.join(', ');
    }

    /**
     * Get first key of an object
     */
  }, {
    key: "getFirstKey",
    value: function getFirstKey(obj) {
      var firstKey = _typeof(obj) === 'object' && Object.keys(obj).filter(function (k) {
        return k !== 'undefined';
      })[0];
      return firstKey || undefined;
    }
  }]);
  return Util;
}();
var _default = Util;
exports["default"] = _default;