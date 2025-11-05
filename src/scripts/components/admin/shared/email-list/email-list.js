"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailList = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let EmailList = class EmailList {
    constructor() {
        this.limit = 3;
    }
    get hasMore() {
        return this.emails && this.emails.length > this.limit;
    }
    showMore() {
        this.limit = 9999;
    }
};
exports.EmailList = EmailList;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Array)
], EmailList.prototype, "emails", void 0);
exports.EmailList = EmailList = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'email-list',
        templateUrl: 'email-list.pug',
    })
], EmailList);
//# sourceMappingURL=email-list.js.map