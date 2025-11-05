"use strict";
/// <reference path="../../typings/my.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanvas = void 0;
exports.loadImage = loadImage;
exports.loadImageSync = loadImageSync;
const fs_1 = require("fs");
const canvas_1 = require("canvas");
const canvasUtils_1 = require("../client/canvasUtils");
exports.createCanvas = canvas_1.createCanvas;
async function loadImage(src) {
    const buffer = await (0, fs_1.readFileAsync)(src);
    const image = new canvas_1.Image();
    image.src = buffer;
    return image;
}
function loadImageSync(src) {
    const image = new canvas_1.Image();
    image.src = (0, fs_1.readFileSync)(src);
    return image;
}
(0, canvasUtils_1.setup)({ createCanvas: canvas_1.createCanvas, loadImage });
//# sourceMappingURL=canvasUtilsNode.js.map