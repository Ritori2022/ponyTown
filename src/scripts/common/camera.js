"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterHeight = void 0;
exports.createCamera = createCamera;
exports.setupCamera = setupCamera;
exports.updateCamera = updateCamera;
exports.centerCameraOn = centerCameraOn;
exports.calculateCameraY = calculateCameraY;
exports.isWorldPointVisible = isWorldPointVisible;
exports.isWorldPointWithPaddingVisible = isWorldPointWithPaddingVisible;
exports.isAreaVisible = isAreaVisible;
exports.isRectVisible = isRectVisible;
exports.isBoundsVisible = isBoundsVisible;
exports.isEntityVisible = isEntityVisible;
exports.isChatVisible = isChatVisible;
exports.screenToWorld = screenToWorld;
exports.worldToScreen = worldToScreen;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const positionUtils_1 = require("./positionUtils");
const graphicsUtils_1 = require("../graphics/graphicsUtils");
const cameraPadding = 0.3;
exports.characterHeight = 25;
function createCamera() {
    return {
        x: 0,
        y: 0,
        w: 100,
        h: 100,
        offset: 0,
        shift: 0,
        shiftTarget: 0,
        shiftRatio: 0,
        actualY: 0,
    };
}
function setupCamera(camera, x, y, width, height, map) {
    camera.w = (0, utils_1.clamp)(width, constants_1.CAMERA_WIDTH_MIN, constants_1.CAMERA_WIDTH_MAX);
    camera.h = (0, utils_1.clamp)(height, constants_1.CAMERA_HEIGHT_MIN, constants_1.CAMERA_HEIGHT_MAX);
    camera.x = (0, utils_1.clamp)(x, 0, (0, positionUtils_1.toScreenX)(map.width) - camera.w);
    camera.y = (0, utils_1.clamp)(y, 0, (0, positionUtils_1.toScreenY)(map.height) - camera.h);
}
function updateCamera(camera, player, map) {
    const cameraWith = camera.w;
    const cameraHeight = camera.h;
    const cameraHeightShifted = Math.ceil(camera.h - camera.offset);
    const playerX = (0, positionUtils_1.toScreenX)(player.x);
    const playerY = (0, positionUtils_1.toScreenY)(player.y);
    const mapWidth = (0, positionUtils_1.toScreenX)(map.width);
    const mapHeight = (0, positionUtils_1.toScreenY)(map.height);
    const minX = Math.min(0, (mapWidth - cameraWith) / 2);
    const minY = Math.min(0, (mapHeight - cameraHeight) / 2);
    const minYShifted = Math.min(0, (mapHeight - cameraHeightShifted) / 2);
    const maxX = Math.max(mapWidth - cameraWith, minX);
    const maxY = Math.max(mapHeight - cameraHeight, minY);
    const maxYShifted = Math.max(mapHeight - cameraHeightShifted, minY);
    const hSpace = Math.floor(cameraWith * cameraPadding);
    const vSpace = Math.floor(cameraHeight * cameraPadding);
    const vSpaceShifted = Math.floor(cameraHeightShifted * cameraPadding);
    const hPad = (cameraWith - hSpace) / 2;
    const vPad = (cameraHeight - vSpace) / 2;
    const vPadShifted = (cameraHeightShifted - vSpaceShifted) / 2;
    const minCamX = (0, utils_1.clamp)(playerX - (hSpace + hPad), minX, maxX);
    const maxCamX = (0, utils_1.clamp)(playerX - hPad, minX, maxX);
    const minCamY = (0, utils_1.clamp)(playerY - (vSpace + vPad) - exports.characterHeight, minY, maxY);
    const maxCamY = (0, utils_1.clamp)(playerY - vPad - exports.characterHeight, minY, maxY);
    const minCamYShifted = (0, utils_1.clamp)(playerY - (vSpaceShifted + vPadShifted) - exports.characterHeight, minYShifted, maxYShifted);
    const maxCamYShifted = (0, utils_1.clamp)(playerY - vPadShifted - exports.characterHeight, minYShifted, maxYShifted);
    camera.x = Math.floor((0, utils_1.clamp)(camera.x, minCamX, maxCamX));
    camera.y = Math.floor((0, utils_1.clamp)(camera.y, minCamY, maxCamY));
    camera.shiftTarget = Math.floor((0, utils_1.clamp)(camera.shiftTarget, minCamYShifted, maxCamYShifted));
    camera.actualY = calculateCameraY(camera);
}
function centerCameraOn(camera, point) {
    camera.x = Math.floor((0, positionUtils_1.toScreenX)(point.x) - camera.w / 2);
    camera.y = Math.floor(((0, positionUtils_1.toScreenY)(point.y) - camera.h / 2) - exports.characterHeight);
    camera.shiftTarget = Math.floor(((0, positionUtils_1.toScreenY)(point.y) - Math.ceil(camera.h - camera.offset) / 2) - exports.characterHeight);
}
function calculateCameraY(camera) {
    return Math.round((0, utils_1.lerp)(camera.y, camera.shiftTarget - camera.offset, camera.shiftRatio));
}
function isWorldPointVisible(camera, point) {
    return (0, utils_1.pointInRect)((0, positionUtils_1.toScreenX)(point.x), (0, positionUtils_1.toScreenY)(point.y), camera);
}
function isWorldPointWithPaddingVisible(camera, point, padding) {
    return (0, utils_1.pointInXYWH)((0, positionUtils_1.toScreenX)(point.x), (0, positionUtils_1.toScreenY)(point.y), camera.x - padding, camera.actualY - padding, camera.w + 2 * padding, camera.h + 2 * padding);
}
function isAreaVisible(camera, x, y, w, h) {
    return (0, utils_1.intersect)(camera.x, camera.actualY, camera.w, camera.h, x, y, w, h);
}
function isRectVisible(camera, rect) {
    return (0, utils_1.intersect)(camera.x, camera.actualY, camera.w, camera.h, rect.x, rect.y, rect.w, rect.h);
}
function isBoundsVisible(camera, bounds, x, y) {
    return bounds !== undefined &&
        isAreaVisible(camera, (0, positionUtils_1.toScreenX)(x) + bounds.x, (0, positionUtils_1.toScreenY)(y) + bounds.y, bounds.w, bounds.h);
}
function isEntityVisible(camera, entity) {
    return isBoundsVisible(camera, entity.bounds, entity.x, entity.y);
}
function isChatBaloonAboveScreenTop(camera, entity) {
    return (0, graphicsUtils_1.getChatBallonXY)(entity, camera).y <= -5;
}
function isChatVisible(camera, entity) {
    return isBoundsVisible(camera, entity.bounds, entity.x, entity.y)
        && !isChatBaloonAboveScreenTop(camera, entity);
}
function screenToWorld(camera, point) {
    return {
        x: (0, positionUtils_1.toWorldX)(point.x + camera.x),
        y: (0, positionUtils_1.toWorldY)(point.y + camera.actualY),
    };
}
function worldToScreen(camera, point) {
    return {
        x: Math.floor((0, positionUtils_1.toScreenX)(point.x) - camera.x),
        y: Math.floor((0, positionUtils_1.toScreenY)(point.y) - camera.actualY),
    };
}
// export function mapDepth(camera: Camera, y: number): number {
// 	return (toScreenY(y) - camera.actualY) - camera.maxDepth;
// }
//# sourceMappingURL=camera.js.map