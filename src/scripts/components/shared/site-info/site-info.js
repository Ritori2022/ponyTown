"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteInfo = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const clientUtils_1 = require("../../../client/clientUtils");
const sign_in_box_1 = require("../sign-in-box/sign-in-box");
let SiteInfo = class SiteInfo {
    set site(value) {
        this.info = value && (0, clientUtils_1.toSocialSiteInfo)(value);
        this.icon = (0, sign_in_box_1.getProviderIcon)(this.info && this.info.icon || '');
    }
};
exports.SiteInfo = SiteInfo;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], SiteInfo.prototype, "site", null);
exports.SiteInfo = SiteInfo = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'site-info',
        templateUrl: 'site-info.pug',
        styleUrls: ['site-info.scss'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], SiteInfo);
//# sourceMappingURL=site-info.js.map