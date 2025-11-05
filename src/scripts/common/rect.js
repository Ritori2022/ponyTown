"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rect = rect;
exports.centerPoint = centerPoint;
exports.copyRect = copyRect;
exports.withBorder = withBorder;
exports.withPadding = withPadding;
exports.rectsIntersect = rectsIntersect;
exports.addRect = addRect;
exports.addRects = addRects;
const utils_1 = require("./utils");
function rect(x, y, w, h) {
    return { x, y, w, h };
}
function centerPoint(rect) {
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}
function copyRect(dst, src) {
    dst.x = src.x;
    dst.y = src.y;
    dst.w = src.w;
    dst.h = src.h;
}
function withBorder({ x, y, w, h }, border) {
    return rect(x - border, y - border, w + border * 2, h + border * 2);
}
function withPadding({ x, y, w, h }, top, right, bottom, left) {
    return rect(x - top, y - left, w + left + right, h + top + bottom);
}
function rectsIntersect(a, b) {
    return (0, utils_1.intersect)(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h);
}
function addRect(a, b) {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    a.w = Math.max(a.x + a.w, b.x + b.w) - x;
    a.h = Math.max(a.y + a.h, b.y + b.h) - y;
    a.x = x;
    a.y = y;
}
function addRects(a, b) {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    return {
        x, y,
        w: Math.max(a.x + a.w, b.x + b.w) - x,
        h: Math.max(a.y + a.h, b.y + b.h) - y,
    };
}
//# sourceMappingURL=rect.js.map