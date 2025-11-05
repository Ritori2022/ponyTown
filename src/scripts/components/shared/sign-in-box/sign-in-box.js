"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInBox = void 0;
exports.getProviderIcon = getProviderIcon;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const data_1 = require("../../../client/data");
const icons_1 = require("../../../client/icons");
function getProviderIcon(id) {
    return icons_1.oauthIcons[id] || icons_1.emptyIcon;
}
let SignInBox = class SignInBox {
    constructor() {
        this.signUpProviders = data_1.signUpProviders;
        this.signInProviders = data_1.signInProviders;
        this.local = data_1.local || DEVELOPMENT;
        this.signIn = new core_1.EventEmitter();
    }
    icon(id) {
        return getProviderIcon(id);
    }
    signInTo(provider) {
        this.signIn.emit(provider);
    }
};
exports.SignInBox = SignInBox;
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], SignInBox.prototype, "signIn", void 0);
exports.SignInBox = SignInBox = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'sign-in-box',
        templateUrl: 'sign-in-box.pug',
        styleUrls: ['sign-in-box.scss'],
    })
], SignInBox);
//# sourceMappingURL=sign-in-box.js.map