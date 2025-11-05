"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paletteSpriteTypes = void 0;
const color_1 = require("../common/color");
const type0Shade = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(255, 0, 0, 0));
const type2Shade = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(0, 0, 255, 0));
const type3Shade = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(0, 0, 0, 0));
const type0 = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(255, 0, 0, 255));
const type1 = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(0, 255, 0, 255));
const type2 = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(0, 0, 255, 255));
const type3 = (0, color_1.colorToFloat)((0, color_1.colorFromRGBA)(0, 0, 0, 255));
exports.paletteSpriteTypes = [type0Shade, type2Shade, type3Shade, type0, type1, type2, type3];
//# sourceMappingURL=spriteBatchUtils.js.map