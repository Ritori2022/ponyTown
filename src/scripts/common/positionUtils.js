"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toScreenX = toScreenX;
exports.toScreenY = toScreenY;
exports.toScreenYWithZ = toScreenYWithZ;
exports.toWorldX = toWorldX;
exports.toWorldY = toWorldY;
exports.toWorldZ = toWorldZ;
exports.pointToScreen = pointToScreen;
exports.pointToWorld = pointToWorld;
exports.rectToScreen = rectToScreen;
exports.roundPositionX = roundPositionX;
exports.roundPositionY = roundPositionY;
exports.roundPositionXMidPixel = roundPositionXMidPixel;
exports.roundPositionYMidPixel = roundPositionYMidPixel;
exports.roundPosition = roundPosition;
const constants_1 = require("./constants");
function toScreenX(x) {
    return Math.floor(x * constants_1.tileWidth) | 0;
}
function toScreenY(y) {
    return Math.floor(y * constants_1.tileHeight) | 0;
}
function toScreenYWithZ(y, z) {
    return Math.floor(y * constants_1.tileHeight - z * constants_1.tileElevation) | 0;
}
function toWorldX(x) {
    return x / constants_1.tileWidth;
}
function toWorldY(y) {
    return y / constants_1.tileHeight;
}
function toWorldZ(z) {
    return z / constants_1.tileElevation;
}
function pointToScreen({ x, y }) {
    return {
        x: toScreenX(x),
        y: toScreenY(y),
    };
}
function pointToWorld({ x, y }) {
    return {
        x: toWorldX(x),
        y: toWorldY(y),
    };
}
function rectToScreen({ x, y, w, h }) {
    return {
        x: toScreenX(x),
        y: toScreenY(y),
        w: toScreenX(w),
        h: toScreenY(h),
    };
}
function roundPositionX(x) {
    return Math.floor(x * constants_1.tileWidth) / constants_1.tileWidth;
}
function roundPositionY(y) {
    return Math.floor(y * constants_1.tileHeight) / constants_1.tileHeight;
}
function roundPositionXMidPixel(x) {
    return (Math.floor(x * constants_1.tileWidth) + 0.5) / constants_1.tileWidth;
}
function roundPositionYMidPixel(y) {
    return (Math.floor(y * constants_1.tileHeight) + 0.5) / constants_1.tileHeight;
}
function roundPosition(point) {
    point.x = roundPositionX(point.x);
    point.y = roundPositionY(point.y);
}
//# sourceMappingURL=positionUtils.js.map