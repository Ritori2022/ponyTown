"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsRange = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const icons_1 = require("../../../../client/icons");
let ToolsRange = class ToolsRange {
    constructor() {
        this.rightIcon = icons_1.faChevronRight;
        this.leftIcon = icons_1.faChevronLeft;
        this.upIcon = icons_1.faChevronUp;
        this.downIcon = icons_1.faChevronDown;
        this.min = 0;
        this.max = 100;
        this.vertical = false;
        this.small = false;
        this.change = new core_1.EventEmitter();
        this._value = 0;
        this.propagateChange = () => { };
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.propagateChange(value);
        this.change.emit();
    }
    decrement() {
        if (this.value > this.min) {
            this.value = this.value - 1;
        }
    }
    increment() {
        if (this.value < this.max) {
            this.value = this.value + 1;
        }
    }
    writeValue(value) {
        if (value !== undefined) {
            this.value = value;
        }
    }
    registerOnChange(callback) {
        this.propagateChange = callback;
    }
    registerOnTouched() {
    }
};
exports.ToolsRange = ToolsRange;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ToolsRange.prototype, "min", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ToolsRange.prototype, "max", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ToolsRange.prototype, "vertical", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ToolsRange.prototype, "small", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], ToolsRange.prototype, "placeholder", void 0);
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], ToolsRange.prototype, "change", void 0);
exports.ToolsRange = ToolsRange = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'tools-range',
        templateUrl: 'tools-range.pug',
        styleUrls: ['tools-range.scss'],
        providers: [
            { provide: forms_1.NG_VALUE_ACCESSOR, useExisting: (0, core_1.forwardRef)(() => ToolsRange), multi: true },
        ],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], ToolsRange);
//# sourceMappingURL=tools-range.js.map