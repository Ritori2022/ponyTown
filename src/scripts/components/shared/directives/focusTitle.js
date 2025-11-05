"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusTitle = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let FocusTitle = class FocusTitle {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        setTimeout(() => this.element.nativeElement.focus());
    }
};
exports.FocusTitle = FocusTitle;
exports.FocusTitle = FocusTitle = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[focusTitle]',
        host: {
            'tabindex': '-1',
        },
    }),
    tslib_1.__metadata("design:paramtypes", [core_1.ElementRef])
], FocusTitle);
//# sourceMappingURL=focusTitle.js.map