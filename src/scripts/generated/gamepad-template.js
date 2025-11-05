"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAMEPAD_MAPPINGS = exports.GamepadButtons = exports.GamepadAxes = void 0;
exports.gamepad = gamepad;
exports.browser = browser;
exports.index = index;
exports.positive = positive;
exports.positiveNegative = positiveNegative;
exports.axisDirection = axisDirection;
exports.axes = axes;
exports.buttons = buttons;
var GamepadAxes;
(function (GamepadAxes) {
    GamepadAxes[GamepadAxes["LeftStickX"] = 0] = "LeftStickX";
    GamepadAxes[GamepadAxes["LeftStickY"] = 1] = "LeftStickY";
    GamepadAxes[GamepadAxes["RightStickX"] = 2] = "RightStickX";
    GamepadAxes[GamepadAxes["RightStickY"] = 3] = "RightStickY";
    GamepadAxes[GamepadAxes["DpadX"] = 4] = "DpadX";
    GamepadAxes[GamepadAxes["DpadY"] = 5] = "DpadY";
    GamepadAxes[GamepadAxes["LeftTrigger"] = 6] = "LeftTrigger";
    GamepadAxes[GamepadAxes["RightTrigger"] = 7] = "RightTrigger";
})(GamepadAxes || (exports.GamepadAxes = GamepadAxes = {}));
var GamepadButtons;
(function (GamepadButtons) {
    GamepadButtons[GamepadButtons["A"] = 0] = "A";
    GamepadButtons[GamepadButtons["B"] = 1] = "B";
    GamepadButtons[GamepadButtons["X"] = 2] = "X";
    GamepadButtons[GamepadButtons["Y"] = 3] = "Y";
    GamepadButtons[GamepadButtons["Back"] = 4] = "Back";
    GamepadButtons[GamepadButtons["Start"] = 5] = "Start";
    GamepadButtons[GamepadButtons["DpadDown"] = 6] = "DpadDown";
    GamepadButtons[GamepadButtons["DpadLeft"] = 7] = "DpadLeft";
    GamepadButtons[GamepadButtons["DpadRight"] = 8] = "DpadRight";
    GamepadButtons[GamepadButtons["DpadUp"] = 9] = "DpadUp";
    GamepadButtons[GamepadButtons["LeftShoulder"] = 10] = "LeftShoulder";
    GamepadButtons[GamepadButtons["LeftStick"] = 11] = "LeftStick";
    GamepadButtons[GamepadButtons["LeftStickDown"] = 12] = "LeftStickDown";
    GamepadButtons[GamepadButtons["LeftStickLeft"] = 13] = "LeftStickLeft";
    GamepadButtons[GamepadButtons["LeftStickRight"] = 14] = "LeftStickRight";
    GamepadButtons[GamepadButtons["LeftStickUp"] = 15] = "LeftStickUp";
    GamepadButtons[GamepadButtons["LeftTrigger"] = 16] = "LeftTrigger";
    GamepadButtons[GamepadButtons["RightShoulder"] = 17] = "RightShoulder";
    GamepadButtons[GamepadButtons["RightStick"] = 18] = "RightStick";
    GamepadButtons[GamepadButtons["RightStickDown"] = 19] = "RightStickDown";
    GamepadButtons[GamepadButtons["RightStickLeft"] = 20] = "RightStickLeft";
    GamepadButtons[GamepadButtons["RightStickRight"] = 21] = "RightStickRight";
    GamepadButtons[GamepadButtons["RightStickUp"] = 22] = "RightStickUp";
    GamepadButtons[GamepadButtons["RightTrigger"] = 23] = "RightTrigger";
    GamepadButtons[GamepadButtons["Home"] = 24] = "Home";
})(GamepadButtons || (exports.GamepadButtons = GamepadButtons = {}));
function gamepad(name, supported, axes, buttons) {
    return { name, supported, axes, buttons };
}
function browser(browser, id, os) {
    return { browser, id, os };
}
function index(index) {
    return { index };
}
function positive(buttonPositive) {
    return { buttonPositive };
}
function positiveNegative(buttonPositive, buttonNegative) {
    return { buttonPositive, buttonNegative };
}
function axisDirection(axis, direction) {
    return { axis, direction };
}
function axes(lx, ly, rx, ry, dpadX, dpadY, lt, rt) {
    const result = [];
    result[0 /* GamepadAxes.LeftStickX */] = index(lx);
    result[1 /* GamepadAxes.LeftStickY */] = index(ly);
    result[2 /* GamepadAxes.RightStickX */] = index(rx);
    result[3 /* GamepadAxes.RightStickY */] = index(ry);
    result[4 /* GamepadAxes.DpadX */] = dpadX;
    result[5 /* GamepadAxes.DpadY */] = dpadY;
    result[6 /* GamepadAxes.LeftTrigger */] = lt;
    result[7 /* GamepadAxes.RightTrigger */] = rt;
    return result;
}
function buttons(a, b, x, y, back, start, dpad_down, dpad_left, dpad_right, dpad_up, left_shoulder, left_stick, left_stick_down, left_stick_left, left_stick_right, left_stick_up, left_trigger, right_shoulder, right_stick, right_stick_down, right_stick_left, right_stick_right, right_stick_up, right_trigger, home) {
    const result = [];
    result[0 /* GamepadButtons.A */] = index(a);
    result[1 /* GamepadButtons.B */] = index(b);
    result[2 /* GamepadButtons.X */] = index(x);
    result[3 /* GamepadButtons.Y */] = index(y);
    result[4 /* GamepadButtons.Back */] = index(back);
    result[5 /* GamepadButtons.Start */] = index(start);
    result[6 /* GamepadButtons.DpadDown */] = dpad_down;
    result[7 /* GamepadButtons.DpadLeft */] = dpad_left;
    result[8 /* GamepadButtons.DpadRight */] = dpad_right;
    result[9 /* GamepadButtons.DpadUp */] = dpad_up;
    result[10 /* GamepadButtons.LeftShoulder */] = index(left_shoulder);
    result[11 /* GamepadButtons.LeftStick */] = index(left_stick);
    result[12 /* GamepadButtons.LeftStickDown */] = left_stick_down;
    result[13 /* GamepadButtons.LeftStickLeft */] = left_stick_left;
    result[14 /* GamepadButtons.LeftStickRight */] = left_stick_right;
    result[15 /* GamepadButtons.LeftStickUp */] = left_stick_up;
    result[16 /* GamepadButtons.LeftTrigger */] = left_trigger;
    result[17 /* GamepadButtons.RightShoulder */] = index(right_shoulder);
    result[18 /* GamepadButtons.RightStick */] = index(right_stick);
    result[19 /* GamepadButtons.RightStickDown */] = right_stick_down;
    result[20 /* GamepadButtons.RightStickLeft */] = right_stick_left;
    result[21 /* GamepadButtons.RightStickRight */] = right_stick_right;
    result[22 /* GamepadButtons.RightStickUp */] = right_stick_up;
    result[23 /* GamepadButtons.RightTrigger */] = right_trigger;
    result[24 /* GamepadButtons.Home */] = home ? index(home) : undefined;
    return result;
}
exports.GAMEPAD_MAPPINGS = [
/*MAPPINGS*/
];
//# sourceMappingURL=gamepad-template.js.map