"use strict";
/// <reference path="../../typings/my.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSprites = void 0;
exports.loadImageServer = loadImageServer;
exports.loadImageAsCanvas = loadImageAsCanvas;
exports.generateDiff = generateDiff;
exports.clearCompareResults = clearCompareResults;
exports.compareCanvases = compareCanvases;
exports.readTestsFile = readTestsFile;
exports.createFunctionWithPromiseHandler = createFunctionWithPromiseHandler;
exports.stubClass = stubClass;
exports.stubFromInstance = stubFromInstance;
exports.resetStubMethods = resetStubMethods;
const tslib_1 = require("tslib");
require("../server/boot");
const mongoose = tslib_1.__importStar(require("mongoose"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const del = tslib_1.__importStar(require("del"));
const lodash_1 = require("lodash");
const child_process_1 = require("child_process");
const sinon_1 = require("sinon");
const spriteUtils_1 = require("../client/spriteUtils");
require("../server/canvasUtilsNode");
const mixins_1 = require("../common/mixins");
const ponyInfo_1 = require("../common/ponyInfo");
const sprites_1 = require("../generated/sprites");
const paths_1 = require("../server/paths");
const canvasUtilsNode_1 = require("../server/canvasUtilsNode");
require('chai').use(require('chai-as-promised'));
mongoose.models = {};
mongoose.modelSchemas = {};
global.TESTS = true;
global.TOOLS = true;
global.performance = Date;
(0, mixins_1.setPaletteManager)(ponyInfo_1.mockPaletteManager);
function loadImageServer(src) {
    return (0, canvasUtilsNode_1.loadImage)((0, paths_1.pathTo)('assets', src));
}
exports.loadSprites = (0, lodash_1.once)(() => (0, spriteUtils_1.loadAndInitSheets)(sprites_1.spriteSheets, loadImageServer));
function loadImageAsCanvas(filePath) {
    try {
        const image = (0, canvasUtilsNode_1.loadImageSync)(filePath);
        const expected = (0, canvasUtilsNode_1.createCanvas)(image.width, image.height);
        expected.getContext('2d').drawImage(image, 0, 0);
        return expected;
    }
    catch (e) {
        console.error(e);
    }
    return (0, canvasUtilsNode_1.createCanvas)(0, 0);
}
function generateDiff(expectedPath, actualPath) {
    (0, child_process_1.spawnSync)('magick', ['compare', actualPath, expectedPath, actualPath.replace(/\.png$/, '-diff.png')], { encoding: 'utf8' });
}
async function clearCompareResults(group) {
    await del([(0, paths_1.pathTo)('tools', 'temp', group, '*.png').replace(/\\/g, '/')]);
}
function compareCanvases(expected, actual, filePath, group, diff = true) {
    try {
        if (expected === actual)
            return;
        if (!expected)
            throw new Error(`Expected canvas is null`);
        if (!actual)
            throw new Error(`Actual canvas is null`);
        if (expected.width !== actual.width || expected.height !== actual.height)
            throw new Error(`Canvas size is different than expected`);
        const expectedData = expected.getContext('2d').getImageData(0, 0, expected.width, expected.height);
        const actualData = actual.getContext('2d').getImageData(0, 0, actual.width, actual.height);
        const length = expectedData.width * expectedData.height * 4;
        for (let i = 0; i < length; i++) {
            if (expectedData.data[i] !== actualData.data[i]) {
                const x = Math.floor(i / 4) % actualData.width;
                const y = Math.floor((i / 4) / actualData.width);
                throw new Error(`Actual canvas different than expected at (${x}, ${y})`);
            }
        }
    }
    catch (e) {
        if (actual && diff) {
            const tempRoot = (0, paths_1.pathTo)('tools', 'temp', group);
            const tempPath = path.join(tempRoot, filePath ? path.basename(filePath) : `${Date.now()}-failed-test.png`);
            fs.writeFileSync(tempPath, actual.toBuffer());
            if (filePath) {
                generateDiff(filePath, tempPath);
            }
        }
        throw e;
    }
}
const testsPath = (0, paths_1.pathTo)('src', 'tests', 'filters');
function readTestsFile(fileName) {
    const lines = fs.readFileSync(path.join(testsPath, fileName), 'utf8')
        .split(/\r?\n/g)
        .map(x => x.trim())
        .filter(x => !!x);
    for (let i = lines.length - 1; i > 0; i--) {
        if (lines.indexOf(lines[i]) < i) {
            console.error(`Duplicate line "${lines[i]}" in ${fileName}`);
        }
    }
    return lines;
}
function createFunctionWithPromiseHandler(ctor, ...deps) {
    return (...args) => {
        let result;
        const func = ctor(...deps, (promise, handleError) => result = promise.catch(handleError));
        func(...args);
        return result;
    };
}
function stubClass(ctor) {
    return (0, sinon_1.createStubInstance)(ctor);
}
function stubFromInstance(instance) {
    return (0, lodash_1.mapValues)(instance, () => (0, sinon_1.stub)());
}
function resetStubMethods(stub, ...methods) {
    methods.forEach(method => {
        stub[method].resetBehavior();
        stub[method].reset();
    });
}
//# sourceMappingURL=lib.js.map