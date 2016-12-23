// LL(k) core parsing functions and combinators.
// Does not depend on other modules.

import Pattern from './Pattern';

// parses a known text
function txt(text) {
    var name = '"' + text.replace(/"/gm, '\\"') + '"';
    return new Pattern(name, function (str, pos) {
        if (str.substr(pos, text.length) == text)
            return { res: text, end: pos + text.length };
    });
}

// parses a regular expression
function rgx(regexp) {
    return new Pattern(regexp + '', function (str, pos) {
        var m = regexp.exec(str.slice(pos));
        if (m && m.index === 0) // regex must match at the beginning, so index must be 0
            return { res: m[0], end: pos + m[0].length };
    });
}

// parses an optional pattern
function opt(pattern, defval) {
    return new Pattern(pattern + '?', function (str, pos) {
        return pattern.exec(str, pos) || { res: defval, end: pos };
    });
}

// parses a pattern if it doesn't match another pattern
function exc(pattern, except) {
    var name = pattern + ' ~ ' + except;
    return new Pattern(name, function (str, pos) {
        return !except.exec(str, pos) && pattern.exec(str, pos);
    });
}

// parses any of the given patterns
function any(/* patterns... */) {
    var patterns = [].slice.call(arguments, 0);
    var name = '(' + patterns.join(' | ') + ')';

    return new Pattern(name, function (str, pos) {
        var r, i;
        for (i = 0; i < patterns.length && !r; i++)
            r = patterns[i].exec(str, pos);
        return r;
    });
}

// parses a sequence of patterns
function seq(/* patterns... */) {
    var patterns = [].slice.call(arguments, 0);
    var name = '(' + patterns.join(' ') + ')';

    return new Pattern(name, function (str, pos) {
        var i, r, end = pos, res = [];

        for (i = 0; i < patterns.length; i++) {
            r = patterns[i].exec(str, end);
            if (!r) return;
            res.push(r.res);
            end = r.end;
        }

        return { res: res, end: end };
    });
}

// parses a (separated) repetition of a pattern
function rep(pattern, separator, min, max) {
    var separated = !separator ? pattern :
        seq(separator, pattern).then(function (r) { return r[1] });

    if (!isFinite(min)) min = 1;
    if (!isFinite(max)) max = Infinity;

    return new Pattern(pattern + '*', function (str, pos) {
        var res = [], end = pos, r = pattern.exec(str, end);

        while (r && r.end > end && res.length < max) {
            res.push(r.res);
            end = r.end;
            r = separated.exec(str, end);
        }

        return res.length >= min ? { res: res, end: end } : null;
    });
}

export {
  Pattern, // to allow extending Pattern.prototype
  txt,
  rgx,
  opt,
  exc,
  any,
  seq,
  rep
};
