"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTexturesForSpriteSheets = createTexturesForSpriteSheets;
exports.disposeTexturesForSpriteSheets = disposeTexturesForSpriteSheets;
const texture2d_1 = require("./webgl/texture2d");
function createTexturesForSpriteSheets(gl, sheets, texture = texture2d_1.createTexture) {
    sheets.forEach(sheet => {
        if (sheet.data) {
            sheet.texture = texture(gl, sheet.data);
        }
    });
}
function disposeTexturesForSpriteSheets(gl, sheets) {
    sheets.forEach(sheet => {
        sheet.texture = (0, texture2d_1.disposeTexture)(gl, sheet.texture);
    });
}
//# sourceMappingURL=spriteSheetUtils.js.map