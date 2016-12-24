// A set of predefined transforms for Pattern.

class Pattern {
  constructor (name, exec) {
    this.params = {name, exec};

    this.exec = (str, pos) => {
      let r = exec(str, pos || 0);
      return pos >= 0 ? r : !r ? null : r.end != str.length ? null : r.res;
    };

    this.then = (transform)  =>
      new Pattern(name, function (str, pos) {
        let r = exec(str, pos);
        return r && { res: transform(r.res, str.slice(pos, r.end)), end: r.end };
      });
  }

  toString () {
    return this.params.name;
  }

  make (value) {
    return this.then(() => value );
  }

  select (index) {
    return this.then(r => r ? r[index] : undefined );
  }

  as (name) {
    return this.then(r => ({[name]: r}));
  }

  map (mapping) {
    return this.then(r => {
      let m = {}, i;
      for (i in mapping) {
        m[i] = r[mapping[i]];
      }

      return m;
    });
  }

  parseInt(radix) {
    return this.then(r =>  parseInt(r, radix));
  }

  parseFloat() {
    return this.then(r => parseFloat(r));
  }

  merge (separator = '') {
    return this.then(r =>  r.join(separator) );
  }

  trim() {
    return this.then(r =>  r.trim());
  }

  slice (start, end) {
    return this.then( r =>  r.slice(start, end) );
  }

  text () {
    return this.then( (r, s) => s );
  }

  join (key, val) {
    return this.then( r => {
      let m = {};

      for (let i = 0; i < r.length; i++) {
        m[r[i][key]] = r[i][val];
      }

      return m;
    });
  }

  flatten () {
    const flatten = a =>
      a.reduce((accum, el) => {
        if (Array.isArray(el)) accum = accum.concat(flatten(el));
        else accum.push(el);

        return accum;
      }, []);

    return this.then(r => flatten(r));
  }
}

export default Pattern;