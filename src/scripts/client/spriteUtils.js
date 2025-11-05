"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAndInitSpriteSheets = exports.spriteSheetsLoaded = void 0;
exports.createSprite = createSprite;
exports.addTitles = addTitles;
exports.addLabels = addLabels;
exports.createEyeSprite = createEyeSprite;
exports.getColorCount = getColorCount;
exports.createSpriteUtils = createSpriteUtils;
exports.loadSpriteSheets = loadSpriteSheets;
exports.loadAndInitSheets = loadAndInitSheets;
exports.loadImageFromUrl = loadImageFromUrl;
const lodash_1 = require("lodash");
const sprites_1 = require("../generated/sprites");
const canvasUtils_1 = require("../client/canvasUtils");
const rev_1 = require("./rev");
const fonts_1 = require("./fonts");
function createSprite(x, y, w, h, ox, oy, type) {
    return { x, y, w, h, ox, oy, type };
}
function addTitles(sprites, titles) {
    return sprites && sprites.map((ns, i) => ns && ns.map(s => s && { color: s.color, colors: s.colors, title: titles[i], label: titles[i] }));
}
function addLabels(sprites, labels) {
    sprites && sprites.forEach((s, i) => s && s[0] ? s[0].label = labels[i] : undefined);
    return sprites;
}
function createEyeSprite(eye, iris, defaultPalette) {
    return eye && { color: eye.irises[iris], colors: 2, extra: eye.base, palettes: [defaultPalette] };
}
function getColorCount(sprite) {
    return sprite && sprite.colors ? Math.floor((sprite.colors - 1) / 2) : 0;
}
function createSpriteUtils() {
    (0, fonts_1.createFonts)();
}
function getImageData(img) {
    const canvas = (0, canvasUtils_1.createCanvas)(img.width, img.height);
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, img.width, img.height);
}
function loadSpriteSheet(sheet, loadImage) {
    return Promise.all([
        loadImage(sheet.src),
        sheet.srcA ? loadImage(sheet.srcA) : Promise.resolve(undefined)
    ])
        .then(([img, imgA]) => {
        sheet.data = getImageData(img);
        if (imgA) {
            const alpha = getImageData(imgA);
            const alphaData = alpha.data;
            const sheedData = sheet.data.data;
            for (let i = 0; i < sheedData.length; i += 4) {
                sheedData[i + 3] = alphaData[i];
            }
        }
    });
}
function loadSpriteSheets(sheets, loadImage) {
    return Promise.all(sheets.map(s => loadSpriteSheet(s, loadImage))).then(lodash_1.noop);
}
exports.spriteSheetsLoaded = false;
function loadAndInitSheets(sheets, loadImage) {
    return loadSpriteSheets(sheets, loadImage)
        .then(createSpriteUtils)
        .then(() => true)
        .catch(e => (console.error(e), false))
        .then(loaded => exports.spriteSheetsLoaded = loaded);
}
function loadImageFromUrl(url) {
    return (0, canvasUtils_1.loadImage)((0, rev_1.getUrl)(url));
}
exports.loadAndInitSpriteSheets = (0, lodash_1.once)(() => loadAndInitSheets(sprites_1.spriteSheets, loadImageFromUrl));
//# sourceMappingURL=spriteUtils.js.map