"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyInfoRemote = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const adminModel_1 = require("../../../services/adminModel");
let PonyInfoRemote = class PonyInfoRemote {
    constructor(model) {
        this.model = model;
        this.highlight = false;
        this.showName = false;
    }
    get ponyId() {
        return this._ponyId;
    }
    set ponyId(value) {
        if (this.ponyId !== value) {
            this._ponyId = value;
            this.pony = undefined;
            this.subscription && this.subscription.unsubscribe();
            this.subscription = value ? this.model.ponies.subscribe(value, pony => this.pony = pony) : undefined;
        }
    }
    ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
    }
};
exports.PonyInfoRemote = PonyInfoRemote;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], PonyInfoRemote.prototype, "highlight", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], PonyInfoRemote.prototype, "showName", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], PonyInfoRemote.prototype, "ponyId", null);
exports.PonyInfoRemote = PonyInfoRemote = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'pony-info-remote',
        templateUrl: 'pony-info-remote.pug',
    }),
    tslib_1.__metadata("design:paramtypes", [adminModel_1.AdminModel])
], PonyInfoRemote);
//# sourceMappingURL=pony-info-remote.js.map