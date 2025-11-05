"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PonyInfo = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const utils_1 = require("../../../../common/utils");
const security_1 = require("../../../../common/security");
const adminModel_1 = require("../../../services/adminModel");
let PonyInfo = class PonyInfo {
    constructor(model) {
        this.model = model;
        this.highlight = false;
        this.labelClass = 'badge-none';
    }
    get isBadCM() {
        return !!this.pony && (0, utils_1.hasFlag)(this.pony.flags, 1 /* CharacterFlags.BadCM */);
    }
    ngOnChanges() {
        if (this.pony) {
            if ((0, security_1.isForbiddenName)(this.pony.name)) {
                this.labelClass = 'badge-forbidden';
            }
            else if ((0, utils_1.hasFlag)(this.pony.flags, 1 /* CharacterFlags.BadCM */)) {
                this.labelClass = 'badge-danger';
            }
            else {
                this.labelClass = 'badge-none';
            }
        }
    }
    onShown() {
        if (this.pony && !this.pony.ponyInfo && !this.promise) {
            this.promise = this.model.getPonyInfo(this.pony)
                .finally(() => this.promise = undefined);
        }
    }
    click() {
        console.log(this.pony);
    }
};
exports.PonyInfo = PonyInfo;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], PonyInfo.prototype, "pony", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], PonyInfo.prototype, "highlight", void 0);
exports.PonyInfo = PonyInfo = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'pony-info',
        templateUrl: 'pony-info.pug',
        styleUrls: ['pony-info.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [adminModel_1.AdminModel])
], PonyInfo);
//# sourceMappingURL=pony-info.js.map