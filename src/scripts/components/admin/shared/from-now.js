"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromNow = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const moment = tslib_1.__importStar(require("moment"));
const intervalUpdateService_1 = require("../../services/intervalUpdateService");
let FromNow = class FromNow {
    constructor(element, updateService) {
        this.element = element;
        this.updateService = updateService;
    }
    ngOnChanges() {
        this.moment = this.time ? moment(this.time) : undefined;
        this.update();
    }
    ngOnInit() {
        this.unsubscribe = this.updateService.subscribe(() => this.update());
        this.update();
    }
    ngOnDestroy() {
        this.unsubscribe && this.unsubscribe();
    }
    update() {
        const text = this.moment ? this.moment.fromNow(true).replace('seconds', 'secs') : '';
        if (this.text !== text) {
            this.text = text;
            this.element.nativeElement.children[0].textContent = text;
        }
    }
};
exports.FromNow = FromNow;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], FromNow.prototype, "time", void 0);
exports.FromNow = FromNow = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'from-now',
        template: '<span></span>',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    }),
    tslib_1.__metadata("design:paramtypes", [core_1.ElementRef, intervalUpdateService_1.IntervalUpdateService])
], FromNow);
//# sourceMappingURL=from-now.js.map