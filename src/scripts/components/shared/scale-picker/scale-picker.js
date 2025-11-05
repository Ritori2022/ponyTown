"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalePicker = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const lodash_1 = require("lodash");
let ScalePicker = class ScalePicker {
    constructor() {
        this.scale = 1;
        this.scaleChange = new core_1.EventEmitter();
        this.scales = [1, 2, 3, 4];
    }
    set maxScale(value) {
        this.scales = (0, lodash_1.times)(value, i => i + 1);
    }
    setScale(value) {
        if (value !== this.scale) {
            this.scale = value;
            this.scaleChange.emit(value);
        }
    }
};
exports.ScalePicker = ScalePicker;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ScalePicker.prototype, "scale", void 0);
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], ScalePicker.prototype, "scaleChange", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Number),
    tslib_1.__metadata("design:paramtypes", [Number])
], ScalePicker.prototype, "maxScale", null);
exports.ScalePicker = ScalePicker = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'scale-picker',
        templateUrl: 'scale-picker.pug',
    })
], ScalePicker);
//# sourceMappingURL=scale-picker.js.map