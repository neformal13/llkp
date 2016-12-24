// LL(k) core parsing functions and combinators.
// Does not depend on other modules.

import Pattern from './Pattern';

// parses a known text
function txt(text) {
  const name = '"' + text.replace(/"/gm, '\\"') + '"';

  return new Pattern(name, (str, pos) => {
    if (str.substr(pos, text.length) === text) {
      return {res: text, end: pos + text.length};
    }
  });
}

// parses a regular expression
const rgx = regexp =>
  new Pattern(
    regexp + '',
    (str, pos) => {
      const m = regexp.exec(str.slice(pos));
      if (m && m.index === 0) { // regex must match at the beginning, so index must be 0
        return {res: m[0], end: pos + m[0].length};
      }
    }
  );

// parses an optional pattern
const opt = (pattern, defval) =>
  new Pattern(
    pattern + '?',
    (str, pos) => pattern.exec(str, pos) || {res: defval, end: pos}
  );

// parses a pattern if it doesn't match another pattern
const exc = (pattern, except) =>
  new Pattern(
    pattern + ' ~ ' + except,
    (str, pos) => !except.exec(str, pos) && pattern.exec(str, pos)
  );

// parses any of the given patterns
const any = (...patterns) =>
  new Pattern(
    '(' + patterns.join(' | ') + ')',
    (str, pos) => {
      let r;
      for (let i = 0; i < patterns.length && !r; i++) {
        r = patterns[i].exec(str, pos);
      }
      return r;
    });

// parses a sequence of patterns
const seq = (...patterns) =>
  new Pattern(
    '(' + patterns.join(' ') + ')',
    (str, pos) => {
      let r, end = pos, res = [];

      for (let i = 0; i < patterns.length; i++) {
        r = patterns[i].exec(str, end);
        if (!r) return;
        res.push(r.res);
        end = r.end;
      }

      return {res, end};
    }
  )

// parses a (separated) repetition of a pattern
const rep = (pattern, separator, min, max) => {
  const separated = !separator ? pattern :
    seq(separator, pattern).then(r => r[1]);

  if (!isFinite(min)) min = 1;
  if (!isFinite(max)) max = Infinity;

  return new Pattern(pattern + '*', (str, pos) => {
    let res = [], end = pos, r = pattern.exec(str, end);

    while (r && r.end > end && res.length < max) {
      res.push(r.res);
      end = r.end;
      r = separated.exec(str, end);
    }

    return res.length >= min ? {res: res, end: end} : null;
  });
};

export { Pattern, txt, rgx, opt, exc, any, seq, rep };
