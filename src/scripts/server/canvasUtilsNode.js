"use strict";
/// <reference path="../../typings/my.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanvas = void 0;
exports.loadImage = loadImage;
exports.loadImageSync = loadImageSync;
const fs_1 = require("fs");
// Try to load canvas, but allow graceful degradation if not available
let createNodeCanvas;
let Image;
let canvasAvailable = false;
try {
    const canvas = require('canvas');
    createNodeCanvas = canvas.createCanvas;
    Image = canvas.Image;
    canvasAvailable = true;
}
catch (e) {
    console.warn('Canvas module not available, image processing features will be disabled');
    // Provide stub implementations
    createNodeCanvas = () => { throw new Error('Canvas not available'); };
    Image = class {
        constructor() { throw new Error('Canvas not available'); }
    };
}
exports.createCanvas = createNodeCanvas;
async function loadImage(src) {
    if (!canvasAvailable) {
        throw new Error('Canvas module not available');
    }
    const buffer = await (0, fs_1.readFileAsync)(src);
    const image = new Image();
    image.src = buffer;
    return image;
}
function loadImageSync(src) {
    if (!canvasAvailable) {
        throw new Error('Canvas module not available');
    }
    const image = new Image();
    image.src = (0, fs_1.readFileSync)(src);
    return image;
}
if (canvasAvailable) {
    const { setup } = require('../client/canvasUtils');
    setup({ createCanvas: createNodeCanvas, loadImage });
}
//# sourceMappingURL=canvasUtilsNode.js.map