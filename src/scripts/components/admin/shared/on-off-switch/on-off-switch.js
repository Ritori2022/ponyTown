"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnOffSwitch = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let OnOffSwitch = class OnOffSwitch {
    constructor() {
        this.on = false;
        this.disabled = false;
        this.onText = 'ON';
        this.offText = 'OFF';
        this.label = '';
        this.toggle = new core_1.EventEmitter();
    }
    onToggle(value) {
        if (value !== this.on) {
            this.toggle.emit(value);
        }
    }
};
exports.OnOffSwitch = OnOffSwitch;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], OnOffSwitch.prototype, "on", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], OnOffSwitch.prototype, "disabled", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], OnOffSwitch.prototype, "onText", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], OnOffSwitch.prototype, "offText", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], OnOffSwitch.prototype, "label", void 0);
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], OnOffSwitch.prototype, "toggle", void 0);
exports.OnOffSwitch = OnOffSwitch = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'on-off-switch',
        templateUrl: 'on-off-switch.pug',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], OnOffSwitch);
//# sourceMappingURL=on-off-switch.js.map