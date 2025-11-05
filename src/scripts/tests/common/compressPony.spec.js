"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../lib");
const fs = tslib_1.__importStar(require("fs"));
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const bitUtils_1 = require("../../common/bitUtils");
const compressPony_1 = require("../../common/compressPony");
const colors_1 = require("../../common/colors");
const utils_1 = require("../../common/utils");
const base64_js_1 = require("base64-js");
const paths_1 = require("../../server/paths");
// const poniesPath = pathTo('src', 'tests', 'ponies');
function base(black, white) {
    return {
        head: undefined,
        nose: undefined,
        ears: undefined,
        horn: undefined,
        wings: undefined,
        frontHooves: undefined,
        backHooves: undefined,
        mane: undefined,
        backMane: undefined,
        tail: undefined,
        facialHair: undefined,
        headAccessory: undefined,
        earAccessory: undefined,
        faceAccessory: undefined,
        neckAccessory: undefined,
        frontLegAccessory: undefined,
        backLegAccessory: undefined,
        frontLegAccessoryRight: undefined,
        backLegAccessoryRight: undefined,
        lockBackLegAccessory: undefined,
        unlockFrontLegAccessory: false,
        unlockBackLegAccessory: false,
        backAccessory: undefined,
        waistAccessory: undefined,
        chestAccessory: undefined,
        sleeveAccessory: undefined,
        extraAccessory: undefined,
        coatFill: black,
        coatOutline: black,
        lockCoatOutline: undefined,
        eyelashes: 0,
        eyeColorLeft: black,
        eyeColorRight: black,
        eyeWhites: white,
        eyeWhitesLeft: white,
        eyeOpennessLeft: 0,
        eyeOpennessRight: 0,
        eyeshadow: false,
        eyeshadowColor: undefined,
        lockEyes: false,
        lockEyeColor: false,
        unlockEyeWhites: false,
        fangs: 0,
        muzzle: 0,
        freckles: 0,
        frecklesColor: undefined,
        cm: undefined,
        cmFlip: undefined,
        customOutlines: false,
        freeOutlines: false,
        darkenLockedOutlines: undefined,
        unlockEyelashColor: false,
        eyelashColor: black,
        eyelashColorLeft: black,
        magicColor: white,
    };
}
describe('compressPony', () => {
    describe('writeSet() + readSet()', () => {
        const tests = [
            [{ type: 1, pattern: 1, colors: 1, fillLocks: 0, fills: [1], outlineLocks: 0, outlines: [] }, 1, false],
            [{ type: 7, pattern: 6, colors: 3, fillLocks: 1, fills: [5, 7], outlineLocks: 0, outlines: [] }, 4, false],
            [{ type: 7, pattern: 6, colors: 3, fillLocks: 1, fills: [5, 7], outlineLocks: 2, outlines: [3, 4] }, 4, true],
        ];
        tests.forEach(test => it(`works for set: ${JSON.stringify(test)}`, () => {
            const [set, colorBits, customOutlines] = test;
            const buffer = (0, bitUtils_1.bitWriter)(write => (0, compressPony_1.writeSet)(write, colorBits, customOutlines, set));
            // console.log(map(buffer, x => x).map(x => x.toString(2).padStart(8, '0')).join(' '));
            const result = (0, compressPony_1.readSet)((0, bitUtils_1.bitReader)(buffer), colorBits, customOutlines);
            (0, chai_1.expect)(result).eql(set);
        }));
    });
    describe('writePony() + readPony()', () => {
        const set1 = {
            type: 1, pattern: 1, colors: 1, fillLocks: 0, fills: [1], outlineLocks: 0, outlines: []
        };
        const set2 = {
            type: 7, pattern: 6, colors: 3, fillLocks: 1, fills: [1, 2], outlineLocks: 2, outlines: [3, 4]
        };
        const base = {
            version: compressPony_1.VERSION,
            colors: [],
            booleanFields: [],
            numberFields: [],
            colorFields: [],
            setFields: [],
            cm: [],
        };
        const tests = [
            base,
            (0, lodash_1.merge)({}, base, { colors: [colors_1.RED, colors_1.BLUE, colors_1.GREEN] }),
            (0, lodash_1.merge)({}, base, { colors: [colors_1.RED, colors_1.BLUE, colors_1.GREEN], cm: [1, 2, 1, 1, 2] }),
            (0, lodash_1.merge)({}, base, { colors: [colors_1.RED, colors_1.BLUE, colors_1.GREEN], setFields: [set1] }),
            (0, lodash_1.merge)({}, base, { colors: [colors_1.RED, colors_1.BLUE, colors_1.GREEN, colors_1.ORANGE, colors_1.CYAN], setFields: { nose: set2 }, booleanFields: [true] }),
            (0, lodash_1.merge)({}, base, { colors: [colors_1.RED, colors_1.BLUE, colors_1.GREEN], cm: [1, 2, 1, 1, 2], booleanFields: [true, false, true, false] }),
            (0, lodash_1.merge)({}, base, { booleanFields: [true, false] }),
        ];
        tests.forEach(test => it(`works for pony: ${JSON.stringify(test)}`, () => {
            const buffer = (0, bitUtils_1.bitWriter)(write => (0, compressPony_1.writePony)(write, test));
            const result = (0, compressPony_1.readPony)((0, bitUtils_1.bitReader)(buffer));
            (0, chai_1.expect)(result).eql(test);
        }));
    });
    describe('precompressCM()', () => {
        it('converts colors to indexes', () => {
            const cm = [colors_1.RED, colors_1.RED, colors_1.RED];
            (0, chai_1.expect)((0, compressPony_1.precompressCM)(cm, () => 1)).eql([1, 1, 1]);
        });
        it('handles holey arrays', () => {
            const cm = [colors_1.RED, , , colors_1.RED];
            (0, chai_1.expect)((0, compressPony_1.precompressCM)(cm, c => c === undefined ? 0 : 1)).eql([1, 0, 0, 1]);
        });
        it('empty CM', () => {
            (0, chai_1.expect)((0, compressPony_1.precompressCM)([], () => 1)).eql([]);
        });
        it('trims CM', () => {
            const cm = [colors_1.RED, colors_1.RED, colors_1.RED, colors_1.TRANSPARENT, colors_1.TRANSPARENT];
            (0, chai_1.expect)((0, compressPony_1.precompressCM)(cm, () => 1)).eql([1, 1, 1]);
        });
        it('trims CM size to 25', () => {
            const cm = (0, utils_1.repeat)(50, colors_1.RED);
            (0, chai_1.expect)((0, compressPony_1.precompressCM)(cm, () => 1).length).equal(25);
        });
    });
    describe('precompressPony() + postdecompressPony()', () => {
        const BASE = base(colors_1.BLACK, colors_1.WHITE);
        function test(input, expected) {
            return () => {
                const data = (0, compressPony_1.precompressPony)(input, colors_1.BLACK, x => x);
                const result1 = (0, compressPony_1.postdecompressPony)(data, x => x);
                const result2 = (0, compressPony_1.fastPostdecompressPony)(data);
                (0, chai_1.expect)(result1).eql({ ...BASE, ...(expected || input) }, 'postdecompressPony');
                (0, chai_1.expect)(result2).eql({ ...BASE, ...(expected || input) }, 'fastPostdecompressPony');
            };
        }
        it('empty', test({}, {
            coatOutline: undefined,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
        }));
        it('colors', test({
            coatFill: colors_1.RED,
            coatOutline: colors_1.RED,
            eyeColorLeft: colors_1.RED,
            eyeColorRight: colors_1.RED,
            eyeWhites: colors_1.RED,
            eyeshadowColor: colors_1.RED,
            frecklesColor: undefined,
            customOutlines: true,
            freckles: 0,
            eyeOpennessLeft: 0,
            eyeOpennessRight: 0,
            fangs: 0,
            muzzle: 0,
            eyelashes: 0,
            eyeshadow: true,
            lockEyes: false,
            lockEyeColor: false,
            lockCoatOutline: false,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
        }));
        it('booleans', test({
            customOutlines: true,
            lockEyes: true,
            lockEyeColor: true,
            lockCoatOutline: true,
        }, {
            customOutlines: true,
            lockEyes: true,
            lockEyeColor: true,
            lockCoatOutline: true,
            coatOutline: undefined,
            eyeColorLeft: undefined,
            eyeOpennessLeft: undefined,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
        }));
        it('removes lockBackLegAccessory', test({
            lockBackLegAccessory: true
        }, {
            coatOutline: undefined,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
        }));
        it('set', test({
            customOutlines: true,
            lockCoatOutline: true,
            coatOutline: undefined,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
            tail: {
                type: 1,
                pattern: 1,
                fills: [colors_1.RED, colors_1.BLUE, colors_1.GREEN, colors_1.ORANGE, colors_1.CYAN],
                lockFills: [false, false, false, false, false, false],
                outlines: [colors_1.RED, colors_1.RED, colors_1.RED, colors_1.RED, colors_1.RED],
                lockOutlines: [false, false, false, false, false, true],
            }
        }));
        it('missing set fields', test({
            customOutlines: true,
            tail: {
                type: 1,
                pattern: 1
            }
        }, {
            customOutlines: true,
            lockCoatOutline: false,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
            tail: {
                type: 1,
                pattern: 1,
                fills: [colors_1.BLACK, colors_1.BLACK, colors_1.BLACK, colors_1.BLACK, colors_1.BLACK],
                lockFills: [false, false, false, false, false, false],
                outlines: [colors_1.BLACK, colors_1.BLACK, colors_1.BLACK, colors_1.BLACK, colors_1.BLACK],
                lockOutlines: [false, false, false, false, false, true],
            }
        }));
        it('missing set color', test({
            customOutlines: true,
            tail: {
                type: 1,
                pattern: 1,
                fills: [colors_1.RED, colors_1.BLUE, undefined, colors_1.ORANGE, colors_1.CYAN],
                lockFills: [false, false, false, false, false, false],
                outlines: [colors_1.RED, undefined, colors_1.RED, colors_1.RED, colors_1.RED],
                lockOutlines: [false, false, false, false, false, true],
            }
        }, {
            customOutlines: true,
            lockCoatOutline: false,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
            tail: {
                type: 1,
                pattern: 1,
                fills: [colors_1.RED, colors_1.BLUE, colors_1.BLACK, colors_1.ORANGE, colors_1.CYAN],
                lockFills: [false, false, false, false, false, false],
                outlines: [colors_1.RED, colors_1.BLACK, colors_1.RED, colors_1.RED, colors_1.RED],
                lockOutlines: [false, false, false, false, false, true],
            }
        }));
        it('cm', test({
            cm: [undefined, colors_1.RED, undefined, colors_1.BLUE],
        }, {
            cm: [colors_1.TRANSPARENT, colors_1.RED, colors_1.TRANSPARENT, colors_1.BLUE],
            cmFlip: false,
            coatOutline: undefined,
            eyeWhitesLeft: undefined,
            eyelashColorLeft: undefined,
        }));
    });
    describe('decompressPony()', () => {
        it('works for empty string', () => {
            (0, chai_1.expect)((0, compressPony_1.decompressPony)('')).eql(base(colors_1.BLACK, colors_1.WHITE));
        });
        it('decompresses a pony', () => {
            const pony = (0, compressPony_1.decompressPony)('CAKVlZUvLy82QIxomgCfgAYAGIAoQGEBwAEERFEUEA==');
            (0, chai_1.expect)(pony.coatFill).equal(0x959595ff);
            (0, chai_1.expect)(pony.mane.type).equal(2);
            (0, chai_1.expect)(pony.mane.pattern).equal(0);
            (0, chai_1.expect)(pony.mane.fills).eql([0x2f2f2fff]);
        });
        it('decompresses a pony from buffer', () => {
            const pony = (0, compressPony_1.decompressPony)((0, base64_js_1.toByteArray)('CAKVlZUvLy82QIxomgCfgAYAGIAoQGEBwAEERFEUEA=='));
            (0, chai_1.expect)(pony.coatFill).equal(0x959595ff);
            (0, chai_1.expect)(pony.mane.type).equal(2);
            (0, chai_1.expect)(pony.mane.pattern).equal(0);
            (0, chai_1.expect)(pony.mane.fills).eql([0x2f2f2fff]);
        });
    });
    describe('decompressPonyString()', () => {
        it('works for empty string', () => {
            (0, chai_1.expect)((0, compressPony_1.decompressPonyString)('')).eql(base('000000', 'ffffff'));
        });
        it('works for empty string (editable: true)', () => {
            (0, compressPony_1.decompressPonyString)('', true);
        });
    });
    describe('compressPony() + decompressPony()', () => {
        const BASE = base('000000', 'ffffff');
        function test(input, expected) {
            return () => {
                const data = (0, compressPony_1.compressPonyString)(input);
                const result = (0, compressPony_1.decompressPonyString)(data, false);
                (0, chai_1.expect)(result).eql({ ...BASE, ...(expected || input) });
            };
        }
        it('empty', test({}, {}));
        it('coatFill', test({ coatFill: 'ff0000' }, { coatFill: 'ff0000', coatOutline: 'b30000' }));
        it('eyeColorLeft', test({
            eyeColorLeft: 'ff00ff',
        }, {
            coatFill: '000000',
            coatOutline: '000000',
            eyeColorLeft: 'ff00ff',
            eyeColorRight: '000000',
        }));
        it('eyeColorLeft + eyeColorRight', test({
            eyeColorLeft: 'ff00ff',
            eyeColorRight: '00ff00',
        }, {
            coatFill: '000000',
            coatOutline: '000000',
            eyeColorLeft: 'ff00ff',
            eyeColorRight: '00ff00',
        }));
        it('eyeColorLeft + eyeColorRight (locked)', test({
            lockEyeColor: true,
            eyeColorLeft: '00ff00',
            eyeColorRight: 'ff00ff',
        }, {
            lockEyes: false,
            lockEyeColor: true,
            customOutlines: false,
            coatFill: '000000',
            coatOutline: '000000',
            eyeColorLeft: 'ff00ff',
            eyeColorRight: 'ff00ff',
        }));
        it('eyeshadow', test({
            eyeshadow: true,
            eyeshadowColor: 'ff00ff',
        }, {
            eyeshadow: true,
            eyeshadowColor: 'ff00ff',
            coatFill: '000000',
            coatOutline: '000000',
            eyeColorLeft: '000000',
            eyeColorRight: '000000',
            eyeWhites: 'ffffff',
            lockEyes: false,
            lockEyeColor: false,
            customOutlines: false,
        }));
        it('cm', test({ cm: ['ff0000', '', '00ff00'] }, { cm: ['ff0000', '', '00ff00'], cmFlip: false }));
        it('cm (flip)', test({
            cm: ['ff0000', '', '00ff00'],
            cmFlip: true,
        }, {
            cm: ['ff0000', '', '00ff00'],
            cmFlip: true,
        }));
        it('all locked', test({
            tail: {
                type: 2,
                pattern: 1,
                fills: [],
                lockFills: [true, true, true, true, true, true],
            }
        }, {
            tail: {
                type: 2,
                pattern: 1,
                fills: [undefined, undefined, undefined, undefined, undefined, undefined],
                lockFills: [true, true, true, true, true, true],
                outlines: [undefined, undefined, undefined, undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('set', test({
            mane: {
                type: 1,
                pattern: 1,
                fills: ['f0f0f0', 'ff0000', 'fff000', 'ff0f00', 'ff00f0', 'ff000f'],
                lockFills: [false, false, false, false, false, false],
            }
        }, {
            mane: {
                type: 1,
                pattern: 1,
                fills: ['f0f0f0', 'ff0000', 'fff000', 'ff0f00', 'ff00f0', 'ff000f'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['a8a8a8', 'b30000', 'b3a800', 'b30b00', 'b300a8', 'b3000a'],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('0 colors', test({
            ears: {
                type: 0,
                pattern: 0,
                fills: ['000000'],
                lockFills: [false],
            }
        }, {
            ears: {
                type: 0,
                pattern: 0,
                fills: ['000000'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['000000', undefined, undefined, undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('extraAccessory', test({
            extraAccessory: {
                type: 0,
                pattern: 0,
                fills: ['f0f0f0', 'ff0000', 'fff000', 'ff0f00', 'ff00f0'],
                lockFills: [false, false, false, false, false],
            }
        }, {
            extraAccessory: {
                type: 0,
                pattern: 0,
                fills: ['f0f0f0', 'ff0000', 'fff000', 'ff0f00', 'ff00f0'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['a8a8a8', 'b30000', 'b3a800', 'b30b00', 'b300a8', undefined],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('neckAccessory', test({
            neckAccessory: { type: 0, pattern: 0 }
        }, {}));
        it('locked fills', test({
            mane: {
                type: 1,
                pattern: 0,
                fills: ['ff0000'],
                lockFills: [],
            },
            backMane: {
                type: 15,
                pattern: 1,
                fills: ['ffffff', '00ff00', 'ffffff'],
                lockFills: [true, false, true],
            },
        }, {
            mane: {
                type: 1,
                pattern: 0,
                fills: ['ff0000'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['b30000', undefined, undefined, undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            },
            backMane: {
                type: 15,
                pattern: 1,
                fills: ['ff0000', '00ff00', 'ff0000'],
                lockFills: [true, false, true, false, false, false],
                outlines: ['b30000', '00b300', 'b30000', undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            },
        }));
        it('locked back hooves', test({
            frontHooves: {
                type: 0,
                pattern: 0,
                fills: ['ff0000'],
            },
            backHooves: {
                type: 1,
                pattern: 0,
                lockFills: [true],
            }
        }, {
            frontHooves: {
                type: 0,
                pattern: 0,
                fills: ['ff0000'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['b30000', undefined, undefined, undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            },
            backHooves: {
                type: 1,
                pattern: 0,
                fills: ['ff0000'],
                lockFills: [true, false, false, false, false, false],
                outlines: ['b30000', undefined, undefined, undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('back mane', test({
            mane: {
                type: 3,
                pattern: 1,
                fills: ['000000', 'ffffff'],
            },
            backMane: {
                type: 2,
                pattern: 1,
                fills: ['ffffff', 'ff0000'],
                lockFills: [false, false, true, true, true, true],
            }
        }, {
            mane: {
                type: 3,
                pattern: 1,
                fills: ['000000', 'ffffff', '000000', '000000', '000000', '000000'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['000000', 'b3b3b3', '000000', '000000', '000000', '000000'],
                lockOutlines: [true, true, true, true, true, true],
            },
            backMane: {
                type: 2,
                pattern: 1,
                fills: ['ffffff', 'ff0000', 'ffffff', 'ffffff', 'ffffff', 'ffffff'],
                lockFills: [false, false, true, true, true, true],
                outlines: ['b3b3b3', 'b30000', 'b3b3b3', 'b3b3b3', 'b3b3b3', 'b3b3b3'],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('chest accessory (adds default sleeve if missing)', test({
            chestAccessory: {
                type: 2,
                pattern: 8,
                fills: ['ff0000', '00ff00', '0000ff'],
            }
        }, {
            chestAccessory: {
                type: 2,
                pattern: 8,
                fills: ['ff0000', '00ff00', '0000ff'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['b30000', '00b300', '0000b3', undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            },
            sleeveAccessory: {
                type: 0,
                pattern: 0,
                fills: ['ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000', 'ff0000'],
                lockFills: [true, true, true, true, true, true],
                outlines: ['b30000', 'b30000', 'b30000', 'b30000', 'b30000', 'b30000'],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('back leg accessory', test({
            backLegAccessory: {
                type: 1,
                pattern: 0,
                fills: ['ff0000'],
                lockFills: [false],
            }
        }, {
            lockBackLegAccessory: false,
            backLegAccessory: {
                type: 1,
                pattern: 0,
                fills: ['ff0000'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['b30000', undefined, undefined, undefined, undefined, undefined],
                lockOutlines: [true, true, true, true, true, true],
            }
        }));
        it('cm (with undefined)', test({
            cm: [
                ,
                , , 'fde9cd', ,
                'fde9cd', , , , ,
                ,
                , 'fde9cd', , 'fde9cd',
                ,
                , , , ,
                ,
                , 'fde9cd', ,
            ]
        }, {
            cm: [
                '', '', '', 'fde9cd', '',
                'fde9cd', '', '', '', '',
                '', '', 'fde9cd', '', 'fde9cd',
                '', '', '', '', '',
                '', '', 'fde9cd'
            ],
            cmFlip: false,
        }));
        it('back leg accessory (editable)', () => {
            const data = (0, compressPony_1.compressPonyString)({
                lockBackLegAccessory: false,
                backLegAccessory: {
                    type: 1,
                    pattern: 1,
                    fills: ['ff0000', '00ff00', '0000ff', 'ffff00', '00ffff', 'ff00ff'],
                    lockFills: [false],
                }
            });
            const result = (0, compressPony_1.decompressPonyString)(data, true);
            (0, chai_1.expect)(result.lockBackLegAccessory).false;
            (0, chai_1.expect)(result.backLegAccessory).eql({
                type: 1,
                pattern: 1,
                fills: ['ff0000', '00ff00', '0000ff', 'ffff00', '00ffff', 'ff00ff'],
                lockFills: [false, false, false, false, false, false],
                outlines: ['b30000', '00b300', '0000b3', 'b3b300', '00b3b3', 'b300b3'],
                lockOutlines: [true, true, true, true, true, true],
            });
        });
        it('black colors (editable)', () => {
            const data = (0, compressPony_1.compressPonyString)({ coatFill: '000000' });
            const result = (0, compressPony_1.decompressPonyString)(data, true);
            (0, chai_1.expect)(result.coatFill).equal('000000');
        });
        it('neckAccessory: { type: 0 }', () => {
            const data = (0, compressPony_1.compressPonyString)({ neckAccessory: { type: 0, pattern: 0 } });
            const result = (0, compressPony_1.decompressPonyString)(data, true);
            (0, chai_1.expect)(result.neckAccessory.type).eql(0);
        });
        it('mane: { type: 0 }', () => {
            const data = (0, compressPony_1.compressPonyString)({ mane: { type: 0, pattern: 0 } });
            const result = (0, compressPony_1.decompressPonyString)(data, true);
            (0, chai_1.expect)(result.mane.type).eql(0);
        });
        // fs.readdirSync(poniesPath).forEach(f => it(`(${f})`, () => {
        // 	const json = JSON.parse(fs.readFileSync(path.join(poniesPath, f), 'utf8'));
        // 	const data = compressPonyString(json);
        // 	const result = decompressPonyString(data, true);
        // 	expect(result).eql(json);
        // }));
        it.skip('error test', () => {
            const json = JSON.parse(fs.readFileSync((0, paths_1.pathTo)('tools', 'data', 'error-1504869659641.json'), 'utf8'));
            const infoJson = json.data.info;
            const compressedTemp = 'CAjNzc3////apSD/1wAekP8yzTLacNbcFDw+oCoACJiRngCBNET8ADjAcAAlSUCrPH6QGAA=';
            console.log(Array.from((0, base64_js_1.toByteArray)(compressedTemp)).map(x => x.toString(16).padStart(2, '0')).join(' '));
            console.log(Array.from((0, base64_js_1.toByteArray)(json.data.compressed)).map(x => x.toString(16).padStart(2, '0')).join(' '));
            const compressed = (0, compressPony_1.compressPonyString)(infoJson);
            //const result = decompressPonyString(compressed, true);
            (0, chai_1.expect)(compressed).eql(json.data.compressed);
        });
    });
});
//# sourceMappingURL=compressPony.spec.js.map