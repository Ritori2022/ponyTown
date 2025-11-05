"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseController = void 0;
const utils_1 = require("../../common/utils");
const MOUSE_BUTTONS = [302 /* Key.MOUSE_BUTTON1 */, 304 /* Key.MOUSE_BUTTON3 */, 303 /* Key.MOUSE_BUTTON2 */];
class MouseController {
    constructor(manager) {
        this.manager = manager;
        this.initialized = false;
        this.mousemove = (e) => {
            if (this.element) {
                const rect = this.element.getBoundingClientRect();
                this.manager.setValue(300 /* Key.MOUSE_X */, Math.floor(e.clientX - rect.left));
                this.manager.setValue(301 /* Key.MOUSE_Y */, Math.floor(e.clientY - rect.top));
            }
        };
        this.mousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.manager.usingTouch = false;
            const button = MOUSE_BUTTONS[e.button];
            if (button) {
                this.manager.setValue(button, 1);
            }
        };
        this.mouseup = (e) => {
            const button = MOUSE_BUTTONS[e.button];
            if (button) {
                this.manager.setValue(button, 0);
            }
        };
        this.mousewheel = (e) => {
            this.manager.addValue(305 /* Key.MOUSE_WHEEL_X */, (0, utils_1.clamp)(e.deltaX, -1, 1));
            this.manager.addValue(306 /* Key.MOUSE_WHEEL_Y */, (0, utils_1.clamp)(e.deltaY, -1, 1));
        };
        this.contextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        this.click = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        this.blur = () => {
            for (const button of MOUSE_BUTTONS) {
                this.manager.setValue(button, 0);
            }
        };
    }
    initialize(element) {
        if (!this.initialized) {
            this.initialized = true;
            this.element = element;
            element.addEventListener('mousemove', this.mousemove);
            element.addEventListener('mousedown', this.mousedown);
            element.addEventListener('mouseup', this.mouseup);
            element.addEventListener('mousewheel', this.mousewheel);
            element.addEventListener('wheel', this.mousewheel);
            element.addEventListener('contextmenu', this.contextmenu);
            element.addEventListener('click', this.click);
            window.addEventListener('blur', this.blur);
        }
    }
    release() {
        this.initialized = false;
        if (this.element) {
            this.element.removeEventListener('mousemove', this.mousemove);
            this.element.removeEventListener('mousedown', this.mousedown);
            this.element.removeEventListener('mouseup', this.mouseup);
            this.element.removeEventListener('mousewheel', this.mousewheel);
            this.element.removeEventListener('wheel', this.mousewheel);
            this.element.removeEventListener('contextmenu', this.contextmenu);
            this.element.removeEventListener('click', this.click);
            this.element = undefined;
        }
        window.removeEventListener('blur', this.blur);
    }
    update() {
    }
    clear() {
    }
}
exports.MouseController = MouseController;
//# sourceMappingURL=mouse.js.map