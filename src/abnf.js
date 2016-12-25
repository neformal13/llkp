// ABNF (RFC 5234) syntax of LL(k) grammars.

import {Pattern, txt, rgx, opt, exc, any, seq, rep} from './core';

const numstr = (prefix, regex, radix) => {
    const num = rgx(regex).parseInt(radix);
    const rng = seq(num, txt('-'), num).map({min: 0, max: 2});
    const chr = any(rng, num.as('num'));
    return seq(txt(prefix), rep(chr, txt('.'), 1)).select(1);
};

const hs = n => {
    const s = n.toString(16);
    return ['', '\\x0', '\\x', '\\u0', '\\u'][s.length] + s;
};

const str = string => {
    const c = string.map(s => 'num' in s ? hs(s.num) : hs(s.min) + '-' + hs(s.max));
    return rgx(new RegExp('[' + c.join('][') + ']'));
};

const quoted = (lq, rq) => {
    const regexp = new RegExp(lq + '[\\x20-\\x7E]*?' + rq);
    return rgx(regexp)
        .then(s => s.slice(+1, -1));
};

class ABNF extends Pattern {
    constructor(definition, rules) {
        const parse = abnf => {
            const r = ABNF.pattern.exec(abnf);
            if (r) return r;
            throw new SyntaxError('Invalid ABNF rule: ' + abnf);
        };

        const compile = ast => {
            if ('seq' in ast) return buildseq(ast);
            if ('any' in ast) return any(...ast.any.map(compile));
            if ('rep' in ast) return buildrep(ast);
            if ('opt' in ast) return opt(compile(ast.opt));
            if ('str' in ast) return str(ast.str);
            if ('txt' in ast) return txt(ast.txt);
            if ('rgx' in ast) return rgx(new RegExp(ast.rgx));
            if ('exc' in ast) return exc(...ast.exc.map(compile));
            if ('ref' in ast) return ref(ast.ref);
            if ('sel' in ast) return compile(ast.sel).select(ast.key);
        };

        const build = (definition, name) => {
            if (definition instanceof RegExp)   return rgx(definition);
            if (definition instanceof Function) return new Pattern(name, definition);
            if (definition instanceof Pattern)  return definition;

            return compile(parse(definition + ''));
        };

        const buildseq = ast => {
            const p = seq.apply(null, ast.seq.map(compile));
            return ast.map ? p.map(ast.map) : p;
        };

        const buildrep = ast => {
            const p = rep(compile(ast.rep), ast.sep && compile(ast.sep), ast.min, ast.max);
            return ast.key && ast.val ? p.join(ast.key, ast.val) : p;
        };

        const ref = name => {
            if (refs[name]) return refs[name];

            refs[name] = null;

            return new Pattern(name, (str, pos) => {
                refs[name] = refs[name] || build(rules[name], name);
                return refs[name].exec(str, pos);
            });
        };

        let refs = {};

        if (rules instanceof Function)
            rules.call(rules = {}, build);
        else
            rules = Object.create(rules || {});

        for (let name in ABNF.rules)
            if (name in rules)
                throw new SyntaxError('Rule name is reserved: ' + name);
            else
                rules[name] = ABNF.rules[name];

        let pattern = build(definition);

        for (let name in refs)
            if (!rules[name])
                throw new SyntaxError('Rule is not defined: ' + name);

        super(pattern + '', pattern.exec);
    }
}

ABNF.pattern = (function () {
    const ref = name => rules[name] || new Pattern(name, (str, pos) => rules[name].exec(str, pos));
    let rules = {};
    rules.hexstr = numstr('x', /[0-9a-f]+/i, 16);
    rules.decstr = numstr('d', /[0-9]+/, 10);
    rules.binstr = numstr('b', /[0-1]+/, 2);

    rules.lbl = rgx(/[a-z][a-z0-9_]*:/i).slice(0, -1);
    rules.sel = rgx(/\.[a-z0-9]+/i).slice(1);
    rules.key = rgx(/[a-z0-9_]+/i);

    rules.quantifier = any(
        seq(
            rgx(/\d*/),
            txt('*'),
            rgx(/\d*/)
        ).then(r => ({min: +r[0] || 0, max: +r[2] || +Infinity})),
        rgx(/\d+/).then(r => ({min: +r, max: +r}))
    );

    rules.join = seq(
        txt('<'),
        ref('key'),
        rgx(/\s*:\s*/),
        ref('key'),
        txt('>')
    ).map({key: 1, val: 3});

    rules.rep = any(
        seq(ref('quantifier'), opt(ref('sep')), opt(ref('join')), ref('element'))
            .then( ([{min, max}, sep, {key, val} = {}, rep]) => ({min, max, sep, key, val, rep,}) ),
        ref('element'));

    rules.exc = seq(ref('rep'), opt(seq(rgx(/\s*~\s*/), ref('rep'))))
        .then(r => r[1] ? {exc: [r[0], r[1][1]]} : r[0]);

    rules.seq = rep(seq(opt(ref('lbl')), ref('exc')), rgx(/\s*/))
        .then((r) => {
            let m;
            let s = r.map((el, i) => {
                if (el[0]) {
                    m = m || {};
                    m[el[0]] = i;
                }
                return el[1];
            });

            return s.length == 1 && !m ? s[0] : {seq: s, map: m};
        });

    rules.any = rep(ref('seq'), rgx(/\s*\/\s*/))
        .then((r) => r.length === 1 ? r[0] : {any: r});

    rules.sep = seq(rgx(/\s*\{\s*/), ref('any'), rgx(/\s*\}\s*/)).select(1);
    rules.grp = seq(rgx(/\s*\(\s*/), ref('any'), rgx(/\s*\)\s*/)).select(1);
    rules.opt = seq(rgx(/\s*\[\s*/), ref('any'), rgx(/\s*\]\s*/)).select(1).as('opt');

    rules.sgr = seq(any(ref('grp'), ref('opt')), opt(ref('sel')))
        .then((r) => !r[1] ? r[0] : {sel: r[0], key: r[1]});

    rules.element = any(
        any(quoted('"', '"'), quoted("'", "'")).as('txt'),
        quoted('`', '`').as('rgx'),
        rgx(/[a-zA-Z][a-zA-Z0-9\-]*/).as('ref'),
        seq(txt('%'), any(ref('hexstr'), ref('decstr'), ref('binstr'))).select(1).as('str'),
        ref('sgr'),
        seq(txt('?'), ref('element')).select(1).as('opt')
    );

    return ref('any');
})();

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
    OCTET: '%x00-FF',  // 8 bits of data
    SP: '%x20',
    VCHAR: '%x21-7E', // visible (printing) characters
    WSP: 'SP / HTAB' // white space
};

/**
 * With wrapper you can call ABNF in both cases:
 *   new ABNF(...)
 *   ABNF(...);
 */
let wrapper = function (definition, rules) {
    return new ABNF(definition, rules);
};
wrapper.prototype = ABNF.prototype;

export default wrapper;