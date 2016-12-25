(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rep = exports.seq = exports.any = exports.exc = exports.opt = exports.rgx = exports.txt = exports.Pattern = undefined;

var _Pattern = __webpack_require__(3);

var _Pattern2 = _interopRequireDefault(_Pattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// parses a known text
var txt = function txt(text) {
    return new _Pattern2.default('"' + text.replace(/"/gm, '\\"') + '"', function (str, pos) {
        if (str.substr(pos, text.length) === text) {
            return { res: text, end: pos + text.length };
        }
    });
};

// parses a regular expression
// LL(k) core parsing functions and combinators.
var rgx = function rgx(regexp) {
    return new _Pattern2.default(regexp + '', function (str, pos) {
        var m = regexp.exec(str.slice(pos));
        if (m && m.index === 0) {
            // regex must match at the beginning, so index must be 0
            return { res: m[0], end: pos + m[0].length };
        }
    });
};

// parses an optional pattern
var opt = function opt(pattern, defval) {
    return new _Pattern2.default(pattern + '?', function (str, pos) {
        return pattern.exec(str, pos) || { res: defval, end: pos };
    });
};

// parses a pattern if it doesn't match another pattern
var exc = function exc(pattern, except) {
    return new _Pattern2.default(pattern + ' ~ ' + except, function (str, pos) {
        return !except.exec(str, pos) && pattern.exec(str, pos);
    });
};

// parses any of the given patterns
var any = function any() {
    for (var _len = arguments.length, patterns = Array(_len), _key = 0; _key < _len; _key++) {
        patterns[_key] = arguments[_key];
    }

    return new _Pattern2.default('(' + patterns.join(' | ') + ')', function (str, pos) {
        var r = void 0;
        for (var i = 0; i < patterns.length && !r; i++) {
            r = patterns[i].exec(str, pos);
        }
        return r;
    });
};

// parses a sequence of patterns
var seq = function seq() {
    for (var _len2 = arguments.length, patterns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        patterns[_key2] = arguments[_key2];
    }

    return new _Pattern2.default('(' + patterns.join(' ') + ')', function (str, pos) {
        var r = void 0,
            end = pos,
            res = [];

        for (var i = 0; i < patterns.length; i++) {
            r = patterns[i].exec(str, end);
            if (!r) return;
            res.push(r.res);
            end = r.end;
        }

        return { res: res, end: end };
    });
};

// parses a (separated) repetition of a pattern
var rep = function rep(pattern, separator, min, max) {
    var separated = !separator ? pattern : seq(separator, pattern).then(function (r) {
        return r[1];
    });

    if (!isFinite(min)) min = 1;
    if (!isFinite(max)) max = Infinity;

    return new _Pattern2.default(pattern + '*', function (str, pos) {
        var res = [],
            end = pos,
            r = pattern.exec(str, end);

        while (r && r.end > end && res.length < max) {
            res.push(r.res);
            end = r.end;
            r = separated.exec(str, end);
        }

        return res.length >= min ? { res: res, end: end } : null;
    });
};

exports.Pattern = _Pattern2.default;
exports.txt = txt;
exports.rgx = rgx;
exports.opt = opt;
exports.exc = exc;
exports.any = any;
exports.seq = seq;
exports.rep = rep;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _core = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ABNF (RFC 5234) syntax of LL(k) grammars.

var numstr = function numstr(prefix, regex, radix) {
    var num = (0, _core.rgx)(regex).parseInt(radix);
    var rng = (0, _core.seq)(num, (0, _core.txt)('-'), num).map({ min: 0, max: 2 });
    var chr = (0, _core.any)(rng, num.as('num'));
    return (0, _core.seq)((0, _core.txt)(prefix), (0, _core.rep)(chr, (0, _core.txt)('.'), 1)).select(1);
};

var hs = function hs(n) {
    var s = n.toString(16);
    return ['', '\\x0', '\\x', '\\u0', '\\u'][s.length] + s;
};

var str = function str(string) {
    var c = string.map(function (s) {
        return 'num' in s ? hs(s.num) : hs(s.min) + '-' + hs(s.max);
    });
    return (0, _core.rgx)(new RegExp('[' + c.join('][') + ']'));
};

var quoted = function quoted(lq, rq) {
    var regexp = new RegExp(lq + '[\\x20-\\x7E]*?' + rq);
    return (0, _core.rgx)(regexp).then(function (s) {
        return s.slice(+1, -1);
    });
};

var ABNF = function (_Pattern) {
    _inherits(ABNF, _Pattern);

    function ABNF(definition, rules) {
        _classCallCheck(this, ABNF);

        var parse = function parse(abnf) {
            var r = ABNF.pattern.exec(abnf);
            if (r) return r;
            throw new SyntaxError('Invalid ABNF rule: ' + abnf);
        };

        var compile = function compile(ast) {
            if ('seq' in ast) return buildseq(ast);
            if ('any' in ast) return _core.any.apply(undefined, _toConsumableArray(ast.any.map(compile)));
            if ('rep' in ast) return buildrep(ast);
            if ('opt' in ast) return (0, _core.opt)(compile(ast.opt));
            if ('str' in ast) return str(ast.str);
            if ('txt' in ast) return (0, _core.txt)(ast.txt);
            if ('rgx' in ast) return (0, _core.rgx)(new RegExp(ast.rgx));
            if ('exc' in ast) return _core.exc.apply(undefined, _toConsumableArray(ast.exc.map(compile)));
            if ('ref' in ast) return ref(ast.ref);
            if ('sel' in ast) return compile(ast.sel).select(ast.key);
        };

        var build = function build(definition, name) {
            if (definition instanceof RegExp) return (0, _core.rgx)(definition);
            if (definition instanceof Function) return new _core.Pattern(name, definition);
            if (definition instanceof _core.Pattern) return definition;

            return compile(parse(definition + ''));
        };

        var buildseq = function buildseq(ast) {
            var p = _core.seq.apply(null, ast.seq.map(compile));
            return ast.map ? p.map(ast.map) : p;
        };

        var buildrep = function buildrep(ast) {
            var p = (0, _core.rep)(compile(ast.rep), ast.sep && compile(ast.sep), ast.min, ast.max);
            return ast.key && ast.val ? p.join(ast.key, ast.val) : p;
        };

        var ref = function ref(name) {
            if (refs[name]) return refs[name];

            refs[name] = null;

            return new _core.Pattern(name, function (str, pos) {
                refs[name] = refs[name] || build(rules[name], name);
                return refs[name].exec(str, pos);
            });
        };

        var refs = {};

        if (rules instanceof Function) rules.call(rules = {}, build);else rules = Object.create(rules || {});

        for (var name in ABNF.rules) {
            if (name in rules) throw new SyntaxError('Rule name is reserved: ' + name);else rules[name] = ABNF.rules[name];
        }var pattern = build(definition);

        for (var _name in refs) {
            if (!rules[_name]) throw new SyntaxError('Rule is not defined: ' + _name);
        }return _possibleConstructorReturn(this, (ABNF.__proto__ || Object.getPrototypeOf(ABNF)).call(this, pattern + '', pattern.exec));
    }

    return ABNF;
}(_core.Pattern);

ABNF.pattern = function () {
    var ref = function ref(name) {
        return rules[name] || new _core.Pattern(name, function (str, pos) {
            return rules[name].exec(str, pos);
        });
    };
    var rules = {};
    rules.hexstr = numstr('x', /[0-9a-f]+/i, 16);
    rules.decstr = numstr('d', /[0-9]+/, 10);
    rules.binstr = numstr('b', /[0-1]+/, 2);

    rules.lbl = (0, _core.rgx)(/[a-z][a-z0-9_]*:/i).slice(0, -1);
    rules.sel = (0, _core.rgx)(/\.[a-z0-9]+/i).slice(1);
    rules.key = (0, _core.rgx)(/[a-z0-9_]+/i);

    rules.quantifier = (0, _core.any)((0, _core.seq)((0, _core.rgx)(/\d*/), (0, _core.txt)('*'), (0, _core.rgx)(/\d*/)).then(function (r) {
        return { min: +r[0] || 0, max: +r[2] || +Infinity };
    }), (0, _core.rgx)(/\d+/).then(function (r) {
        return { min: +r, max: +r };
    }));

    rules.join = (0, _core.seq)((0, _core.txt)('<'), ref('key'), (0, _core.rgx)(/\s*:\s*/), ref('key'), (0, _core.txt)('>')).map({ key: 1, val: 3 });

    rules.rep = (0, _core.any)((0, _core.seq)(ref('quantifier'), (0, _core.opt)(ref('sep')), (0, _core.opt)(ref('join')), ref('element')).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 4),
            _ref2$ = _ref2[0],
            min = _ref2$.min,
            max = _ref2$.max,
            sep = _ref2[1],
            _ref2$2 = _ref2[2];

        _ref2$2 = _ref2$2 === undefined ? {} : _ref2$2;
        var key = _ref2$2.key,
            val = _ref2$2.val,
            rep = _ref2[3];
        return { min: min, max: max, sep: sep, key: key, val: val, rep: rep };
    }), ref('element'));

    rules.exc = (0, _core.seq)(ref('rep'), (0, _core.opt)((0, _core.seq)((0, _core.rgx)(/\s*~\s*/), ref('rep')))).then(function (r) {
        return r[1] ? { exc: [r[0], r[1][1]] } : r[0];
    });

    rules.seq = (0, _core.rep)((0, _core.seq)((0, _core.opt)(ref('lbl')), ref('exc')), (0, _core.rgx)(/\s*/)).then(function (r) {
        var m = void 0;
        var s = r.map(function (el, i) {
            if (el[0]) {
                m = m || {};
                m[el[0]] = i;
            }
            return el[1];
        });

        return s.length == 1 && !m ? s[0] : { seq: s, map: m };
    });

    rules.any = (0, _core.rep)(ref('seq'), (0, _core.rgx)(/\s*\/\s*/)).then(function (r) {
        return r.length === 1 ? r[0] : { any: r };
    });

    rules.sep = (0, _core.seq)((0, _core.rgx)(/\s*\{\s*/), ref('any'), (0, _core.rgx)(/\s*\}\s*/)).select(1);
    rules.grp = (0, _core.seq)((0, _core.rgx)(/\s*\(\s*/), ref('any'), (0, _core.rgx)(/\s*\)\s*/)).select(1);
    rules.opt = (0, _core.seq)((0, _core.rgx)(/\s*\[\s*/), ref('any'), (0, _core.rgx)(/\s*\]\s*/)).select(1).as('opt');

    rules.sgr = (0, _core.seq)((0, _core.any)(ref('grp'), ref('opt')), (0, _core.opt)(ref('sel'))).then(function (r) {
        return !r[1] ? r[0] : { sel: r[0], key: r[1] };
    });

    rules.element = (0, _core.any)((0, _core.any)(quoted('"', '"'), quoted("'", "'")).as('txt'), quoted('`', '`').as('rgx'), (0, _core.rgx)(/[a-zA-Z][a-zA-Z0-9\-]*/).as('ref'), (0, _core.seq)((0, _core.txt)('%'), (0, _core.any)(ref('hexstr'), ref('decstr'), ref('binstr'))).select(1).as('str'), ref('sgr'), (0, _core.seq)((0, _core.txt)('?'), ref('element')).select(1).as('opt'));

    return ref('any');
}();

// Predefined ABNF rules taken from RFC 5234.
// http://tools.ietf.org/html/rfc5234#appendix-B.1
ABNF.rules = {
    ALPHA: '%x41-5A / %x61-7A', // A-Z / a-z
    BIT: '"0" / "1"',
    CHAR: '%x01-7F', // any 7-bit US-ASCII character, excluding NUL
    CR: '%x0D', // carriage return
    CRLF: 'CR LF', // Internet standard newline
    CTL: '%x00-1F / %x7F', // controls
    DIGIT: '%x30-39', // 0-9
    DQUOTE: '%x22', // " (Double Quote)
    HEXDIG: 'DIGIT / "A" / "B" / "C" / "D" / "E" / "F"',
    HTAB: '%x09', // horizontal tab
    LF: '%x0A', // linefeed
    LWSP: '*(WSP / CRLF WSP)', // linear-white-space
    OCTET: '%x00-FF', // 8 bits of data
    SP: '%x20',
    VCHAR: '%x21-7E', // visible (printing) characters
    WSP: 'SP / HTAB' // white space
};

/**
 * With wrapper you can call ABNF in both cases:
 *   new ABNF(...)
 *   ABNF(...);
 */
var wrapper = function wrapper(definition, rules) {
    return new ABNF(definition, rules);
};
wrapper.prototype = ABNF.prototype;

exports.default = wrapper;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = __webpack_require__(0);

function PEG(definition, rules) {
    var refs = {};

    function parse(rule) {
        var r = PEG.pattern.exec(rule);
        if (r) return r;
        throw new SyntaxError('Invalid PEG rule: ' + rule);
    }

    function compile(ast) {
        if ('ref' in ast) return ref(ast.ref);
        if ('txt' in ast) return (0, _core.txt)(ast.txt);
        if ('rgx' in ast) return (0, _core.rgx)(new RegExp(ast.rgx));
        if ('opt' in ast) return (0, _core.opt)(compile(ast.opt));
        if ('not' in ast) return not(compile(ast.not));
        if ('def' in ast) return compile_def(ast);
        if ('seq' in ast) return compile_seq(ast.seq);
        if ('any' in ast) return compile_alt(ast.any);
        if ('sep' in ast) return compile_rep(ast);
        if ('exc' in ast) return (0, _core.exc)(compile(ast.exc.lhs), compile(ast.exc.rhs));
    }

    function compile_rep(ast) {
        return (0, _core.rep)(compile(ast.rep), ast.sep && compile(ast.sep), ast.min);
    }

    function compile_def(ast) {
        var p = compile(ast.def);
        return !ast.key ? p : p.select(ast.key);
    }

    function compile_alt(asts) {
        var p = asts.map(compile);
        return p.length > 1 ? _core.any.apply(0, p) : p[0];
    }

    function compile_seq(asts) {
        var m,
            p = asts.map(compile);

        asts.forEach(function (ast, i) {
            if ('lbl' in ast) {
                m = m || {};
                m[ast.lbl] = i;
            }
        });

        return m ? _core.seq.apply(0, p).map(m) : p.length > 1 ? _core.seq.apply(0, p) : p[0];
    }

    function build(definition, name) {
        if (definition instanceof RegExp) return (0, _core.rgx)(definition);

        if (definition instanceof Function) return new _core.Pattern(name, definition);

        if (definition instanceof _core.Pattern) return definition;

        return compile(parse(definition + ''));
    }

    function ref(name) {
        return (refs[name] = refs[name]) || new _core.Pattern(name, function (str, pos) {
            return refs[name].exec(str, pos);
        });
    }

    function init(self) {
        var pattern, name;

        if (rules instanceof Function) rules.call(rules = {}, build);

        for (name in rules) {
            refs[name] = build(rules[name], name);
        }pattern = build(definition);

        for (name in refs) {
            if (!refs[name]) throw new SyntaxError('Rule is not defined: ' + name);
        }_core.Pattern.call(self, pattern + '', pattern.exec);
    }

    if (this instanceof PEG) init(this);else return new PEG(definition, rules);
} // PEG syntax of LL(k) grammars.

PEG.pattern = compose(function ($) {
    this.alt = (0, _core.rep)($('seq'), (0, _core.rgx)(/\s+\/\s+/)).as('any');
    this.seq = (0, _core.rep)((0, _core.any)($('exc'), $('trm')), (0, _core.rgx)(/\s+/)).as('seq');
    this.exc = (0, _core.seq)($('trm'), (0, _core.rgx)(/\s+~\s+/), $('trm')).map({ lhs: 0, rhs: 2 }).as('exc');
    this.atm = (0, _core.any)($('txt'), $('grp'), $('chr'), $('ref'));
    this.txt = (0, _core.any)(str('"', '"'), str("'", "'")).as('txt');
    this.chr = str('[', ']').text().as('rgx');
    this.ref = (0, _core.rgx)(/[a-z]+/i).as('ref');
    this.trm = (0, _core.any)((0, _core.seq)($('lbl'), (0, _core.txt)(':'), $('trm')).then(function (r) {
        r[2].lbl = r[0];
        return r[2];
    }), (0, _core.seq)((0, _core.txt)('&'), $('trm')).select(1).as('not').as('not'), (0, _core.seq)((0, _core.txt)('!'), $('trm')).select(1).as('not'), (0, _core.seq)($('atm'), (0, _core.txt)('?')).select(0).as('opt'), (0, _core.seq)($('atm'), $('qtf')).then(function (r) {
        r[1].rep = r[0];
        return r[1];
    }), $('atm'));
    this.grp = (0, _core.seq)((0, _core.txt)('('), $('def'), (0, _core.txt)(')'), (0, _core.opt)((0, _core.seq)((0, _core.txt)('.'), $('lbl')).select(1))).map({ def: 1, key: 3 });
    this.qtf = (0, _core.seq)((0, _core.opt)($('sep')), (0, _core.any)((0, _core.txt)('+').make(1), (0, _core.txt)('*').make(0))).map({ sep: 0, min: 1 });
    this.sep = (0, _core.seq)((0, _core.txt)('<'), $('def'), (0, _core.txt)('>')).select(1);
    this.lbl = (0, _core.rgx)(/[a-z0-9]+/i);
    this.def = $('alt');

    return $('def');
});

PEG.prototype = _core.Pattern.prototype;

function compose(define) {
    var rules = {};
    return define.call(rules, function (name) {
        return rules[name] || new _core.Pattern(name, function (str, pos) {
            return rules[name].exec(str, pos);
        });
    });
}

function str(lq, rq) {
    var chr = (0, _core.any)((0, _core.seq)((0, _core.txt)('\\'), (0, _core.txt)(lq)).select(1), (0, _core.seq)((0, _core.txt)('\\'), (0, _core.txt)(rq)).select(1), (0, _core.exc)((0, _core.rgx)(/[\u0000-\uffff]/), (0, _core.txt)(rq)));

    return (0, _core.seq)((0, _core.txt)(lq), (0, _core.opt)((0, _core.rep)(chr), []).merge(), (0, _core.txt)(rq)).select(1);
}

function not(pattern) {
    return new _core.Pattern('!' + pattern, function (str, pos) {
        return !pattern.exec(str, pos) && { res: void 0, end: pos };
    });
}

exports.default = PEG;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// A set of predefined transforms for Pattern.

var Pattern = function () {
    function Pattern(name, exec) {
        _classCallCheck(this, Pattern);

        this.params = { name: name, exec: exec };

        this.exec = this.exec.bind(this);
        this.then = this.then.bind(this);
    }

    _createClass(Pattern, [{
        key: 'then',
        value: function then(transform) {
            var _this = this;

            return new Pattern(this.params.name, function (str, pos) {
                var r = _this.params.exec(str, pos);
                if (r) {
                    var end = r.end,
                        res = r.res;

                    res = transform(res, str.slice(pos, end));
                    return { res: res, end: end };
                }
            });
        }
    }, {
        key: 'exec',
        value: function exec(str, pos) {
            var r = this.params.exec(str, pos || 0);
            return pos >= 0 ? r : !r ? null : r.end != str.length ? null : r.res;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.params.name;
        }
    }, {
        key: 'make',
        value: function make(value) {
            return this.then(function () {
                return value;
            });
        }
    }, {
        key: 'select',
        value: function select(index) {
            return this.then(function (r) {
                return r ? r[index] : undefined;
            });
        }
    }, {
        key: 'as',
        value: function as(name) {
            return this.then(function (r) {
                return _defineProperty({}, name, r);
            });
        }
    }, {
        key: 'map',
        value: function map(mapping) {
            return this.then(function (r) {
                var m = {},
                    i = void 0;
                for (i in mapping) {
                    m[i] = r[mapping[i]];
                }

                return m;
            });
        }
    }, {
        key: 'parseInt',
        value: function (_parseInt) {
            function parseInt(_x) {
                return _parseInt.apply(this, arguments);
            }

            parseInt.toString = function () {
                return _parseInt.toString();
            };

            return parseInt;
        }(function (radix) {
            return this.then(function (r) {
                return parseInt(r, radix);
            });
        })
    }, {
        key: 'parseFloat',
        value: function (_parseFloat) {
            function parseFloat() {
                return _parseFloat.apply(this, arguments);
            }

            parseFloat.toString = function () {
                return _parseFloat.toString();
            };

            return parseFloat;
        }(function () {
            return this.then(function (r) {
                return parseFloat(r);
            });
        })
    }, {
        key: 'merge',
        value: function merge() {
            var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            return this.then(function (r) {
                return r.join(separator);
            });
        }
    }, {
        key: 'trim',
        value: function trim() {
            return this.then(function (r) {
                return r.trim();
            });
        }
    }, {
        key: 'slice',
        value: function slice(start, end) {
            return this.then(function (r) {
                return r.slice(start, end);
            });
        }
    }, {
        key: 'text',
        value: function text() {
            return this.then(function (r, s) {
                return s;
            });
        }
    }, {
        key: 'join',
        value: function join(key, val) {
            return this.then(function (r) {
                var m = {};

                for (var i = 0; i < r.length; i++) {
                    m[r[i][key]] = r[i][val];
                }

                return m;
            });
        }
    }, {
        key: 'flatten',
        value: function flatten() {
            var flatten = function flatten(a) {
                return a.reduce(function (accum, el) {
                    if (Array.isArray(el)) accum = accum.concat(flatten(el));else accum.push(el);

                    return accum;
                }, []);
            };

            return this.then(function (r) {
                return flatten(r);
            });
        }
    }]);

    return Pattern;
}();

exports.default = Pattern;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PEG = exports.ABNF = undefined;

var _abnf = __webpack_require__(1);

var _abnf2 = _interopRequireDefault(_abnf);

var _peg = __webpack_require__(2);

var _peg2 = _interopRequireDefault(_peg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ABNF = _abnf2.default;
exports.PEG = _peg2.default;

/***/ }
/******/ ]);
});