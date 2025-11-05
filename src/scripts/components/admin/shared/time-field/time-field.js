"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeField = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let TimeField = class TimeField {
};
exports.TimeField = TimeField;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], TimeField.prototype, "time", void 0);
exports.TimeField = TimeField = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'time-field',
        templateUrl: 'time-field.pug',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], TimeField);
//# sourceMappingURL=time-field.js.map