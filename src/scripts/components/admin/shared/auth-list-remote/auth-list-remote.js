"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthListRemote = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const adminModel_1 = require("../../../services/adminModel");
let AuthListRemote = class AuthListRemote {
    constructor(model) {
        this.model = model;
        this.limit = 6;
        this.extended = false;
        this.auths = [];
        this.loading = false;
    }
    get accountId() {
        return this._accountId;
    }
    set accountId(value) {
        if (this.accountId !== value) {
            this._accountId = value;
            this.auths = [];
            this.loading = true;
            this.subscription && this.subscription.unsubscribe();
            this.subscription = value ? this.model.accountAuths.subscribe(value, auths => {
                this.auths = auths || [];
                this.loading = false;
            }) : undefined;
        }
    }
    ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
    }
};
exports.AuthListRemote = AuthListRemote;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], AuthListRemote.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], AuthListRemote.prototype, "extended", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], AuthListRemote.prototype, "accountId", null);
exports.AuthListRemote = AuthListRemote = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'auth-list-remote',
        templateUrl: 'auth-list-remote.pug',
        styleUrls: ['auth-list-remote.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [adminModel_1.AdminModel])
], AuthListRemote);
//# sourceMappingURL=auth-list-remote.js.map