"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const canvasUtils_1 = require("../../client/canvasUtils");
describe('canvasUtils', () => {
    describe('resizeCanvas()', () => {
        it('should resize the canvas', () => {
            const canvas = { width: 100, height: 200 };
            (0, canvasUtils_1.resizeCanvas)(canvas, 50, 300);
            (0, chai_1.expect)(canvas.width).equal(50);
            (0, chai_1.expect)(canvas.height).equal(300);
        });
        it('should resize height of the canvas', () => {
            const canvas = { width: 100, height: 200 };
            (0, canvasUtils_1.resizeCanvas)(canvas, 100, 300);
            (0, chai_1.expect)(canvas.width).equal(100);
            (0, chai_1.expect)(canvas.height).equal(300);
        });
        it('should leave canvas the same size', () => {
            const canvas = { width: 100, height: 200 };
            (0, canvasUtils_1.resizeCanvas)(canvas, 100, 200);
            (0, chai_1.expect)(canvas.width).equal(100);
            (0, chai_1.expect)(canvas.height).equal(200);
        });
    });
    describe('resizeCanvasWithRatio()', () => {
        it('should resize the canvas', () => {
            const canvas = { width: 100, height: 200, style: { width: '', height: '' } };
            (0, canvasUtils_1.resizeCanvasWithRatio)(canvas, 50, 300);
            (0, chai_1.expect)(canvas.width).equal(50);
            (0, chai_1.expect)(canvas.height).equal(300);
            (0, chai_1.expect)(canvas.style.width).equal('50px');
            (0, chai_1.expect)(canvas.style.height).equal('300px');
        });
        it('should resize height of the canvas', () => {
            const canvas = { width: 100, height: 200, style: { width: '', height: '' } };
            (0, canvasUtils_1.resizeCanvasWithRatio)(canvas, 100, 300);
            (0, chai_1.expect)(canvas.width).equal(100);
            (0, chai_1.expect)(canvas.height).equal(300);
            (0, chai_1.expect)(canvas.style.width).equal('100px');
            (0, chai_1.expect)(canvas.style.height).equal('300px');
        });
        it('should leave canvas the same size', () => {
            const canvas = { width: 100, height: 200, style: { width: '', height: '' } };
            (0, canvasUtils_1.resizeCanvasWithRatio)(canvas, 100, 200);
            (0, chai_1.expect)(canvas.width).equal(100);
            (0, chai_1.expect)(canvas.height).equal(200);
            (0, chai_1.expect)(canvas.style.width).equal('100px');
            (0, chai_1.expect)(canvas.style.height).equal('200px');
        });
        it('should not update the style if passed false', () => {
            const canvas = { width: 100, height: 200, style: { width: '', height: '' } };
            (0, canvasUtils_1.resizeCanvasWithRatio)(canvas, 50, 300, false);
            (0, chai_1.expect)(canvas.style.width).equal('');
            (0, chai_1.expect)(canvas.style.height).equal('');
        });
    });
});
//# sourceMappingURL=canvasUtils.spec.js.map