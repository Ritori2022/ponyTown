"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontMonoPal = exports.fontMono = exports.fontSmallPal = exports.fontSmall = exports.fontPal = exports.font = void 0;
exports.createFonts = createFonts;
const tslib_1 = require("tslib");
const spriteFont_1 = require("../graphics/spriteFont");
const sprites = tslib_1.__importStar(require("../generated/sprites"));
function createFonts() {
    exports.font = (0, spriteFont_1.createSpriteFont)(sprites.font, sprites.emoji, 3);
    exports.font.lineSpacing = 3;
    exports.font.letterShiftY = -2;
    exports.fontPal = (0, spriteFont_1.createSpriteFont)(sprites.fontPal, sprites.emojiPal, 3);
    exports.fontPal.lineSpacing = 3;
    exports.fontPal.letterShiftY = -2;
    exports.fontSmall = (0, spriteFont_1.createSpriteFont)(sprites.fontSmall, [], 2);
    exports.fontSmall.lineSpacing = 4;
    exports.fontSmall.letterShiftY = -2;
    exports.fontSmall.letterHeightReal += 2;
    exports.fontSmallPal = (0, spriteFont_1.createSpriteFont)(sprites.fontSmallPal, [], 2);
    exports.fontSmallPal.lineSpacing = 4;
    exports.fontSmallPal.letterShiftY = -2;
    exports.fontSmallPal.letterHeightReal += 2;
    exports.fontMono = (0, spriteFont_1.createSpriteFont)(sprites.fontMono, [], 4);
    exports.fontMono.lineSpacing = 4;
    exports.fontMono.letterShiftY = -2;
    exports.fontMono.letterHeightReal += 2;
    exports.fontMonoPal = (0, spriteFont_1.createSpriteFont)(sprites.fontMonoPal, [], 4);
    exports.fontMonoPal.lineSpacing = 4;
    exports.fontMonoPal.letterShiftY = -2;
    exports.fontMonoPal.letterHeightReal += 2;
}
//# sourceMappingURL=fonts.js.map