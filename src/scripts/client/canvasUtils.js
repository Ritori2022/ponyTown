"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPixelRatio = exports.loadImage = exports.createCanvas = void 0;
exports.setup = setup;
exports.resizeCanvas = resizeCanvas;
exports.resizeCanvasWithRatio = resizeCanvasWithRatio;
exports.canvasToSource = canvasToSource;
exports.saveCanvas = saveCanvas;
exports.disableImageSmoothing = disableImageSmoothing;
const file_saver_1 = require("file-saver");
/* istanbul ignore next */
let createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width | 0;
    canvas.height = height | 0;
    return canvas;
};
exports.createCanvas = createCanvas;
/* istanbul ignore next */
let loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', () => reject(new Error(`Error loading image (${src})`)));
        img.src = src;
    });
};
exports.loadImage = loadImage;
/* istanbul ignore next */
function canUseImageBitmap() {
    return typeof fetch === 'function' &&
        typeof createImageBitmap === 'function' &&
        !/yabrowser/i.test(navigator.userAgent); // disabled due to yandex browser bug
}
/* istanbul ignore next */
if (canUseImageBitmap()) {
    exports.loadImage = src => fetch(src)
        .then(response => response.blob())
        .then(createImageBitmap);
}
function setup(methods) {
    exports.createCanvas = methods.createCanvas;
    exports.loadImage = methods.loadImage;
}
/* istanbul ignore next */
exports.getPixelRatio = SERVER ? () => 1 : () => window.devicePixelRatio;
function resizeCanvas(canvas, width, height) {
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}
function resizeCanvasWithRatio(canvas, width, height, updateStyle = true) {
    const ratio = (0, exports.getPixelRatio)();
    const w = Math.round(width * ratio);
    const h = Math.round(height * ratio);
    let resized = false;
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        resized = true;
    }
    if (updateStyle && (canvas.style.width !== width + 'px' || canvas.style.height !== height + 'px')) {
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        resized = true;
    }
    return resized;
}
/* istanbul ignore next */
function canvasToSource(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(URL.createObjectURL(blob));
            }
            else {
                reject(new Error('Failed to convert canvas'));
            }
        });
    });
}
/* istanbul ignore next */
function saveCanvas(canvas, name) {
    canvas.toBlob(blob => blob && (0, file_saver_1.saveAs)(blob, name));
}
/* istanbul ignore next */
function disableImageSmoothing(context) {
    if ('imageSmoothingEnabled' in context) {
        context.imageSmoothingEnabled = false;
    }
    else {
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
    }
}
//# sourceMappingURL=canvasUtils.js.map