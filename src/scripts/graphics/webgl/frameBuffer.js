"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFrameBuffer = createFrameBuffer;
exports.disposeFrameBuffer = disposeFrameBuffer;
exports.resizeFrameBuffer = resizeFrameBuffer;
exports.bindFrameBuffer = bindFrameBuffer;
exports.unbindFrameBuffer = unbindFrameBuffer;
const texture2d_1 = require("./texture2d");
function createFrameBuffer(gl, width, height) {
    const handle = gl.createFramebuffer();
    if (!handle) {
        throw new Error('Failed to create frame buffer');
    }
    const texture = (0, texture2d_1.createEmptyTexture)(gl, width, height, gl.RGB);
    return { handle, texture, width, height };
}
function disposeFrameBuffer(gl, buffer) {
    try {
        if (gl && buffer) {
            gl.deleteFramebuffer(buffer.handle);
            gl.deleteTexture(buffer.texture.handle);
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
    return undefined;
}
function resizeFrameBuffer(gl, frameBuffer, width, height) {
    (0, texture2d_1.resizeTexture)(gl, frameBuffer.texture, width, height);
    frameBuffer.width = width;
    frameBuffer.height = height;
}
function bindFrameBuffer(gl, { handle, texture }) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, handle);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.handle, 0);
}
function unbindFrameBuffer(gl) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
//# sourceMappingURL=frameBuffer.js.map