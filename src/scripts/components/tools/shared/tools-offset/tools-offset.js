"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsOffset = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const icons_1 = require("../../../../client/icons");
let ToolsOffset = class ToolsOffset {
    constructor() {
        this.rightIcon = icons_1.faChevronRight;
        this.leftIcon = icons_1.faChevronLeft;
        this.upIcon = icons_1.faChevronUp;
        this.downIcon = icons_1.faChevronDown;
        this.change = new core_1.EventEmitter();
    }
    moveX(value) {
        if (this.offset) {
            this.offset.x += value;
            this.change.emit();
        }
    }
    moveY(value) {
        if (this.offset) {
            this.offset.y += value;
            this.change.emit();
        }
    }
};
exports.ToolsOffset = ToolsOffset;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ToolsOffset.prototype, "offset", void 0);
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], ToolsOffset.prototype, "change", void 0);
exports.ToolsOffset = ToolsOffset = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'tools-offset',
        templateUrl: 'tools-offset.pug',
        styleUrls: ['tools-offset.scss'],
    })
], ToolsOffset);
//# sourceMappingURL=tools-offset.js.map