"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgAutoFocus = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let AgAutoFocus = class AgAutoFocus {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        setTimeout(() => this.element.nativeElement.focus(), 100);
    }
};
exports.AgAutoFocus = AgAutoFocus;
exports.AgAutoFocus = AgAutoFocus = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[agAutoFocus]'
    }),
    tslib_1.__metadata("design:paramtypes", [core_1.ElementRef])
], AgAutoFocus);
//# sourceMappingURL=agAutoFocus.js.map