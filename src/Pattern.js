// A set of predefined transforms for Pattern.
// Extends Pattern.prototype.

class Pattern {
  constructor (name, exec) {
    this.toString = function () {
      return name;
    };

    this.exec = function (str, pos) {
      var r = exec(str, pos || 0);
      return pos >= 0 ? r : !r ? null : r.end != str.length ? null : r.res;
    };

    this.then = function (transform) {
      return new Pattern(name, function (str, pos) {
        var r = exec(str, pos);
        return r && { res: transform(r.res, str.slice(pos, r.end)), end: r.end };
      });
    };
  }

  make (value) {
    return this.then(function () {
      return value;
    });
  }

  select (index) {
    return this.then(function (r) {
      return r ? r[index] : void 0;
    });
  }

  as (name) {
    return this.then(function (r) {
      var m = {};
      m[name] = r;
      return m;
    });
  }

  map (mapping) {
    return this.then(function (r) {
      var m = {}, i;
      for (i in mapping)
        m[i] = r[mapping[i]];
      return m;
    });
  }

  parseInt(radix) {
    return this.then(function (r) {
      return parseInt(r, radix);
    });
  }

  parseFloat() {
    return this.then(function (r) {
      return parseFloat(r);
    });
  }

  merge (separator) {
    return this.then(function (r) {
      return r.join(separator || '');
    });
  }

  trim() {
    return this.then(function (r) {
      return r.trim();
    });
  }

  slice (start, end) {
    return this.then(function (r) {
      return r.slice(start, end);
    });
  }

  text () {
    return this.then(function (r, s) {
      return s;
    });
  }

  join (key, val) {
    return this.then(function (r) {
      var m = {}, i;
      for (i = 0; i < r.length; i++)
        m[r[i][key]] = r[i][val];
      return m;
    });
  }

  flatten () {
    function flatten(a) {
      var f = [], i;
      for (i = 0; i < a.length; i++)
        if (a[i] instanceof Array)
          f = f.concat(flatten(a[i]));
        else
          f.push(a[i]);
      return f;
    }

    return this.then(function (r) {
      return flatten(r);
    });
  }
}

export default Pattern;