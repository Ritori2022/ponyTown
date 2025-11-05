"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPsds = void 0;
exports.openPsd = openPsd;
exports.openPsdFiles = openPsdFiles;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const ag_psd_1 = require("ag-psd");
const canvas_utils_1 = require("./canvas-utils");
const common_1 = require("./common");
(0, ag_psd_1.initializeCanvas)((width, height) => (0, canvas_utils_1.createExtCanvas)(width, height, 'loaded from psd'));
function openPsd(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const name = path.basename(filePath, '.psd');
        const dir = path.basename(path.dirname(filePath));
        const psd = (0, ag_psd_1.readPsd)(buffer, {
            skipCompositeImageData: true,
            skipThumbnail: true,
            throwForMissingFeatures: true,
            logMissingFeatures: true,
        });
        return toPsd(psd, name, dir);
    }
    catch (e) {
        console.error(`Failed to load: ${filePath}: ${e.message}`);
        throw e;
    }
}
function toPsd({ width, height, children }, name, dir) {
    const info = `${dir}/${name}`;
    return {
        dir, name, width, height, info, children: (children || []).map(c => toLayer(c, width, height, info)),
    };
}
function toLayer({ name, canvas, left, top, children }, width, height, parentInfo) {
    const info = `${parentInfo}/${name}`;
    return {
        name: name || '<noname>',
        info,
        canvas: fixCanvas(canvas, width, height, left || 0, top || 0, info),
        children: (children || []).map(c => toLayer(c, width, height, info)),
    };
}
function fixCanvas(canvas, width, height, left, top, info) {
    if (!canvas)
        return undefined;
    const result = (0, canvas_utils_1.createExtCanvas)(width, height, info);
    result.getContext('2d').drawImage(canvas, left, top);
    return result;
}
const isPsd = (0, common_1.matcher)(/\.psd$/);
const getPsds = (directory) => fs.readdirSync(directory).filter(isPsd);
exports.getPsds = getPsds;
function openPsdFiles(directory, match) {
    return (0, exports.getPsds)(directory)
        .filter(f => match ? match.test(f) : true)
        .sort((a, b) => (0, common_1.parseWithNumber)(a) - (0, common_1.parseWithNumber)(b))
        .map(f => path.join(directory, f))
        .map(openPsd);
}
//# sourceMappingURL=psd-utils.js.map