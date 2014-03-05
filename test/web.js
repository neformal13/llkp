var assert = require('assert');
var fs = require('fs');

suite('Simulates loading scripts in a browser', function () {
    'use strict';

    var window;

    setup(function () {
        window = {};
    });

    function load(path) {
        var text = fs.readFileSync(path, 'utf8');
        var func = new Function('window', 'module', 'exports', 'require', text);
        return func(window);
    }

    test('Core', function () {
        load('core.js');

        assert.equal(typeof window.LLKP.Core.Pattern, 'function');
        assert.equal(typeof window.LLKP.Core.txt, 'function');
    });

    test('Core.Then', function () {
        load('core.js');
        load('core.then.js');

        assert.equal(typeof window.LLKP.Core.Pattern.prototype.select, 'function');
    });

    test('ABNF', function () {
        load('core.js');
        load('core.then.js');
        load('abnf.js');

        assert.equal(typeof window.LLKP.ABNF, 'function');
    });

    test('PEG', function () {
        load('core.js');
        load('core.then.js');
        load('peg.js');

        assert.equal(typeof window.LLKP.PEG, 'function');
    });
});
