(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("react");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactHighlight = __webpack_require__(5);

var _reactHighlight2 = _interopRequireDefault(_reactHighlight);

__webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var code = 'import {ABNF} from \'llkp\';\n\nconst zipCode       = ABNF(`5DIGIT ["-" 4DIGIT]`);\nconst state         = ABNF(\'2ALPHA\');\nconst townName      = ABNF(\'1*(ALPHA / SP)\');\nconst zipPart       = ABNF(\n    \'townName "," SP state 1*2SP zipCode [LF]\',\n    { townName, state, zipCode});\n\nconst streetName    = ABNF(\'1*VCHAR\');\nconst houseNum      = ABNF (\'1*8(DIGIT / ALPHA)\');\nconst apt           = ABNF(\'1*4DIGIT\');\nconst street        = ABNF(\n    \'[apt SP] houseNum SP streetName LF\',\n    {apt, houseNum, streetName});\n    \nconst suffix        = ABNF(\'("Jr." / "Sr." / 1*("I" / "V" / "X"))\');\nconst lastName      = ABNF(\'*ALPHA\');\nconst initial       = ABNF(\'ALPHA\');\nconst firstName     = ABNF(\'*ALPHA\');\nconst personalPart  = ABNF(\'firstName / (initial ".")\', {firstName, initial});\nconst namePart      = ABNF(\n    \'(*(personalPart SP) lastName [SP suffix] LF) / (personalPart LF)\',\n     {personalPart, lastName, suffix});\n     \nconst postalAddress = ABNF(\'namePart street zipPart\', {zipPart, street, namePart});\n\nconst text = \n`John Dou\n1234 123A Oak\nVancouver, BC 12345-1234`\n\nconsole.log(postalAddress.exec(text), postalAddress);\n';

var App = function App() {
    return _react2.default.createElement(
        'article',
        null,
        _react2.default.createElement(
            'h2',
            null,
            'Example'
        ),
        _react2.default.createElement(
            'p',
            null,
            'The postal address example given in the augmented Backus\u2013Naur form (ABNF) page may be specified as follows:'
        ),
        _react2.default.createElement(
            _reactHighlight2.default,
            null,
            code
        )
    );
};

exports.default = App;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Head = function Head() {
    return _react2.default.createElement(
        "head",
        null,
        _react2.default.createElement("meta", { charSet: "UTF-8" }),
        _react2.default.createElement("link", { rel: "stylesheet", href: "build/styles.css" }),
        _react2.default.createElement(
            "title",
            null,
            "ABNF"
        )
    );
};

exports.default = Head;

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("react-dom/server");

/***/ },
/* 4 */
/***/ function(module, exports) {



/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("react-highlight");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _server = __webpack_require__(3);

var _Head = __webpack_require__(2);

var _Head2 = _interopRequireDefault(_Head);

var _App = __webpack_require__(1);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headString = (0, _server.renderToStaticMarkup)(_react2.default.createElement(_Head2.default, null));
var appString = (0, _server.renderToString)(_react2.default.createElement(_App2.default, null));

var html = '<!doctype html>\n<html lang="en">\n  ' + headString + '\n<body>\n  <div id="appRoot">' + appString + '</div>\n  <script src="build/frontend.js"></script>\n</body>\n</html>';

exports.default = html;

/***/ }
/******/ ])));