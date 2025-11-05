"use strict";
/// <reference path="../../typings/my.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareLayers = exports.matcher = exports.time = exports.nameMatches = exports.getDirectories = exports.defaultPalette = exports.TEETH_SHADE_COLOR = exports.TEETH_COLOR = exports.TONGUE_COLOR = exports.MOUTH_COLOR = exports.DARK_GRAY = exports.TEAR_COLOR = exports.LIGHT_SHADE_COLOR = exports.SHADE_COLOR = exports.OUTLINE_COLOR = exports.WHITE = exports.BLACK = exports.TRANSPARENT = void 0;
exports.cartesian = cartesian;
exports.mkdir = mkdir;
exports.findLayer = findLayer;
exports.findLayerSafe = findLayerSafe;
exports.findByName = findByName;
exports.findByIndex = findByIndex;
exports.compareNames = compareNames;
exports.spawnAsync = spawnAsync;
exports.getCanvas = getCanvas;
exports.getCanvasSafe = getCanvasSafe;
exports.getLayerCanvas = getLayerCanvas;
exports.getLayerCanvasSafe = getLayerCanvasSafe;
exports.parseWithNumber = parseWithNumber;
exports.trimRight = trimRight;
exports.addImage = addImage;
exports.createSprite = createSprite;
exports.addSprite = addSprite;
exports.addSpriteWithColors = addSpriteWithColors;
exports.getColorsCount = getColorsCount;
exports.createPixelSprites = createPixelSprites;
exports.getPatternLayers = getPatternLayers;
exports.getPatternCanvases = getPatternCanvases;
exports.clipPattern = clipPattern;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const child_process_1 = require("child_process");
const lodash_1 = require("lodash");
const palette_utils_1 = require("./palette-utils");
const sprite_sheet_1 = require("./sprite-sheet");
const canvas_utils_1 = require("./canvas-utils");
global.DEVELOPMENT = true;
exports.TRANSPARENT = 0;
exports.BLACK = 0x000000ff;
exports.WHITE = 0xffffffff;
exports.OUTLINE_COLOR = 0x9f9f9fff;
exports.SHADE_COLOR = 0xccccccff;
exports.LIGHT_SHADE_COLOR = 0xddddddff;
exports.TEAR_COLOR = 0xc1eef0ff;
exports.DARK_GRAY = 0x232728ff;
exports.MOUTH_COLOR = 0x721946ff;
exports.TONGUE_COLOR = 0xf39f4bff;
exports.TEETH_COLOR = 0x8cffffff;
exports.TEETH_SHADE_COLOR = 0x77d9d9ff;
// TEMP: remove after adding palettes for effects
const holdPoofColors = [
    0xffff47ff, 0xeaed58ff, 0xd8dc00ff, 0xff6741ff, 0xff0000ff, 0xff7af9ff, 0xff00ccff, 0xb67affff,
    0x9876ffff, 0x76a6ffff, 0x0097ffff, 0x00ff9bff, 0x76ed5cff, 0x28dc00ff, 0x76ed5cff,
];
exports.defaultPalette = [
    exports.TRANSPARENT, exports.WHITE, exports.BLACK, exports.MOUTH_COLOR, exports.TONGUE_COLOR, exports.LIGHT_SHADE_COLOR, exports.TEAR_COLOR, exports.DARK_GRAY,
    ...holdPoofColors,
];
function cartesian(...args) {
    return (0, lodash_1.reduce)(args, (a, b) => (0, lodash_1.flatten)((0, lodash_1.map)(a, x => (0, lodash_1.map)(b, y => x.concat([y])))), [[]]);
}
function mkdir(dirpath) {
    try {
        fs.mkdirSync(dirpath);
    }
    catch { }
}
const isDirectory = (dir) => fs.lstatSync(dir).isDirectory();
const getDirectories = (dir) => fs.readdirSync(dir).map(name => path.join(dir, name)).filter(isDirectory);
exports.getDirectories = getDirectories;
function findLayerByPath([name, ...child], layer) {
    return name ? findLayerByPath(child, layer && findByName(layer.children, name)) : layer;
}
function findLayer(path, layer) {
    return findLayerByPath(path.split('/'), layer);
}
function findLayerSafe(name, parent) {
    const layer = findLayer(name, parent);
    if (!layer) {
        throw new Error(`Missing layer "${name}" in "${parent.info}"`);
    }
    return layer;
}
function findByName(items, name) {
    return items.find(i => i.name === name);
}
function findByIndex(items, index) {
    return items.find(i => i.index === index);
}
const nameMatches = (regex) => (l) => regex.test(l.name);
exports.nameMatches = nameMatches;
function compareNames(a, b) {
    return a.name.localeCompare(b.name);
}
exports.time = (function () {
    const start = Date.now();
    let last = start;
    return function (text) {
        console.log(text, (Date.now() - last), 'ms');
        last = Date.now();
        return true;
    };
})();
function spawnAsync(command, args) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.spawn)(command, args)
            .on('error', (err) => reject(err))
            .on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Non-zero return code for ${command} (${code})`)));
    });
}
// canvas
function getCanvas(layer) {
    if (!layer)
        return undefined;
    const canvas = layer.canvas;
    if (canvas) {
        canvas.info = layer.info;
    }
    return canvas;
}
function getCanvasSafe(layer) {
    const canvas = getCanvas(layer);
    if (!canvas) {
        throw new Error(`Cannot find canvas in layer "${layer.info}"`);
    }
    return canvas;
}
function getLayerCanvas(name, parent) {
    return getCanvas(findLayer(name, parent));
}
function getLayerCanvasSafe(name, parent) {
    return getCanvasSafe(findLayerSafe(name, parent));
}
function parseWithNumber(name) {
    const match = /(\d+)/.exec(name);
    return parseInt(match ? match[1] : '0', 10);
}
const matcher = (regex) => (text) => regex.test(text);
exports.matcher = matcher;
const isArrayEmpty = (a) => !a || a.length === 0;
const nullForEmpty = (a) => isArrayEmpty(a) ? null : a;
function trimRight(items) {
    return (0, lodash_1.dropRightWhile)(items.map(nullForEmpty), isArrayEmpty);
}
// sprites
const redCanvas = (0, canvas_utils_1.createColorCanvas)(1000, 1000, 'red');
function addImage(images, canvas) {
    if (canvas) {
        // TODO: remove duplicated
        images.push(canvas);
        return images.length - 1;
    }
    else {
        return 0;
    }
}
function createSprite(index, image, { w, h, x, y }) {
    return { index, image, w, h, x: 0, y: 0, ox: x, oy: y };
}
const maxSpriteWidth = 500;
const maxSpriteHeight = 500;
function addSprite(sprites, canvas, pattern, palette, out = {}) {
    if (canvas) {
        const rect = (0, sprite_sheet_1.getSpriteRect)(canvas, 0, 0, canvas.width, canvas.height);
        if (rect.w && rect.h) {
            if (rect.w > maxSpriteWidth || rect.h > maxSpriteHeight) {
                throw new Error(`Sprite too large (${rect.w}, ${rect.h}) from [${canvas.info}]`);
            }
            const image = (0, palette_utils_1.imageToPalette)(rect, canvas, pattern || redCanvas, palette, out);
            sprites.push(createSprite(sprites.length, image, rect));
            return sprites.length - 1;
        }
    }
    return 0;
}
function addSpriteWithColors(sprites, colorImage, patternImage, forceWhite) {
    const out = { forceWhite };
    const color = addSprite(sprites, colorImage, patternImage, undefined, out);
    return { color, colors: out.colors };
}
function getColorsCount(colorImage, patternImage, forceWhite) {
    const out = { forceWhite };
    addSprite([], colorImage, patternImage, undefined, out);
    return out.colors;
}
function createPixelSprites({ objects, objects2, images, sprites }) {
    const pixel = (0, canvas_utils_1.createColorCanvas)(3, 3, 'white');
    objects['pixelRect'] = addImage(images, pixel);
    objects2['pixelRect2'] = addSprite(sprites, pixel, undefined, exports.defaultPalette);
}
// layers
const compareLayers = (a, b) => parseWithNumber(a.name) - parseWithNumber(b.name);
exports.compareLayers = compareLayers;
function getPatternLayers(layer) {
    return layer.children.filter((0, exports.nameMatches)(/^pattern/)).sort(exports.compareLayers);
}
function getPatternCanvases(layer) {
    const canvases = getPatternLayers(layer).map(getCanvas);
    return (0, lodash_1.dropRightWhile)(canvases, canvas_utils_1.isCanvasEmpty);
}
function clipPattern(color, pattern) {
    if (pattern) {
        const ctx = pattern.getContext('2d');
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(color, 0, 0);
    }
    return pattern;
}
//# sourceMappingURL=common.js.map