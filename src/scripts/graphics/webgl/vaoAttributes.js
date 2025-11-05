"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVAOAttributesSize = getVAOAttributesSize;
exports.createVAOAttributes = createVAOAttributes;
function getVAOAttributesSize(gl, attributes) {
    return attributes.reduce((sum, a) => sum + a.size * sizeOfType(gl, a.type), 0);
}
function createVAOAttributes(gl, attributes, buffer) {
    const result = [];
    const stride = getVAOAttributesSize(gl, attributes);
    let offset = 0;
    for (const a of attributes) {
        result.push({ ...a, stride, buffer, offset });
        offset += a.size * sizeOfType(gl, a.type);
    }
    return result;
}
function sizeOfType(gl, type) {
    switch (type) {
        case gl.BYTE:
        case gl.UNSIGNED_BYTE:
            return 1;
        case gl.SHORT:
        case gl.UNSIGNED_SHORT:
            return 2;
        case gl.FLOAT:
        case undefined:
            return 4;
        default:
            throw new Error(`Invalid attribute type (${type})`);
    }
}
//# sourceMappingURL=vaoAttributes.js.map