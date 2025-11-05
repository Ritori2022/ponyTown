"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStateBatch = void 0;
const utils_1 = require("../common/utils");
const mat2d_1 = require("../common/mat2d");
const rect_1 = require("../common/rect");
function createEmptyState() {
    return {
        transform: (0, mat2d_1.createMat2D)(),
        globalAlpha: 1,
        hasCrop: false,
        cropRect: (0, rect_1.rect)(0, 0, 0, 0),
    };
}
const stateCache = new utils_1.ObjectCache(10, createEmptyState);
class BaseStateBatch {
    constructor() {
        this.globalAlpha = 1;
        this.transform = (0, mat2d_1.createMat2D)();
        this.savedStates = [];
        this.hasCrop = false;
        this.cropRect = (0, rect_1.rect)(0, 0, 0, 0);
    }
    crop(x, y, w, h) {
        // console.error('Crop not supported');
        this.hasCrop = true;
        this.cropRect.x = x;
        this.cropRect.y = y;
        this.cropRect.w = w;
        this.cropRect.h = h;
    }
    clearCrop() {
        this.hasCrop = false;
    }
    save() {
        const state = stateCache.get();
        state.globalAlpha = this.globalAlpha;
        state.hasCrop = this.hasCrop;
        (0, mat2d_1.copyMat2D)(state.transform, this.transform);
        (0, rect_1.copyRect)(state.cropRect, this.cropRect);
        this.savedStates.push(state);
        if (DEVELOPMENT && this.savedStates.length > 100) {
            console.error('More than 100 save states');
        }
    }
    restore() {
        const state = this.savedStates.pop();
        if (state !== undefined) {
            this.globalAlpha = state.globalAlpha;
            this.hasCrop = state.hasCrop;
            (0, mat2d_1.copyMat2D)(this.transform, state.transform);
            (0, rect_1.copyRect)(this.cropRect, state.cropRect);
            stateCache.put(state);
        }
    }
    translate(x, y) {
        (0, mat2d_1.translateMat2D)(this.transform, this.transform, x, y);
    }
    scale(x, y) {
        (0, mat2d_1.scaleMat2D)(this.transform, this.transform, x, y);
    }
    rotate(angle) {
        (0, mat2d_1.rotateMat2D)(this.transform, this.transform, angle);
    }
    multiplyTransform(mat) {
        (0, mat2d_1.mulMat2D)(this.transform, this.transform, mat);
    }
}
exports.BaseStateBatch = BaseStateBatch;
//# sourceMappingURL=baseStateBatch.js.map