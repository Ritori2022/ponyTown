"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheets = exports.SPECIAL_COLOR = exports.DEFAULT_COLOR = void 0;
exports.ignoreSet = ignoreSet;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const offsets = tslib_1.__importStar(require("./offsets"));
const ponyHelpers_1 = require("../client/ponyHelpers");
const colors_1 = require("./colors");
const ponyAnimations_1 = require("../client/ponyAnimations");
const utils_1 = require("./utils");
exports.DEFAULT_COLOR = 0xdec078ff;
exports.SPECIAL_COLOR = colors_1.ORANGE;
const headFrames = [
    { body: 1, front: 1, back: 1, wing: 0, tail: 0 },
];
const bodyFrames = [
    { body: 0, front: 1, back: 1, wing: 0, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 0, tail: 0 },
    { body: 2, front: 29, back: 1, wing: 0, tail: 0 },
    { body: 3, front: 30, back: 21, wing: 0, tail: 0 },
    { body: 4, front: 31, back: 22, wing: 0, tail: 0 },
    { body: 5, front: 32, back: 23, wing: 0, tail: 1 },
    { body: 6, front: 33, back: 24, wing: 1, tail: 2 },
    { body: 7, front: 34, back: 25, wing: 2, tail: 2 },
    { body: 8, front: 34, back: 25, wing: 2, tail: 2 },
    { body: 9, front: 34, back: 26, wing: 2, tail: 2 },
    { body: 10, front: 35, back: 26, wing: 2, tail: 2 },
    { body: 11, front: 36, back: 26, wing: 1, tail: 2 },
    { body: 12, front: 37, back: 26, wing: 1, tail: 2 },
    { body: 13, front: 38, back: 26, wing: 0, tail: 2 },
    { body: 14, front: 38, back: 26, wing: 0, tail: 2 },
    { body: 15, front: 38, back: 26, wing: 0, tail: 2 },
];
const waistFrames = [
    ...bodyFrames,
    { body: 1, front: 1, back: 1, wing: 3, tail: 0 },
];
const wingFrames = [
    { body: 1, front: 1, back: 1, wing: 0, tail: 0 },
    { body: 6, front: 33, back: 24, wing: 1, tail: 0 },
    { body: 9, front: 34, back: 26, wing: 2, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 3, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 4, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 5, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 6, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 7, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 8, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 9, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 10, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 11, tail: 0 },
    { body: 1, front: 1, back: 1, wing: 12, tail: 0 },
];
const exampleCM = [
    colors_1.BLUE, colors_1.BLUE, colors_1.BLUE, colors_1.BLUE, colors_1.BLUE,
    colors_1.BLUE, colors_1.CYAN, colors_1.CYAN, colors_1.CYAN, colors_1.BLUE,
    colors_1.BLUE, colors_1.CYAN, colors_1.CYAN, colors_1.CYAN, colors_1.BLUE,
    colors_1.BLUE, colors_1.CYAN, colors_1.CYAN, colors_1.CYAN, colors_1.BLUE,
    colors_1.BLUE, colors_1.BLUE, colors_1.BLUE, colors_1.BLUE, colors_1.BLUE,
];
const frontLegsCount = 39;
const backLegsCount = 27;
const frontLegsSheet = {
    width: 55,
    height: 60,
    offset: 50,
    state: state(frontLegsCount, (0, lodash_1.range)(0, frontLegsCount)),
};
const backLegsSheet = {
    width: 55,
    height: 60,
    offset: 55,
    state: state(backLegsCount, undefined, undefined, (0, lodash_1.range)(0, backLegsCount)),
};
const bodySheet = {
    width: 60,
    height: 60,
    offset: 50,
    state: stateFromFrames(bodyFrames),
};
const chestSheet = {
    width: 60,
    height: 60,
    offset: 60,
    state: stateFromFrames(bodyFrames),
};
const waistSheet = {
    ...chestSheet,
    state: stateFromFrames(waistFrames),
};
const singleFrameSheet = {
    ...bodySheet,
    state: stateFromFrames(headFrames),
};
const headSheet = {
    width: 60,
    height: 75,
    offset: 60,
    offsetY: 20,
    state: stateFromFrames(headFrames),
};
const bodyLayer = {
    name: '<body>', body: true, head: true, frontLeg: true, backLeg: true, frontFarLeg: true, backFarLeg: true,
};
const muzzleLayer = { name: '<muzzle>', setup: pony => pony.nose = defaultSet() };
const frontLegLayer = { name: '<front leg>', frontLeg: true, setup: pony => pony.coatFill = exports.SPECIAL_COLOR };
const backLegLayer = { name: '<back leg>', backLeg: true, setup: pony => pony.coatFill = exports.SPECIAL_COLOR };
exports.sheets = [
    // front legs
    {
        ...frontLegsSheet,
        name: 'front legs',
        file: 'front-legs',
        frame: (_pony, state, _options, _x, y) => {
            if (y > 0) {
                state.animation.frames.forEach(f => f.frontLeg = 0);
            }
        },
        layers: [
            { ...bodyLayer, frontLeg: false },
            {
                name: 'front', set: 'frontLegs', frontLeg: true,
                frame: (pony, _state, _options, _x, _y, pattern) => {
                    pony.coatFill = pattern === 0 ? colors_1.RED : colors_1.WHITE;
                    pony.coatOutline = pattern === 0 ? colors_1.RED : colors_1.WHITE;
                },
            },
        ],
    },
    {
        ...frontLegsSheet,
        name: 'front legs - hooves',
        file: 'front-legs-hooves',
        fieldName: 'frontHooves',
        layers: [
            { ...bodyLayer, frontLeg: false },
            frontLegLayer,
            {
                name: 'front', set: 'frontLegHooves', frontLeg: true, options: { useAllHooves: true },
                setup: pony => pony.coatFill = colors_1.BLACK
            },
        ],
    },
    {
        ...frontLegsSheet,
        name: 'front legs - socks',
        file: 'front-legs-accessories',
        fieldName: 'frontLegAccessory',
        layers: [
            { ...bodyLayer, frontLeg: false },
            frontLegLayer,
            { name: 'front', set: 'frontLegAccessories', frontLeg: true, setup: pony => pony.coatFill = colors_1.BLACK },
        ],
    },
    {
        ...frontLegsSheet,
        name: 'front legs - sleeves',
        file: 'front-legs-sleeves',
        fieldName: 'sleeveAccessory',
        layers: [
            { ...bodyLayer, frontLeg: false },
            frontLegLayer,
            {
                name: 'front', set: 'frontLegSleeves', frontLeg: true, options: { no: 2097152 /* NoDraw.FarSleeves */ }, setup: pony => {
                    pony.chestAccessory = ignoreSet(2);
                    pony.coatFill = colors_1.BLACK;
                }
            },
        ],
    },
    // back legs
    {
        ...backLegsSheet,
        alert: 'Does not export mask layer',
        name: 'back legs',
        file: 'back-legs',
        masks: [
            {
                name: 'backLegs2',
                layerName: 'front',
                mask: 'mask',
            },
        ],
        frame: (_pony, state, _options, _x, y) => {
            if (y > 0) {
                state.animation.frames.forEach(f => f.backLeg = 0);
            }
        },
        layers: [
            // TODO: mask layer
            { ...bodyLayer, backLeg: false },
            {
                name: 'front', set: 'backLegs', backLeg: true,
                frame: (pony, _state, _options, _x, _y, pattern) => {
                    pony.coatFill = pattern === 0 ? colors_1.RED : colors_1.WHITE;
                    pony.coatOutline = pattern === 0 ? colors_1.RED : colors_1.WHITE;
                },
            },
        ],
    },
    {
        ...backLegsSheet,
        name: 'back legs - hooves',
        file: 'back-legs-hooves',
        fieldName: 'backHooves',
        masks: [
            {
                name: 'backLegHooves2',
                layerName: 'front',
                mask: 'mask',
                maskFile: 'back-legs',
            },
        ],
        layers: [
            { ...bodyLayer, backLeg: false },
            backLegLayer,
            { name: 'front', set: 'backLegHooves', backLeg: true, setup: pony => pony.coatFill = colors_1.BLACK },
        ],
    },
    {
        ...backLegsSheet,
        name: 'back legs - socks',
        file: 'back-legs-accessories',
        fieldName: 'backLegAccessory',
        masks: [
            {
                name: 'backLegAccessories2',
                layerName: 'front',
                mask: 'mask',
                maskFile: 'back-legs',
            },
        ],
        layers: [
            { ...bodyLayer, backLeg: false },
            backLegLayer,
            { name: 'front', set: 'backLegAccessories', backLeg: true, setup: pony => pony.coatFill = colors_1.BLACK },
        ],
    },
    {
        ...backLegsSheet,
        name: 'back legs - sleeves',
        file: 'back-legs-sleeves',
        fieldName: 'backAccessory',
        rows: 2,
        masks: [
            {
                name: 'backLegSleeves2',
                layerName: 'front',
                mask: 'mask',
                maskFile: 'back-legs',
            },
        ],
        layers: [
            { ...bodyLayer, backLeg: false },
            backLegLayer,
            {
                name: 'front', set: 'backLegSleeves', setOverride: 'backAccessories', patterns: 2,
                options: { no: 65536 /* NoDraw.BackAccessory */ | 2097152 /* NoDraw.FarSleeves */ },
                setup: pony => pony.coatFill = colors_1.BLACK,
                frameSet: (set, _x, y, pattern) => {
                    set.type = y === 0 ? 5 : -1;
                    set.pattern = pattern;
                },
            },
        ],
    },
    {
        ...bodySheet,
        name: 'body',
        file: 'body',
        // fieldName: 'body', // TODO: uncomment when body set is added
        frame: (_pony, _state, options, _x, y) => {
            // fix for missing body set
            if (y > 0) {
                options.no = (0, utils_1.setFlag)(options.no, 64 /* NoDraw.BodyOnly */, true);
            }
        },
        layers: [
            { name: '<far legs>', frontFarLeg: true, backFarLeg: true },
            {
                name: 'body', body: true, set: 'body',
                frame: (pony, _state, _options, _x, _y, pattern) => {
                    pony.coatFill = pattern === 0 ? colors_1.RED : colors_1.WHITE;
                    pony.coatOutline = pattern === 0 ? colors_1.RED : colors_1.WHITE;
                },
            },
            { name: '<front leg>', frontLeg: true },
            { name: '<back leg>', backLeg: true },
            { name: '<head>', head: true },
        ],
    },
    {
        name: 'body - wings',
        file: 'body-wings',
        fieldName: 'wings',
        width: 80,
        height: 70,
        offset: 70,
        offsetY: 10,
        state: stateFromFrames(wingFrames),
        layers: [
            bodyLayer,
            { name: 'front', set: 'wings', options: { no: 16 /* NoDraw.Behind */ } },
        ],
        importOffsets: [1, 6, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(i => offsets.wingOffsets[i]),
    },
    {
        name: 'body - tails',
        file: 'tails',
        fieldName: 'tail',
        width: 80,
        height: 70,
        offset: 70,
        padLeft: 20,
        state: stateFromFrames([1, 5, 9].map(i => bodyFrames[i])),
        layers: [
            { name: 'behind-body', set: 'tails' },
            bodyLayer,
        ],
        importOffsets: [1, 5, 9].map(i => offsets.tailOffsets[i]),
    },
    {
        ...bodySheet,
        name: 'body - neck accessory',
        file: 'neck-accessory',
        fieldName: 'neckAccessory',
        layers: [
            { ...bodyLayer, head: false },
            { name: 'front', set: 'neckAccessories' },
            { name: '<head>', head: true },
        ],
        importOffsets: offsets.neckAccessoryOffsets,
    },
    {
        ...bodySheet,
        name: 'body - chest accessory',
        file: 'body-chest-accessory',
        fieldName: 'chestAccessory',
        layers: [
            { name: 'behind', set: 'chestAccessoriesBehind', options: { no: 1 /* NoDraw.Front */ } },
            bodyLayer,
            { name: 'front', set: 'chestAccessories', options: { no: 16 /* NoDraw.Behind */ } },
            frontLegLayer,
        ],
        importOffsets: offsets.chestAccessoryOffsets,
    },
    {
        ...chestSheet,
        name: 'body - back accessory',
        file: 'body-back-accessory',
        fieldName: 'backAccessory',
        // masks: [
        // 	{ name: 'backAccessories1', layerName: 'front', mask: 'mask' },
        // 	{ name: 'backAccessories2', layerName: 'front', mask: 'mask', reverse: true },
        // ],
        layers: [
            bodyLayer,
            { name: 'front', set: 'backAccessories', options: { no: 6291456 /* NoDraw.Sleeves */ } },
        ],
        importOffsets: offsets.backAccessoryOffsets,
    },
    {
        ...waistSheet,
        name: 'body - waist accessory',
        file: 'body-waist-accessory',
        fieldName: 'waistAccessory',
        layers: [
            bodyLayer,
            { name: 'front', set: 'waistAccessories' },
            {
                name: '<wing>', options: { no: 16 /* NoDraw.Behind */ }, frame: (pony, _state, _options, x) => {
                    pony.wings = x === 16 ? specialSet(1) : ignoreSet();
                },
            },
        ],
        importOffsets: offsets.waistAccessoryOffsets,
    },
    // head
    {
        ...headSheet,
        name: 'head',
        file: 'head',
        fieldName: 'head',
        state: stateFromFrames((0, lodash_1.times)(2, i => ({ body: 1, front: 1, back: 1, wing: 0, head: i, tail: 0 }))),
        layers: [
            { ...bodyLayer, options: { no: 16384 /* NoDraw.Head */ | 32768 /* NoDraw.Eyes */ | 256 /* NoDraw.CloseEar */ | 8192 /* NoDraw.Nose */ } },
            { name: 'front', set: 'head', head: true, drawBlack: false, options: { no: 384 /* NoDraw.Ears */ | 8192 /* NoDraw.Nose */ | 32768 /* NoDraw.Eyes */ } },
            { name: '<face>', head: true, options: { no: 16384 /* NoDraw.Head */ | 128 /* NoDraw.FarEar */ } },
        ],
    },
    {
        ...singleFrameSheet,
        name: 'head - ears',
        file: 'ears',
        fieldName: 'ears',
        single: true,
        wrap: 8,
        paletteOffsetY: 30,
        layers: [
            {
                name: 'behind', set: 'earsFar', head: true, noFace: true, drawBlack: false,
                options: { no: 256 /* NoDraw.CloseEar */ | 8388608 /* NoDraw.FarEarShade */ }
            },
            { ...bodyLayer, options: { no: 384 /* NoDraw.Ears */ } },
            {
                name: 'front', set: 'ears', head: true, noFace: true, drawBlack: false,
                options: { no: 128 /* NoDraw.FarEar */ },
                // importMirrored: { fieldName: 'ears2', offsetX: 0 },
            },
        ],
        // TODO: add <hair> layer(s)
    },
    {
        ...headSheet,
        name: 'head - horns',
        file: 'horns',
        fieldName: 'horn',
        single: true,
        wrap: 8,
        layers: [
            { name: '<far ear>', head: true, noFace: true, drawBlack: false, options: { no: 256 /* NoDraw.CloseEar */ } },
            { name: 'behind', set: 'hornsBehind', options: { no: 1 /* NoDraw.Front */ } },
            { ...bodyLayer, options: { no: 384 /* NoDraw.Ears */ } },
            {
                ...bodyLayer, name: '<body with mane>', options: { no: 384 /* NoDraw.Ears */ | 4096 /* NoDraw.FrontMane */ },
                setup: pony => {
                    pony.mane = specialSet(1);
                    pony.backMane = specialSet(1);
                }
            },
            { name: 'front', set: 'horns', options: { no: 16 /* NoDraw.Behind */ } },
            { name: '<ear>', head: true, noFace: true, drawBlack: false, options: { no: 128 /* NoDraw.FarEar */ } },
            {
                name: '<front mane>', head: true, noFace: true, drawBlack: false,
                options: { no: 384 /* NoDraw.Ears */ | 16 /* NoDraw.Behind */ | 2048 /* NoDraw.TopMane */ },
                setup: pony => pony.mane = specialSet(1),
            },
        ],
    },
    {
        ...headSheet,
        name: 'head - manes',
        file: 'manes',
        fieldName: 'mane',
        groups: [
            ['frontManes', 'topManes', 'behindManes'],
            ['backFrontManes', 'backBehindManes'],
        ],
        setsWithEmpties: ['backFrontManes', 'backBehindManes'],
        empties: [3, 10, 13],
        single: true,
        wrap: 8,
        layers: [
            { name: 'behind', set: 'behindManes', options: { no: 4096 /* NoDraw.FrontMane */ | 2048 /* NoDraw.TopMane */ } },
            { name: 'back-behind', set: 'backBehindManes', fieldName: 'backMane', options: { no: 4096 /* NoDraw.FrontMane */ } },
            { ...bodyLayer, options: { no: 256 /* NoDraw.CloseEar */ } },
            { name: 'back', set: 'backFrontManes', fieldName: 'backMane', options: { no: 16 /* NoDraw.Behind */ } },
            { name: 'top', set: 'topManes', options: { no: 4096 /* NoDraw.FrontMane */ | 16 /* NoDraw.Behind */ } },
            { name: '<horn>', setup: pony => pony.horn = specialSet(1) },
            { name: '<ear>', head: true, noFace: true, drawBlack: false, options: { no: 128 /* NoDraw.FarEar */ } },
            { name: 'front', set: 'frontManes', options: { no: 2048 /* NoDraw.TopMane */ | 16 /* NoDraw.Behind */ } },
        ],
    },
    {
        ...singleFrameSheet,
        name: 'head - facial hair',
        file: 'facial-hair',
        fieldName: 'facialHair',
        single: true,
        wrap: 8,
        paletteOffsetY: 35,
        layers: [
            { ...bodyLayer, options: { no: 8192 /* NoDraw.Nose */ } },
            { name: 'front', set: 'facialHairBehind' },
            muzzleLayer,
            { name: 'front-2', set: 'facialHair' },
        ],
    },
    {
        ...singleFrameSheet,
        name: 'head - ear accessory',
        file: 'ear-accessory',
        fieldName: 'earAccessory',
        single: true,
        wrap: 8,
        layers: [
            { name: 'behind', set: 'earAccessoriesBehind', options: { no: 1 /* NoDraw.Front */ } },
            { ...bodyLayer },
            { name: 'front', set: 'earAccessories', options: { no: 16 /* NoDraw.Behind */ } },
        ],
    },
    {
        ...headSheet,
        name: 'head - head accessory',
        file: 'head-accessory',
        fieldName: 'headAccessory',
        single: true,
        wrap: 8,
        layers: [
            { name: '<far ear>', head: true, noFace: true, drawBlack: false, options: { no: 256 /* NoDraw.CloseEar */ } },
            { name: 'behind', set: 'headAccessoriesBehind' },
            { ...bodyLayer, options: { no: 128 /* NoDraw.FarEar */ } },
            {
                ...bodyLayer, name: '<body with mane>', shiftY: 5, options: { no: 128 /* NoDraw.FarEar */ }, setup: pony => {
                    pony.mane = specialSet(1);
                    pony.backMane = specialSet(1);
                }
            },
            { name: 'front', set: 'headAccessories' },
        ],
    },
    {
        ...headSheet,
        name: 'head - face accessory',
        file: 'face-accessory',
        fieldName: 'faceAccessory',
        single: true,
        extra: true,
        wrap: 8,
        layers: [
            { ...bodyLayer, options: { no: 256 /* NoDraw.CloseEar */ } },
            { name: 'front', set: 'faceAccessories', extra: 'faceAccessory', options: { no: 1024 /* NoDraw.FaceAccessory2 */ } },
            { name: '<ear>', head: true, noFace: true, drawBlack: false, options: { no: 128 /* NoDraw.FarEar */ } },
            { name: 'front-2', set: 'faceAccessories2', options: { no: 512 /* NoDraw.FaceAccessory1 */ } },
            muzzleLayer,
            { name: '<horn>', setup: pony => pony.horn = specialSet(1) },
        ],
    },
    {
        ...headSheet,
        name: 'head - extra accessory',
        file: 'extra-accessory',
        fieldName: 'extraAccessory',
        single: true,
        wrap: 8,
        paletteOffsetY: 45,
        layers: [
            {
                name: 'behind', set: 'extraAccessoriesBehind', options: { extra: true, no: 1 /* NoDraw.Front */ },
                setup: pony => pony.mane = ignoreSet(1)
            },
            {
                ...bodyLayer, setup: pony => {
                    pony.mane = specialSet(1);
                    pony.backMane = specialSet(1);
                }
            },
            {
                name: 'front', set: 'extraAccessories', options: { extra: true, no: 16 /* NoDraw.Behind */ },
                setup: pony => pony.mane = ignoreSet(1)
            },
        ],
    },
    {
        spacer: true,
    },
    // offsets
    {
        ...bodySheet,
        name: 'offset - front legs',
        offsets: offsets.frontLegOffsets,
        state: stateFromFrames(bodyFrames.map(f => ({ ...f, front: 1 }))),
        layers: [bodyLayer],
    },
    {
        ...bodySheet,
        name: 'offset - back legs',
        offsets: offsets.backLegOffsets,
        state: stateFromFrames(bodyFrames.map(f => ({ ...f, back: 1 }))),
        layers: [bodyLayer],
    },
    {
        ...bodySheet,
        name: 'offset - wings',
        fieldName: 'wings',
        offsets: offsets.wingOffsets,
        layers: [
            bodyLayer,
            { name: 'front', set: 'wings', options: { no: 16 /* NoDraw.Behind */ } },
        ],
        duplicateFirstFrame: bodyFrames.length,
    },
    {
        width: 80,
        height: 70,
        offset: 70,
        state: stateFromFrames(bodyFrames),
        name: 'offset - tails',
        fieldName: 'tail',
        offsets: offsets.tailOffsets,
        layers: [
            { name: 'behindBody', set: 'tails' },
            bodyLayer,
        ],
        duplicateFirstFrame: bodyFrames.length,
    },
    {
        ...bodySheet,
        name: 'offset - head',
        offsets: offsets.headOffsets,
        layers: [bodyLayer],
    },
    {
        ...bodySheet,
        name: 'offset - cm',
        offsets: offsets.cmOffsets,
        layers: [
            { ...bodyLayer, setup: pony => pony.cm = exampleCM },
        ],
    },
    {
        ...bodySheet,
        name: 'offset - neck accessory',
        fieldName: 'neckAccessory',
        offsets: offsets.neckAccessoryOffsets,
        layers: [
            { ...bodyLayer, head: false },
            { name: 'front', set: 'neckAccessories' },
            { name: '<head>', head: true },
        ],
        importOffsets: offsets.neckAccessoryOffsets,
    },
    {
        ...bodySheet,
        name: 'offset - chest accessory',
        fieldName: 'chestAccessory',
        offsets: offsets.chestAccessoryOffsets,
        layers: [
            { name: 'behind', set: 'chestAccessoriesBehind', options: { no: 1 /* NoDraw.Front */ } },
            bodyLayer,
            { name: 'front', set: 'chestAccessories', options: { no: 16 /* NoDraw.Behind */ } },
        ],
    },
    {
        ...waistSheet,
        name: 'offset - waist accessory',
        fieldName: 'waistAccessory',
        offsets: offsets.waistAccessoryOffsets,
        layers: [
            bodyLayer,
            { name: 'front', set: 'waistAccessories' },
            {
                name: '<wing>', options: { no: 16 /* NoDraw.Behind */ }, frame: (pony, _state, _options, x) => {
                    pony.wings = x === 16 ? specialSet(1) : ignoreSet();
                },
            },
        ],
    },
    {
        ...chestSheet,
        name: 'offset - back accessory',
        fieldName: 'backAccessory',
        offsets: offsets.backAccessoryOffsets,
        layers: [
            { name: '<tail>', setup: pony => pony.tail = specialSet(2) },
            bodyLayer,
            { name: 'front', set: 'backAccessories' },
        ],
    },
    {
        width: 55,
        height: 40,
        offset: 55,
        offsetY: 10,
        state: stateFromFrames((0, utils_1.repeat)(offsets.HEAD_ACCESSORY_OFFSETS.length, bodyFrames[1])),
        name: 'offset - hats',
        rows: 19,
        offsets: offsets.HEAD_ACCESSORY_OFFSETS,
        layers: [
            {
                ...bodyLayer,
                frame: (pony, _state, _options, x, y) => {
                    pony.mane = specialSet(x);
                    // pony.backMane = specialSet(x === 0 ? 0 : 1);
                    pony.headAccessory = whiteSet(y + 1);
                },
            },
        ],
    },
    {
        width: 55,
        height: 40,
        offset: 55,
        offsetY: 10,
        state: stateFromFrames((0, utils_1.repeat)(offsets.EAR_ACCESSORY_OFFSETS.length, bodyFrames[1])),
        name: 'offset - earrings',
        rows: 13,
        offsets: offsets.EAR_ACCESSORY_OFFSETS,
        layers: [
            {
                ...bodyLayer,
                frame: (pony, _state, _options, x, y) => {
                    pony.ears = defaultSet(x);
                    pony.earAccessory = whiteSet(y + 1);
                },
            },
        ],
    },
    {
        width: 55,
        height: 40,
        offset: 55,
        offsetY: 10,
        state: stateFromFrames((0, utils_1.repeat)(offsets.EXTRA_ACCESSORY_OFFSETS.length, bodyFrames[1])),
        name: 'offset - extra',
        rows: 17,
        offsets: offsets.EXTRA_ACCESSORY_OFFSETS,
        layers: [
            {
                ...bodyLayer,
                frame: (pony, _state, options, x, y) => {
                    pony.mane = specialSet(x);
                    pony.extraAccessory = createSet(y + 1, colors_1.WHITE, 7);
                    options.extra = true;
                },
            },
        ],
    },
];
function stateFromFrames(frames) {
    const front = frames.map(f => f.front);
    const back = frames.map(f => f.back);
    const body = frames.map(f => f.body);
    const wing = frames.map(f => f.wing);
    const tail = frames.map(f => f.tail);
    return state(frames.length, front, front, back, back, undefined, body, wing, tail);
}
function state(frames, frontLegs, frontFarLegs, backLegs, backFarLegs, head, body, wing, tail) {
    const state = (0, ponyHelpers_1.defaultPonyState)();
    state.blushColor = 0;
    state.animation = {};
    const ones = (0, lodash_1.times)(frames, () => 1);
    const zeros = (0, lodash_1.times)(frames, () => 0);
    state.animation = {
        name: '',
        loop: false,
        fps: 24,
        frames: (0, lodash_1.times)(frames, i => ({
            ...(0, ponyAnimations_1.createBodyFrame)([]),
            head: (head || ones)[i],
            body: (body || ones)[i],
            wing: (wing && wing[i]) || 0,
            tail: (tail || zeros)[i],
            frontLeg: (frontLegs || ones)[i],
            frontFarLeg: (frontFarLegs || ones)[i],
            backLeg: (backLegs || ones)[i],
            backFarLeg: (backFarLegs || ones)[i],
        })),
    };
    return state;
}
function ignoreSet(type = 0) {
    return createSet(type, colors_1.BLACK);
}
function defaultSet(type = 0) {
    return createSet(type, exports.DEFAULT_COLOR);
}
function specialSet(type = 0) {
    return createSet(type, exports.SPECIAL_COLOR);
}
function whiteSet(type = 0) {
    return createSet(type, colors_1.WHITE);
}
function createSet(type, color, count = 2) {
    return {
        type,
        fills: (0, lodash_1.times)(count, () => color),
        lockFills: (0, lodash_1.times)(count, () => false),
        outlines: (0, lodash_1.times)(count, () => color),
        lockOutlines: (0, lodash_1.times)(count, () => true),
    };
}
//# sourceMappingURL=sheets.js.map