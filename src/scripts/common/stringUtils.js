"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codesBuffer = void 0;
exports.randomString = randomString;
exports.isSurrogate = isSurrogate;
exports.isLowSurrogate = isLowSurrogate;
exports.fromSurrogate = fromSurrogate;
exports.charsToCodes = charsToCodes;
exports.stringToCodes = stringToCodes;
exports.stringToCodesTemp = stringToCodesTemp;
exports.matcher = matcher;
exports.isVisibleChar = isVisibleChar;
const lowercaseCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789_';
const uppercaseCharacters = lowercaseCharacters + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CARRIAGERETURN = '\r'.charCodeAt(0);
function randomString(length, useUpperCase = false) {
    const characters = useUpperCase ? uppercaseCharacters : lowercaseCharacters;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[(Math.random() * characters.length) | 0];
    }
    return result;
}
function isSurrogate(code) {
    return code >= 0xd800 && code <= 0xdbff;
}
function isLowSurrogate(code) {
    return (code & 0xfc00) === 0xdc00;
}
function fromSurrogate(high, low) {
    return (((high & 0x3ff) << 10) + (low & 0x3ff) + 0x10000) | 0;
}
function charsToCodes(text) {
    const chars = [];
    for (let i = 0; i < text.length; i++) {
        let code = text.charCodeAt(i);
        if (isSurrogate(code) && (i + 1) < text.length) {
            const extra = text.charCodeAt(i + 1);
            if (isLowSurrogate(extra)) {
                code = fromSurrogate(code, extra);
                i++;
            }
        }
        chars.push(code);
    }
    return chars;
}
function stringToCodes(buffer, text) {
    const textLength = text.length | 0;
    let length = 0 | 0;
    for (let i = 0; i < textLength; i = (i + 1) | 0) {
        let code = text.charCodeAt(i) | 0;
        if (isSurrogate(code) && ((i + 1) | 0) < textLength) {
            const extra = text.charCodeAt(i + 1) | 0;
            if (isLowSurrogate(extra)) {
                code = fromSurrogate(code, extra) | 0;
                i = (i + 1) | 0;
            }
        }
        if (isVisibleChar(code)) {
            buffer[length] = code;
            length = (length + 1) | 0;
        }
    }
    return length;
}
exports.codesBuffer = new Uint32Array(32);
function stringToCodesTemp(text) {
    while (text.length > exports.codesBuffer.length) {
        exports.codesBuffer = new Uint32Array(exports.codesBuffer.length * 2);
    }
    return stringToCodes(exports.codesBuffer, text);
}
function matcher(regex) {
    return (text) => !!text && regex.test(text);
}
function isVisibleChar(code) {
    return code !== CARRIAGERETURN && !(code >= 0xfe00 && code <= 0xfe0f);
}
//# sourceMappingURL=stringUtils.js.map