"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KbdKey = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let KbdKey = class KbdKey {
};
exports.KbdKey = KbdKey;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], KbdKey.prototype, "title", void 0);
exports.KbdKey = KbdKey = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'kbd-key',
        templateUrl: 'kbd-key.pug',
    })
], KbdKey);
//# sourceMappingURL=kbd-key.js.map