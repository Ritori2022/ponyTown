"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthList = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let AuthList = class AuthList {
    constructor() {
        this.limit = 6;
        this.extended = false;
    }
    get fixedAuths() {
        return this.auths || [];
    }
};
exports.AuthList = AuthList;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], AuthList.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], AuthList.prototype, "extended", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Array)
], AuthList.prototype, "auths", void 0);
exports.AuthList = AuthList = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'auth-list',
        templateUrl: 'auth-list.pug',
        styleUrls: ['auth-list.scss'],
        host: {
            '[class.extended]': 'extended',
        },
    })
], AuthList);
//# sourceMappingURL=auth-list.js.map