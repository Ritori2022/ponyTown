"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const utils_1 = require("../../common/utils");
const rect_1 = require("../../common/rect");
describe('utils', () => {
    describe('fromNow()', () => {
        let clock;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
        });
        afterEach(() => {
            clock.restore();
        });
        it('returns date object', () => {
            (0, chai_1.expect)((0, utils_1.fromNow)(0)).instanceof(Date);
        });
        it('returns current time for 0 offset', () => {
            clock.setSystemTime(123);
            (0, chai_1.expect)((0, utils_1.fromNow)(0).getTime()).equal(123);
        });
        it('returns current time offset by given amount', () => {
            clock.setSystemTime(123);
            (0, chai_1.expect)((0, utils_1.fromNow)(100).getTime()).equal(223);
        });
    });
    describe('maxDate()', () => {
        it('returns larger of two dates', () => {
            (0, chai_1.expect)((0, utils_1.maxDate)(new Date(123), new Date(122)).getTime()).equal(123);
        });
        it('returns larger of two dates (2)', () => {
            (0, chai_1.expect)((0, utils_1.maxDate)(new Date(123), new Date(124)).getTime()).equal(124);
        });
        it('returns non-undefined date', () => {
            (0, chai_1.expect)((0, utils_1.maxDate)(new Date(123), undefined).getTime()).equal(123);
        });
        it('returns non-undefined date (2)', () => {
            (0, chai_1.expect)((0, utils_1.maxDate)(undefined, new Date(123)).getTime()).equal(123);
        });
        it('returns undefined if both dates are undefined', () => {
            (0, chai_1.expect)((0, utils_1.maxDate)(undefined, undefined)).undefined;
        });
    });
    describe('minDate()', () => {
        it('returns smaller of two dates', () => {
            (0, chai_1.expect)((0, utils_1.minDate)(new Date(123), new Date(122)).getTime()).equal(122);
        });
        it('returns smaller of two dates (2)', () => {
            (0, chai_1.expect)((0, utils_1.minDate)(new Date(123), new Date(124)).getTime()).equal(123);
        });
        it('returns non-undefined date', () => {
            (0, chai_1.expect)((0, utils_1.minDate)(new Date(123), undefined).getTime()).equal(123);
        });
        it('returns non-undefined date (2)', () => {
            (0, chai_1.expect)((0, utils_1.minDate)(undefined, new Date(123)).getTime()).equal(123);
        });
        it('returns undefined if both dates are undefined', () => {
            (0, chai_1.expect)((0, utils_1.minDate)(undefined, undefined)).undefined;
        });
    });
    describe('formatDuration()', () => {
        it('returns 0s for 0 duration', () => {
            (0, chai_1.expect)((0, utils_1.formatDuration)(0)).equal('0s');
        });
        it('returns duration seconds', () => {
            (0, chai_1.expect)((0, utils_1.formatDuration)(15000)).equal('15s');
        });
        it('returns duration minutes and seconds', () => {
            (0, chai_1.expect)((0, utils_1.formatDuration)(15 * 60 * 1000 + 6 * 1000)).equal('15m 6s');
        });
        it('returns duration hours and minutes', () => {
            (0, chai_1.expect)((0, utils_1.formatDuration)(15 * 3600 * 1000 + 13 * 60 * 1000 + 6 * 1000)).equal('15h 13m');
        });
        it('returns days and hours', () => {
            (0, chai_1.expect)((0, utils_1.formatDuration)((10 + 24 * 2) * 3600 * 1000 + 13 * 60 * 1000 + 6 * 1000)).equal('2d 10h');
        });
    });
    describe('clamp()', () => {
        it('returns given value if within range', () => {
            (0, chai_1.expect)((0, utils_1.clamp)(2, 1, 3)).equal(2);
        });
        it('returns minimum for value below minimum', () => {
            (0, chai_1.expect)((0, utils_1.clamp)(0, 1, 3)).equal(1);
        });
        it('returns maximum for value above maximum', () => {
            (0, chai_1.expect)((0, utils_1.clamp)(5, 1, 3)).equal(3);
        });
        it('returns minimum for NaN', () => {
            (0, chai_1.expect)((0, utils_1.clamp)(NaN, 1, 3)).equal(1);
        });
    });
    describe('normalize()', () => {
        it('returns given values as vector', () => {
            (0, chai_1.expect)((0, utils_1.normalize)(1, 0)).eql({ x: 1, y: 0 });
        });
        it('returns normalized vector', () => {
            (0, chai_1.expect)((0, utils_1.normalize)(0, -5)).eql({ x: 0, y: -1 });
        });
    });
    describe('toInt()', () => {
        it('returns given integer value', () => {
            (0, chai_1.expect)((0, utils_1.toInt)(1)).equal(1);
            (0, chai_1.expect)((0, utils_1.toInt)(-5)).equal(-5);
        });
        it('converts float number to integer value', () => {
            (0, chai_1.expect)((0, utils_1.toInt)(1.5)).eql(1);
            (0, chai_1.expect)((0, utils_1.toInt)(0.15)).eql(0);
            (0, chai_1.expect)((0, utils_1.toInt)(123.9)).eql(123);
        });
        it('converts string to integer value', () => {
            (0, chai_1.expect)((0, utils_1.toInt)('1.5')).eql(1);
            (0, chai_1.expect)((0, utils_1.toInt)('5')).eql(5);
        });
        it('converts null or undefined to 0', () => {
            (0, chai_1.expect)((0, utils_1.toInt)(null)).eql(0);
            (0, chai_1.expect)((0, utils_1.toInt)(undefined)).eql(0);
        });
        it('converts any object or array to 0', () => {
            (0, chai_1.expect)((0, utils_1.toInt)([])).eql(0);
            (0, chai_1.expect)((0, utils_1.toInt)({})).eql(0);
        });
    });
    describe('hasFlag()', () => {
        let Foo;
        (function (Foo) {
            Foo[Foo["Aaa"] = 1] = "Aaa";
            Foo[Foo["Bbb"] = 2] = "Bbb";
        })(Foo || (Foo = {}));
        it('returns true if flag is set', () => {
            (0, chai_1.expect)((0, utils_1.hasFlag)(Foo.Aaa, Foo.Aaa)).true;
        });
        it('returns true if flag is also set', () => {
            (0, chai_1.expect)((0, utils_1.hasFlag)(Foo.Aaa | Foo.Bbb, Foo.Aaa)).true;
        });
        it('returns false if flag is not set', () => {
            (0, chai_1.expect)((0, utils_1.hasFlag)(Foo.Bbb, Foo.Aaa)).false;
        });
    });
    describe('setFlag()', () => {
        let Foo;
        (function (Foo) {
            Foo[Foo["Aaa"] = 1] = "Aaa";
            Foo[Foo["Bbb"] = 2] = "Bbb";
        })(Foo || (Foo = {}));
        it('sets flag', () => {
            (0, chai_1.expect)((0, utils_1.setFlag)(0, Foo.Aaa, true)).equal(Foo.Aaa);
        });
        it('unsets flag', () => {
            (0, chai_1.expect)((0, utils_1.setFlag)(Foo.Aaa, Foo.Aaa, false)).equal(0);
        });
        it('does nothing if already set', () => {
            (0, chai_1.expect)((0, utils_1.setFlag)(Foo.Aaa, Foo.Aaa, true)).equal(Foo.Aaa);
        });
        it('does nothing if already unset', () => {
            (0, chai_1.expect)((0, utils_1.setFlag)(0, Foo.Aaa, false)).equal(0);
        });
        it('sets with another flag', () => {
            (0, chai_1.expect)((0, utils_1.setFlag)(Foo.Bbb, Foo.Aaa, true)).equal(Foo.Aaa | Foo.Bbb);
        });
        it('unsets flag with another flag', () => {
            (0, chai_1.expect)((0, utils_1.setFlag)(Foo.Bbb | Foo.Aaa, Foo.Aaa, false)).equal(Foo.Bbb);
        });
    });
    describe('includes()', () => {
        it('returns true if array includes given element', () => {
            (0, chai_1.expect)((0, utils_1.includes)(['a', 'b', 'c'], 'b')).true;
        });
        it('returns false if array does not include given element', () => {
            (0, chai_1.expect)((0, utils_1.includes)(['a', 'b', 'c'], 'd')).false;
        });
        it('returns false if array is undefined', () => {
            (0, chai_1.expect)((0, utils_1.includes)(undefined, 'b')).false;
        });
    });
    describe('flatten()', () => {
        it('returns empty array for ampty array', () => {
            (0, chai_1.expect)((0, utils_1.flatten)([])).eql([]);
        });
        it('flattens single array', () => {
            (0, chai_1.expect)((0, utils_1.flatten)([[1, 2, 3]])).eql([1, 2, 3]);
        });
        it('flattens multiple arrays', () => {
            (0, chai_1.expect)((0, utils_1.flatten)([[1, 2, 3], [4, 5]])).eql([1, 2, 3, 4, 5]);
        });
    });
    describe('at()', () => {
        it('returns item at given index', () => {
            (0, chai_1.expect)((0, utils_1.at)(['a', 'b', 'c'], 1)).equal('b');
        });
        it('clamps index to array length', () => {
            (0, chai_1.expect)((0, utils_1.at)(['a', 'b', 'c'], 4)).equal('c');
        });
        it('clamps index to 0', () => {
            (0, chai_1.expect)((0, utils_1.at)(['a', 'b', 'c'], -1)).equal('a');
        });
        it('converts index to integer', () => {
            (0, chai_1.expect)((0, utils_1.at)(['a', 'b', 'c'], '1.3')).equal('b');
        });
        it('returns undefined for empty items list', () => {
            (0, chai_1.expect)((0, utils_1.at)([], 0)).undefined;
        });
    });
    describe('att()', () => {
        it('returns item at given index', () => {
            (0, chai_1.expect)((0, utils_1.att)(['a', 'b', 'c'], 1)).equal('b');
        });
        it('clamps index to array length', () => {
            (0, chai_1.expect)((0, utils_1.att)(['a', 'b', 'c'], 4)).equal('c');
        });
        it('clamps index to 0', () => {
            (0, chai_1.expect)((0, utils_1.att)(['a', 'b', 'c'], -1)).equal('a');
        });
        it('converts index to integer', () => {
            (0, chai_1.expect)((0, utils_1.att)(['a', 'b', 'c'], '1.3')).equal('b');
        });
        it('returns undefined for undefined items list', () => {
            (0, chai_1.expect)((0, utils_1.att)(undefined, 0)).undefined;
        });
        it('returns undefined for null items list', () => {
            (0, chai_1.expect)((0, utils_1.att)(null, 0)).undefined;
        });
        it('returns undefined for empty items list', () => {
            (0, chai_1.expect)((0, utils_1.att)([], 0)).undefined;
        });
    });
    describe('findById()', () => {
        it('returns item with given ID', () => {
            (0, chai_1.expect)((0, utils_1.findById)([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 'b')).eql({ id: 'b' });
        });
        it('returns undefined if not found', () => {
            (0, chai_1.expect)((0, utils_1.findById)([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 'd')).undefined;
        });
    });
    describe('arraysEqual()', () => {
        it('returns false for identical arrays', () => {
            (0, chai_1.expect)((0, utils_1.arraysEqual)([1, 2], [1, 2])).true;
        });
        it('returns false for different size arrays', () => {
            (0, chai_1.expect)((0, utils_1.arraysEqual)([1], [1, 2])).false;
        });
        it('returns false for different values in arrays', () => {
            (0, chai_1.expect)((0, utils_1.arraysEqual)([1, 3], [1, 2])).false;
        });
    });
    describe('removeItem()', () => {
        it('removes given item', () => {
            const array = [1, 2, 3];
            (0, chai_1.expect)((0, utils_1.removeItem)(array, 2)).true;
            (0, chai_1.expect)(array).eql([1, 3]);
        });
        it('removes only first instance of element', () => {
            const array = [1, 2, 3, 2];
            (0, chai_1.expect)((0, utils_1.removeItem)(array, 2)).true;
            (0, chai_1.expect)(array).eql([1, 3, 2]);
        });
        it('does nothing for empty array', () => {
            const array = [];
            (0, chai_1.expect)((0, utils_1.removeItem)(array, 2)).false;
            (0, chai_1.expect)(array).eql([]);
        });
        it('does nothing if iten does not exist', () => {
            const array = [1, 2, 3];
            (0, chai_1.expect)((0, utils_1.removeItem)(array, 5)).false;
            (0, chai_1.expect)(array).eql([1, 2, 3]);
        });
    });
    describe('removeById()', () => {
        it('removes item with given ID', () => {
            const x = { id: 2 };
            const array = [{ id: 1 }, x, { id: 3 }];
            (0, chai_1.expect)((0, utils_1.removeById)(array, 2)).equal(x);
            (0, chai_1.expect)(array).eql([{ id: 1 }, { id: 3 }]);
        });
        it('removes only first instance of element', () => {
            const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 2 }];
            (0, utils_1.removeById)(array, 2);
            (0, chai_1.expect)(array).eql([{ id: 1 }, { id: 3 }, { id: 2 }]);
        });
        it('does nothing for empty array', () => {
            const array = [];
            (0, chai_1.expect)((0, utils_1.removeById)(array, 2)).undefined;
            (0, chai_1.expect)(array).eql([]);
        });
        it('does nothing if iten does not exist', () => {
            const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
            (0, chai_1.expect)((0, utils_1.removeById)(array, 5)).undefined;
            (0, chai_1.expect)(array).eql([{ id: 1 }, { id: 2 }, { id: 3 }]);
        });
    });
    describe('dispose()', () => {
        it('calls dispose method on give object', () => {
            const disp = (0, sinon_1.spy)();
            (0, utils_1.dispose)({ dispose: disp });
            sinon_1.assert.called(disp);
        });
        it('returns undefined', () => {
            (0, chai_1.expect)((0, utils_1.dispose)({ dispose() { return 5; } })).undefined;
        });
        it('does nothing for undefined', () => {
            (0, utils_1.dispose)(undefined);
        });
    });
    describe('distance()', () => {
        it('returns distance between points', () => {
            (0, chai_1.expect)((0, utils_1.distance)({ x: 10, y: 0 }, { x: 20, y: 0 })).equal(10);
        });
    });
    describe('contains()', () => {
        it('returns true if point is inside moved bounds', () => {
            (0, chai_1.expect)((0, utils_1.contains)(10, 10, { x: 0, y: 0, w: 100, h: 100 }, { x: 12, y: 12 })).true;
        });
        it('returns false if point is not inside moved bounds', () => {
            (0, chai_1.expect)((0, utils_1.contains)(10, 10, { x: 0, y: 0, w: 100, h: 100 }, { x: 0, y: 0 })).false;
        });
    });
    describe('collidersIntersect()', () => {
        it('returns true if two colliders intersect', () => {
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(0, 0, (0, rect_1.rect)(10, 10, 20, 20), 0, 0, (0, rect_1.rect)(15, 15, 20, 20))).true;
        });
        it('returns true if two colliders intersect when moved', () => {
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(15, 15, (0, rect_1.rect)(10, 10, 10, 10), 0, 0, (0, rect_1.rect)(30, 30, 10, 10))).true;
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(0, 0, (0, rect_1.rect)(10, 10, 10, 10), -15, -15, (0, rect_1.rect)(30, 30, 10, 10))).true;
        });
        it('returns true if two colliders do not intersect', () => {
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(0, 0, (0, rect_1.rect)(10, 10, 20, 20), 0, 0, (0, rect_1.rect)(50, 50, 20, 20))).false;
        });
        it('returns true if two colliders touch edges', () => {
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(0, 0, (0, rect_1.rect)(10, 10, 10, 10), 0, 0, (0, rect_1.rect)(20, 10, 20, 10))).false;
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(0, 0, (0, rect_1.rect)(10, 10, 10, 10), 0, 0, (0, rect_1.rect)(10, 20, 10, 20))).false;
        });
        it('returns false if two colliders do not intersect when moved', () => {
            (0, chai_1.expect)((0, utils_1.collidersIntersect)(0, 0, (0, rect_1.rect)(10, 10, 20, 20), 20, 20, (0, rect_1.rect)(15, 15, 20, 20))).false;
        });
    });
    describe('isCommand()', () => {
        it('returns false for regular text', () => {
            (0, chai_1.expect)((0, utils_1.isCommand)('hello')).false;
        });
        it('returns true for text starting with /', () => {
            (0, chai_1.expect)((0, utils_1.isCommand)('/test')).true;
        });
        it('returns true for "/"', () => {
            (0, chai_1.expect)((0, utils_1.isCommand)('/')).true;
        });
    });
    describe('processCommand()', () => {
        it('returns command and args', () => {
            (0, chai_1.expect)((0, utils_1.processCommand)('/foo bar')).eql({ command: 'foo', args: 'bar' });
        });
        it('parses command without args', () => {
            (0, chai_1.expect)((0, utils_1.processCommand)('/foo')).eql({ command: 'foo', args: '' });
        });
        it('trims command name', () => {
            (0, chai_1.expect)((0, utils_1.processCommand)('/foo ')).eql({ command: 'foo', args: '' });
        });
        it('trims args', () => {
            (0, chai_1.expect)((0, utils_1.processCommand)('/foo bar ')).eql({ command: 'foo', args: 'bar' });
        });
    });
});
//# sourceMappingURL=utils.spec.js.map