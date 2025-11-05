"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardController = void 0;
const utils_1 = require("../../common/utils");
const firefox = !SERVER && /firefox/i.test(navigator.userAgent);
function isKeyEventInvalid(e) {
    return e.target && /^(input|textarea|select)$/i.test(e.target.tagName);
}
function allowKey(key) {
    return key === 27 /* Key.ESCAPE */ || key === 116 /* Key.F5 */ || key === 123 /* Key.F12 */ || key === 122 /* Key.F11 */ || key === 9 /* Key.TAB */;
}
function fixKeyCode(key) {
    if (firefox) {
        if (key === 173)
            return 189 /* Key.DASH */;
        if (key === 61)
            return 187 /* Key.EQUALS */;
    }
    return key;
}
const iosKeyToKeyCode = {
    UIKeyInputEscape: 27 /* Key.ESCAPE */,
    UIKeyInputUpArrow: 38 /* Key.UP */,
    UIKeyInputLeftArrow: 37 /* Key.LEFT */,
    UIKeyInputRightArrow: 39 /* Key.RIGHT */,
    UIKeyInputDownArrow: 40 /* Key.DOWN */,
};
const iosHandledKeyCodes = [27 /* Key.ESCAPE */, 38 /* Key.UP */, 37 /* Key.LEFT */, 39 /* Key.RIGHT */, 40 /* Key.DOWN */];
class KeyboardController {
    constructor(manager) {
        this.manager = manager;
        this.initialized = false;
        this.stack = [];
        this.keydown = (e) => {
            if (!this.manager.disabledKeyboard && !isKeyEventInvalid(e)) {
                const code = fixKeyCode(e.keyCode);
                this.manager.setValue(code, 1);
                if (!allowKey(code)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (!(0, utils_1.includes)(this.stack, code) && !(0, utils_1.includes)(iosHandledKeyCodes, code)) {
                    this.stack.push(code);
                }
            }
        };
        this.keyup = (e) => {
            let code = fixKeyCode(e.keyCode);
            // fix keyCode on iOS bluetooth keyboard
            if (code === 0) {
                code = iosKeyToKeyCode[e.key] || 0;
                if (code === 0) {
                    code = this.stack.pop() || 0;
                }
            }
            if (this.manager.setValue(code, 0)) {
                e.preventDefault();
                e.stopPropagation();
            }
            (0, utils_1.removeItem)(this.stack, code);
        };
        this.blur = () => {
            this.manager.clear();
        };
    }
    initialize() {
        if (!this.initialized) {
            this.initialized = true;
            window.addEventListener('keydown', this.keydown);
            window.addEventListener('keyup', this.keyup);
            window.addEventListener('blur', this.blur);
        }
    }
    release() {
        this.initialized = false;
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.removeEventListener('blur', this.blur);
        this.clear();
    }
    update() {
    }
    clear() {
        this.stack.length = 0;
    }
}
exports.KeyboardController = KeyboardController;
//# sourceMappingURL=keyboard.js.map