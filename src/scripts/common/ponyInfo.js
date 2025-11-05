"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToPaletteSet = exports.getColorsForSetNumber = exports.getColorsForSet = exports.mockPaletteManager = void 0;
exports.spriteSet = spriteSet;
exports.createDefaultPony = createDefaultPony;
exports.createBasePony = createBasePony;
exports.getBaseFill = getBaseFill;
exports.getBaseOutline = getBaseOutline;
exports.syncLockedSpriteSet = syncLockedSpriteSet;
exports.syncLockedPonyInfo = syncLockedPonyInfo;
exports.syncLockedPonyInfoNumber = syncLockedPonyInfoNumber;
exports.toColorList = toColorList;
exports.darkenForOutline = darkenForOutline;
exports.getColorsFromSet = getColorsFromSet;
exports.toColorListNumber = toColorListNumber;
exports.toPaletteSet = toPaletteSet;
exports.toPaletteGeneric = toPaletteGeneric;
exports.toPalette = toPalette;
exports.toPaletteNumber = toPaletteNumber;
exports.releasePalettes = releasePalettes;
const tslib_1 = require("tslib");
const sprites = tslib_1.__importStar(require("../generated/sprites"));
const paletteManager_1 = require("../graphics/paletteManager");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const color_1 = require("./color");
const colors_1 = require("./colors");
const ponyUtils_1 = require("../client/ponyUtils");
const MAX_COLORS = 6;
const FILLS = ['1e90ff', '32cd32', 'da70d6', 'dc143c', '7fffd4'];
const frontHooves = sprites.frontLegHooves[1];
const backHooves = sprites.backLegHooves[1];
const frontLegAccessories = sprites.frontLegAccessories[1];
const backLegAccessories = sprites.backLegAccessories[1];
const frontLegSleeves = sprites.frontLegSleeves[1];
exports.mockPaletteManager = {
    add(colors) {
        return this.addArray(new Uint32Array(colors));
    },
    addArray(colors) {
        return (0, paletteManager_1.createPalette)(colors);
    },
    init() {
    }
};
function spriteSet(type, lockFirstFill = true, fill = 'ffd700', otherFills = FILLS) {
    if (otherFills.length !== (MAX_COLORS - 1))
        throw new Error('Invalid fills count');
    const fills = [fill, ...otherFills];
    const outlines = fills.map(colors_1.fillToOutline);
    return {
        type,
        pattern: 0,
        fills,
        outlines,
        lockFills: [lockFirstFill, ...(0, utils_1.array)(MAX_COLORS - 1, false)],
        lockOutlines: (0, utils_1.array)(MAX_COLORS, true),
    };
}
function createDefaultPony() {
    const pony = createBasePony();
    pony.mane.type = 2;
    pony.backMane.type = 1;
    pony.tail.type = 1;
    return pony;
}
function createBasePony() {
    return syncLockedPonyInfo({
        head: spriteSet(0, true, 'ff0000', ['800000', '32cd32', 'da70d6', 'dc143c', '7fffd4']),
        nose: spriteSet(0, true, 'ff0000', ['800000', '32cd32', 'da70d6', 'dc143c', '7fffd4']),
        ears: spriteSet(0, true, 'ff0000'),
        horn: spriteSet(0, true, 'ff0000'),
        wings: spriteSet(0, true, 'ff0000'),
        frontHooves: spriteSet(0, false, 'ffa500', ['ffff00', '32cd32', 'da70d6', 'dc143c', '7fffd4']),
        backHooves: spriteSet(0, true, 'ffa500'),
        mane: spriteSet(0, false),
        backMane: spriteSet(0),
        tail: spriteSet(0),
        facialHair: spriteSet(0),
        headAccessory: spriteSet(0, false, 'ee82ee'),
        earAccessory: spriteSet(0, false, '808080'),
        faceAccessory: spriteSet(0, false, '000000'),
        neckAccessory: spriteSet(0, false, 'ee82ee'),
        frontLegAccessory: spriteSet(0, false, 'ee82ee'),
        backLegAccessory: spriteSet(0, false, 'ee82ee'),
        frontLegAccessoryRight: spriteSet(0, false, 'ee82ee'),
        backLegAccessoryRight: spriteSet(0, false, 'ee82ee'),
        lockBackLegAccessory: true,
        unlockFrontLegAccessory: false,
        unlockBackLegAccessory: false,
        backAccessory: spriteSet(0, false, 'ee82ee'),
        waistAccessory: spriteSet(0, false, '95856f', ['674b43', '4f4f4f', '525252', 'c37850', '8a3d34']),
        chestAccessory: spriteSet(0, false, 'ee82ee'),
        sleeveAccessory: spriteSet(0, true, 'ee82ee'),
        extraAccessory: {
            ...spriteSet(0, true, 'ff0000', ['daa520', 'ffd700', 'ffd700', 'ffd700', 'ffd700']),
            lockFills: (0, utils_1.array)(5, true),
        },
        coatFill: 'ff0000',
        coatOutline: '8b0000',
        lockCoatOutline: true,
        eyelashes: 0,
        eyeColorLeft: 'daa520',
        eyeColorRight: 'daa520',
        eyeWhitesLeft: 'ffffff',
        eyeWhites: 'ffffff',
        eyeOpennessLeft: 1,
        eyeOpennessRight: 1,
        eyeshadow: false,
        eyeshadowColor: '000000',
        lockEyes: true,
        lockEyeColor: true,
        unlockEyeWhites: false,
        unlockEyelashColor: false,
        eyelashColor: '000000',
        eyelashColorLeft: '000000',
        fangs: 0,
        muzzle: 0,
        freckles: 0,
        frecklesColor: '8b0000',
        magicColor: 'ffffff',
        cm: [],
        cmFlip: false,
        customOutlines: false,
        freeOutlines: false,
        darkenLockedOutlines: false,
    });
}
function getBaseFill(set) {
    return set && set.fills && set.fills[0];
}
function getBaseOutline(set) {
    return set && set.outlines && set.outlines[0];
}
function syncLockedSpriteSet(set, customOutlines, fillToOutline, baseFill, baseOutline) {
    if (set === undefined)
        return;
    const fills = set.fills;
    if (!fills)
        return;
    const lockFills = set.lockFills;
    if (lockFills) {
        for (let i = 0; i < lockFills.length; i++) {
            if (lockFills[i]) {
                fills[i] = i === 0 ? baseFill : fills[0];
            }
        }
    }
    const outlines = set.outlines;
    const lockOutlines = set.lockOutlines;
    if (outlines && lockOutlines) {
        for (let i = 0; i < lockOutlines.length; i++) {
            if (!customOutlines) {
                lockOutlines[i] = true;
            }
            if (lockOutlines[i]) {
                if (i === 0 && baseOutline && lockFills && lockFills[i]) {
                    outlines[i] = baseOutline;
                }
                else {
                    outlines[i] = fillToOutline(fills[i]);
                }
            }
        }
    }
}
function syncLockedSpritesSet2(set, fillToOutline, baseFills, baseOutlines) {
    if (set && set.fills && set.lockFills) {
        set.lockFills.forEach((locked, i) => {
            if (locked) {
                set.fills[i] = baseFills[i];
            }
        });
    }
    if (set && set.fills && set.outlines && set.lockOutlines) {
        set.lockOutlines.forEach((locked, i) => {
            if (locked) {
                if (baseOutlines[i] && set.lockFills && set.lockFills[i]) {
                    set.outlines[i] = baseOutlines[i];
                }
                else {
                    set.outlines[i] = fillToOutline(set.fills[i]);
                }
            }
        });
    }
}
function getFillOf2(set, defaultColor) {
    return set && set.type && set.fills && set.fills[0] || defaultColor;
}
function getOutlineOf2(set, defaultColor) {
    return set && set.type && set.outlines && set.outlines[0] || defaultColor;
}
function syncLockedBasePonyInfo(info, fillToOutline, defaultColor) {
    const customOutlines = !!info.customOutlines;
    if (!customOutlines || info.lockCoatOutline) {
        info.coatOutline = fillToOutline(info.coatFill);
    }
    if (info.lockEyes) {
        info.eyeOpennessLeft = info.eyeOpennessRight;
    }
    if (info.lockEyeColor) {
        info.eyeColorLeft = info.eyeColorRight;
    }
    if (!info.unlockEyeWhites) {
        info.eyeWhitesLeft = info.eyeWhites;
    }
    if (!info.unlockEyelashColor) {
        info.eyelashColorLeft = info.eyelashColor;
    }
    syncLockedSpriteSet(info.head, customOutlines, fillToOutline, info.coatFill, info.coatOutline);
    syncLockedSpriteSet(info.nose, customOutlines, fillToOutline, info.coatFill, info.coatOutline);
    syncLockedSpriteSet(info.ears, customOutlines, fillToOutline, info.coatFill, info.coatOutline);
    syncLockedSpriteSet(info.horn, customOutlines, fillToOutline, info.coatFill, info.coatOutline);
    syncLockedSpriteSet(info.wings, customOutlines, fillToOutline, info.coatFill, info.coatOutline);
    syncLockedSpriteSet(info.frontHooves, customOutlines, fillToOutline, info.coatFill, info.coatOutline);
    syncLockedSpriteSet(info.backHooves, customOutlines, fillToOutline, getBaseFill(info.frontHooves), getBaseOutline(info.frontHooves));
    syncLockedSpriteSet(info.mane, customOutlines, fillToOutline);
    const baseManeFill = getBaseFill(info.mane);
    const baseManeOutline = getBaseOutline(info.mane);
    syncLockedSpriteSet(info.backMane, customOutlines, fillToOutline, baseManeFill, baseManeOutline);
    syncLockedSpriteSet(info.tail, customOutlines, fillToOutline, baseManeFill, baseManeOutline);
    syncLockedSpriteSet(info.facialHair, customOutlines, fillToOutline, baseManeFill, baseManeOutline);
    syncLockedSpriteSet(info.headAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.earAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.faceAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.neckAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.frontLegAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.backLegAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.frontLegAccessoryRight, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.backLegAccessoryRight, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.backAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.waistAccessory, customOutlines, fillToOutline);
    syncLockedSpriteSet(info.chestAccessory, customOutlines, fillToOutline);
    if (info.chestAccessory && !info.sleeveAccessory && (0, utils_1.includes)(ponyUtils_1.SLEEVED_ACCESSORIES, info.chestAccessory.type)) {
        info.sleeveAccessory = {
            type: 0,
            pattern: 0,
            fills: [],
            outlines: [],
            lockFills: (0, utils_1.array)(MAX_COLORS, true),
            lockOutlines: (0, utils_1.array)(MAX_COLORS, true),
        };
    }
    syncLockedSpriteSet(info.sleeveAccessory, customOutlines, fillToOutline, getBaseFill(info.chestAccessory), getBaseOutline(info.chestAccessory));
    syncLockedSpritesSet2(info.extraAccessory, fillToOutline, [
        info.coatFill,
        info.eyeColorRight,
        getFillOf2(info.mane, defaultColor),
        getFillOf2(info.backMane, defaultColor),
        getFillOf2(info.tail, defaultColor),
    ], [
        info.coatOutline,
        info.eyeColorRight,
        getOutlineOf2(info.mane, defaultColor),
        getOutlineOf2(info.backMane, defaultColor),
        getOutlineOf2(info.tail, defaultColor),
    ]);
    return info;
}
function syncLockedPonyInfo(info) {
    const darkenLocked = !!info.freeOutlines && !!info.darkenLockedOutlines;
    const fillToOutlineFunc = darkenLocked ? colors_1.fillToOutlineWithDarken : colors_1.fillToOutline;
    return syncLockedBasePonyInfo(info, fillToOutlineFunc, '000000');
}
function fillToOutlineSafe(color) {
    return (0, colors_1.fillToOutlineColor)((color === undefined || color === 0) ? colors_1.BLACK : color);
}
function fillToOutlineSafeWithDarken(color) {
    return darkenForOutline((0, colors_1.fillToOutlineColor)((color === undefined || color === 0) ? colors_1.BLACK : color));
}
function syncLockedPonyInfoNumber(info) {
    const darkenLocked = !!info.freeOutlines && !!info.darkenLockedOutlines;
    const fillToOutlineFunc = darkenLocked ? fillToOutlineSafeWithDarken : fillToOutlineSafe;
    return syncLockedBasePonyInfo(info, fillToOutlineFunc, colors_1.BLACK);
}
// PalettePonyInfo
function parseFast(color) {
    return color ? (0, color_1.parseColorFast)(color) : colors_1.BLACK;
}
function parseCMColor(color) {
    return color ? (0, color_1.parseColorFast)(color) : colors_1.TRANSPARENT;
}
function toColorList(colors) {
    const result = new Uint32Array(colors.length + 1);
    for (let i = 0; i < colors.length; i++) {
        result[i + 1] = parseFast(colors[i]);
    }
    return result;
}
function darkenForOutline(color) {
    const mult = (159 / 255);
    const r = (mult * (0, color_1.getR)(color)) | 0;
    const g = (mult * (0, color_1.getG)(color)) | 0;
    const b = (mult * (0, color_1.getB)(color)) | 0;
    const a = (0, color_1.getAlpha)(color);
    return (0, color_1.colorFromRGBA)(r, g, b, a);
}
function getColorsGeneric(fillColors, outlineColors, defaultColor, length, darken) {
    const fills = fillColors || [];
    const outlines = outlineColors || [];
    const colors = (0, utils_1.array)(length * 2, defaultColor);
    for (let i = 0; i < length; i++) {
        colors[i * 2] = fills[i] || defaultColor;
        if (darken) {
            colors[i * 2 + 1] = outlines[i] ? (0, color_1.colorToHexRGB)(darkenForOutline((0, color_1.parseColorFast)(outlines[i]))) : defaultColor;
        }
        else {
            colors[i * 2 + 1] = outlines[i] || defaultColor;
        }
    }
    return colors;
}
function getColorsFromSet({ fills, outlines }, defaultColor, darken) {
    const length = Math.max(fills ? fills.length : 0, outlines ? outlines.length : 0);
    return getColorsGeneric(fills, outlines, defaultColor, length, darken);
}
function toColorListNumber(colors) {
    const result = new Uint32Array(colors.length + 1);
    for (let i = 0; i < colors.length; i++) {
        result[i + 1] = colors[i] || colors_1.BLACK;
    }
    return result;
}
const getColorsForSet = (set, count, darken) => {
    const t = getColorsGeneric(set.fills, set.outlines, '000000', count, darken);
    return toColorList(t);
};
exports.getColorsForSet = getColorsForSet;
const emptyArray = [];
const getColorsForSetNumber = (set, length, darken) => {
    const fills = set.fills || emptyArray;
    const outlines = set.outlines || emptyArray;
    const result = new Uint32Array(length * 2 + 1);
    for (let i = 0; i < length; i++) {
        result[((i << 1) + 1) | 0] = i < fills.length ? (fills[i] || colors_1.BLACK) : colors_1.BLACK;
        if (darken) {
            result[((i << 1) + 2) | 0] = i < outlines.length ? darkenForOutline(outlines[i] || colors_1.BLACK) : colors_1.BLACK;
        }
        else {
            result[((i << 1) + 2) | 0] = i < outlines.length ? (outlines[i] || colors_1.BLACK) : colors_1.BLACK;
        }
    }
    return result;
};
exports.getColorsForSetNumber = getColorsForSetNumber;
function getExtraPalette(pattern, manager) {
    const extraPalette = pattern && pattern.palettes && pattern.palettes[0];
    return extraPalette && manager.addArray(new Uint32Array(extraPalette));
}
function toPaletteSet(set, sets, manager, getColorsForSet, hasExtra, darken) {
    const pattern = (0, utils_1.att)((0, utils_1.att)(sets, set.type), set.pattern);
    const colorCount = pattern !== undefined && pattern.colors !== undefined ? ((pattern.colors - 1) >> 1) : 0;
    const colors = getColorsForSet(set, colorCount, darken);
    return {
        type: (0, utils_1.toInt)(set.type),
        pattern: (0, utils_1.toInt)(set.pattern),
        palette: manager.addArray(colors),
        extraPalette: hasExtra ? getExtraPalette(pattern, manager) : undefined,
    };
}
function createCMPalette(cm, manager, parseColor) {
    const size = constants_1.CM_SIZE * constants_1.CM_SIZE;
    if (cm === undefined || cm.length === 0 || cm.length > size)
        return undefined;
    const result = new Uint32Array(size);
    for (let i = 0; i < cm.length; i++) {
        result[i] = parseColor(cm[i]);
    }
    return manager.addArray(result);
}
const defaultPalette = new Uint32Array(sprites.defaultPalette);
const createToPaletteSet = (manager, getColorsForSet, extra, darken) => (set, sets) => set === undefined ? undefined : toPaletteSet(set, sets, manager, getColorsForSet, extra, darken);
exports.createToPaletteSet = createToPaletteSet;
function toPaletteGeneric(info, manager, toColorList, getColorsForSet, blackColor, whiteColor, parseCMColor) {
    const darken = !info.freeOutlines;
    const toSet = (0, exports.createToPaletteSet)(manager, getColorsForSet, false, darken);
    const toSetExtra = (0, exports.createToPaletteSet)(manager, getColorsForSet, true, darken);
    const defaultSet = { type: 0, pattern: 0, fills: [info.coatFill], outlines: [info.coatOutline] };
    // const defaultSet = { type: 0, pattern: 1, fills: [info.coatFill, whiteColor], outlines: [info.coatOutline, blackColor] };
    return {
        body: toSet(defaultSet, sprites.body[1]),
        head: toSet(info.head || defaultSet, sprites.head0[1]),
        nose: toSet(info.nose, sprites.noses[0]),
        ears: toSet(info.ears || defaultSet, sprites.ears),
        horn: toSet(info.horn, sprites.horns),
        wings: toSet(info.wings, sprites.wings[0]),
        frontLegs: toSet(defaultSet, sprites.frontLegs[1]),
        backLegs: toSet(defaultSet, sprites.backLegs[1]),
        frontHooves: toSet(info.frontHooves, frontHooves),
        backHooves: toSet(info.backHooves, backHooves),
        mane: toSet(info.mane, ponyUtils_1.mergedManes),
        backMane: toSet(info.backMane, ponyUtils_1.mergedBackManes),
        tail: toSet(info.tail, sprites.tails[0]),
        facialHair: toSet(info.facialHair, ponyUtils_1.mergedFacialHair),
        headAccessory: toSet(info.headAccessory, ponyUtils_1.mergedHeadAccessories),
        earAccessory: toSet(info.earAccessory, ponyUtils_1.mergedEarAccessories),
        faceAccessory: toSetExtra(info.faceAccessory, sprites.faceAccessories),
        // faceAccessoryExtraPalette: getExtraPartPalette(info.faceAccessory, sprites.faceAccessoriesExtra, manager),
        neckAccessory: toSet(info.neckAccessory, sprites.neckAccessories[1]),
        frontLegAccessory: toSet(info.frontLegAccessory, frontLegAccessories),
        backLegAccessory: toSet(info.lockBackLegAccessory ? info.frontLegAccessory : info.backLegAccessory, backLegAccessories),
        frontLegAccessoryRight: toSet(info.unlockFrontLegAccessory ? info.frontLegAccessoryRight : info.frontLegAccessory, frontLegAccessories),
        backLegAccessoryRight: toSet(info.lockBackLegAccessory ?
            (info.unlockFrontLegAccessory ? info.frontLegAccessoryRight : info.frontLegAccessory) :
            (info.unlockBackLegAccessory ? info.backLegAccessoryRight : info.backLegAccessory), backLegAccessories),
        lockBackLegAccessory: info.lockBackLegAccessory,
        unlockFrontLegAccessory: info.unlockFrontLegAccessory,
        unlockBackLegAccessory: info.unlockBackLegAccessory,
        backAccessory: toSet(info.backAccessory, ponyUtils_1.mergedBackAccessories),
        waistAccessory: toSet(info.waistAccessory, sprites.waistAccessories[1]),
        chestAccessory: toSet(info.chestAccessory, ponyUtils_1.mergedChestAccessories),
        sleeveAccessory: toSet(info.sleeveAccessory, frontLegSleeves),
        extraAccessory: toSet(info.extraAccessory, ponyUtils_1.mergedExtraAccessories),
        coatPalette: manager.addArray(toColorList([info.coatFill, info.coatOutline])),
        coatFill: undefined,
        coatOutline: undefined,
        lockCoatOutline: !!info.lockCoatOutline,
        eyelashes: (0, utils_1.toInt)(info.eyelashes),
        eyePaletteLeft: manager.addArray(toColorList([
            info.eyeWhitesLeft || whiteColor,
            info.eyelashColor || blackColor
        ])),
        eyePalette: manager.addArray(toColorList([
            info.eyeWhites || whiteColor,
            (info.unlockEyelashColor ? info.eyelashColorLeft : info.eyelashColor) || blackColor
        ])),
        eyeColorLeft: manager.addArray(toColorList([info.eyeColorLeft])),
        eyeColorRight: manager.addArray(toColorList([info.eyeColorRight])),
        eyeWhitesLeft: undefined,
        eyeWhites: undefined,
        eyeOpennessLeft: (0, utils_1.toInt)(info.eyeOpennessLeft),
        eyeOpennessRight: (0, utils_1.toInt)(info.eyeOpennessRight),
        eyeshadow: info.eyeshadow,
        eyeshadowColor: manager.addArray(toColorList([info.eyeshadowColor])),
        lockEyes: !!info.lockEyes,
        lockEyeColor: !!info.lockEyeColor,
        unlockEyeWhites: !!info.unlockEyeWhites,
        unlockEyelashColor: !!info.unlockEyelashColor,
        eyelashColor: undefined,
        eyelashColorLeft: undefined,
        fangs: (0, utils_1.toInt)(info.fangs),
        muzzle: (0, utils_1.toInt)(info.muzzle),
        freckles: 0, // remove
        frecklesColor: undefined, // TODO: remove
        magicColor: undefined,
        magicColorValue: typeof info.magicColor === 'string' ? (0, color_1.parseColorFast)(info.magicColor) : (0, utils_1.toInt)(info.magicColor),
        cm: undefined,
        cmFlip: !!info.cmFlip,
        cmPalette: createCMPalette(info.cm, manager, parseCMColor),
        customOutlines: !!info.customOutlines,
        freeOutlines: !!info.freeOutlines,
        darkenLockedOutlines: !!info.darkenLockedOutlines,
        defaultPalette: manager.addArray(defaultPalette),
        waterPalette: manager.addArray(sprites.pony_wake_1.palette),
    };
}
function toPalette(info, manager = exports.mockPaletteManager) {
    return toPaletteGeneric(info, manager, toColorList, exports.getColorsForSet, '000000', 'ffffff', parseCMColor);
}
function toPaletteNumber(info, manager = exports.mockPaletteManager) {
    return toPaletteGeneric(info, manager, toColorListNumber, exports.getColorsForSetNumber, colors_1.BLACK, colors_1.WHITE, x => x);
}
function releasePalettes(info) {
    for (const key of Object.keys(info)) {
        const value = info[key]; // undefined | number | string | PaletteSpriteSet | Palette;
        if (value && typeof value === 'object') {
            if ('refs' in value) {
                const palette = value;
                (0, paletteManager_1.releasePalette)(palette);
            }
            else if ('palette' in value) {
                const set = value;
                (0, paletteManager_1.releasePalette)(set.palette);
                (0, paletteManager_1.releasePalette)(set.extraPalette);
            }
        }
    }
}
//# sourceMappingURL=ponyInfo.js.map