import {equal, deepEqual, strictEqual} from 'assert';
import  {
  txt,
  rgx,
  opt,
  any,
  seq,
  rep} from '../src/core';

suite('Core.Then', () => {
    suite('make', () => {
        test("1", () => {
            const p = txt('abc').make(123);
            const r = p.exec('abc');

            equal(r, 123);
        });

        test("2", () => {
            const p = rep(any(rgx(/[0-9]+/).make('d'), rgx(/[a-z]+/).make('w')));
            const r = p.exec('ab17cb27kjdjs73dk3');

            deepEqual(r, ['w', 'd', 'w', 'd', 'w', 'd', 'w', 'd']);
        });
    });

    suite('select', () => {
        test("1", () => {
            const p = rep(rgx(/\w+/), txt(',')).select(0);
            const r = p.exec('1,2,3');

            equal(r, '1');
        });

        test("2", () => {
            const p = rep(rgx(/\w+/), txt(',')).select(2);
            const r = p.exec('1,2,3');

            equal(r, '3');
        });

        test("3", () => {
            const p = rep(rgx(/\w+/), txt(',')).select(-1);
            const r = p.exec('1,2,3');

            equal(r, void 0);
        });

        test("4", () =>{
            const p = opt(txt('x')).select(123);
            const s = '';
            const r = p.exec(s);

            equal(r, void 0);
        });
    });

    suite('as', () => {
        test("1", () => {
            const p = rgx(/\w+/).as('w');
            const r = p.exec('123');

            deepEqual(r, { w: 123 });
        });

        test("2", () => {
            const p = rgx(/\w+/).as('w').as('m');
            const r = p.exec('123');

            deepEqual(r, { m: { w: 123 } });
        });
    });

    suite('map', () => {
        test("1", () => {
            let p = rep(rgx(/\w+/), rgx(/\s+/)).map({});
            let r = p.exec('abc def 123');

            deepEqual(r, {});
        });

        test("1", () =>{
            const p = rep(rgx(/\w+/), rgx(/\s+/)).map({x: 0, y: 1, z: 2});
            const r = p.exec('abc def 123');

            deepEqual(r, { x: 'abc', y: 'def', z: '123' });
        });

        test("1", () => {
            const p = rep(rgx(/\w+/), rgx(/\s+/)).map({x: 111});
            const r = p.exec('abc def 123');

            deepEqual(r, { x: void 0 });
        });
    });

    suite('parseInt', () => {
        test("10", () => {
            const p = rgx(/\w+/).parseInt();
            const r = p.exec('123');

            strictEqual(r, 123);
        });

        test("2", () => {
            const p = rgx(/\w+/).parseInt(2);
            const r = p.exec('1011');

            strictEqual(r, 11);
        });

        test("16", () => {
            const p = rgx(/\w+/).parseInt(16);
            const r = p.exec('20');

            strictEqual(r, 32);
        });
    });

    suite('parseFloat', () =>{
        test("1", () =>{
            const p = rgx(/.+/).parseFloat();
            const r = p.exec('123.456');

            strictEqual(r, 123.456);
        });

        test("2", () =>{
            const p = rgx(/.+/).parseFloat();
            const r = p.exec('123');

            strictEqual(r, 123);
        });
    });

    suite('merge', () =>{
        test("1", () =>{
            const p = rep(rgx(/\w+/), rgx(/\s+/)).merge();
            const r = p.exec('a  b c');

            equal(r, 'abc');
        });

        test("2", () => {
            const p = rep(rgx(/\w+/), rgx(/\s+/)).merge(';');
            const r = p.exec('a  b c');

            equal(r, 'a;b;c');
        });
    });

    suite('text', () => {
        test("1", () => {
            const p = txt('a').as('w').text();
            const r = p.exec('a');

            equal(r, 'a');
        });

        test("2", () => {
            const p = opt(txt('a')).text();
            const r = p.exec('');

            equal(r, '');
        });
    });

    suite('join', () => {
        test("1", () => {
            const p = rep(seq(rgx(/\w+/), txt('='), rgx(/\d+/).parseInt()), txt(';')).join(0, 2);
            const r = p.exec('a=1;bb=22;ccc=333');

            deepEqual(r, { a: 1, bb: 22, ccc: 333 });
        });

        test("2", () => {
            const p = rep(seq(rgx(/\w+/), txt('='), rgx(/\d+/).parseInt()), txt(';')).join(0, 111);
            const r = p.exec('a=1;bb=22;ccc=333');

            deepEqual(r, { a: void 0, bb: void 0, ccc: void 0 });
        });
    });

    suite('flatten', () => {
        test("1", () => {
            const q = {exec: (str, pos) => p.exec(str, pos)};
            const p = seq(txt('('), rep(any(rgx(/\w+/), q), txt(',')), txt(')')).select(1);
            const s = '((((1,2,3),4,5,(6,(7),8),9),((1,2,3),4,5,(6,7,8),9)))';
            const r = p.flatten().exec(s);
            const w = p.exec(s);

            deepEqual(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            deepEqual(w, [[[[1, 2, 3], 4, 5, [6, [7], 8], 9], [[1, 2, 3], 4, 5, [6, 7, 8], 9]]]);
        });
    });

    suite('trim', () => {
        test("1", () => {
            const p = rgx(/.+/).trim();
            const s = '123';
            const r = p.exec(s);

            deepEqual(r, '123');
        });

        test("2", () => {
            const p = rgx(/.+/).trim();
            const s = '   123   ';
            const r = p.exec(s);

            deepEqual(r, '123');
        });
    });

    suite('slice', () => {
        test("1", () => {
            const p = rgx(/\d+/).slice(1, 5);
            const s = '0123456789';
            const r = p.exec(s);

            equal(r, '1234');
        });

        test("2", () => {
            const p = rgx(/\d+/).slice(+1, -1);
            const s = '0123456789';
            const r = p.exec(s);

            equal(r, '12345678');
        });
    });
});
