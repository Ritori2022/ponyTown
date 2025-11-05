"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTooltip = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const adminUtils_1 = require("../../../../common/adminUtils");
const year = (new Date()).getFullYear();
let AccountTooltip = class AccountTooltip {
    constructor() {
        this.extendedAuths = false;
    }
    get age() {
        return this.account.birthdate ? (0, adminUtils_1.getAge)(this.account.birthdate) : '-';
    }
    get forceAge() {
        return this.account.birthyear ? (year - this.account.birthyear) : '';
    }
};
exports.AccountTooltip = AccountTooltip;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], AccountTooltip.prototype, "account", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], AccountTooltip.prototype, "extendedAuths", void 0);
exports.AccountTooltip = AccountTooltip = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'account-tooltip',
        templateUrl: 'account-tooltip.pug',
    })
], AccountTooltip);
//# sourceMappingURL=account-tooltip.js.map