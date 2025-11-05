"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginInfoRemote = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const adminModel_1 = require("../../../services/adminModel");
let OriginInfoRemote = class OriginInfoRemote {
    constructor(model) {
        this.model = model;
        this.showName = false;
    }
    get originIP() {
        return this._originIP;
    }
    set originIP(value) {
        if (this.originIP !== value) {
            this._originIP = value;
            this.origin = undefined;
            this.subscription && this.subscription.unsubscribe();
            this.subscription = value ? this.model.origins.subscribe(value, origin => this.origin = origin) : undefined;
        }
    }
    ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
    }
};
exports.OriginInfoRemote = OriginInfoRemote;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], OriginInfoRemote.prototype, "showName", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], OriginInfoRemote.prototype, "originIP", null);
exports.OriginInfoRemote = OriginInfoRemote = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'origin-info-remote',
        templateUrl: 'origin-info-remote.pug',
    }),
    tslib_1.__metadata("design:paramtypes", [adminModel_1.AdminModel])
], OriginInfoRemote);
//# sourceMappingURL=origin-info-remote.js.map