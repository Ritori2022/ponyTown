"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteLinks = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SiteLinks = class SiteLinks {
    constructor() {
        this.links = [];
    }
};
exports.SiteLinks = SiteLinks;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Array)
], SiteLinks.prototype, "links", void 0);
exports.SiteLinks = SiteLinks = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'site-links',
        templateUrl: 'site-links.pug',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], SiteLinks);
//# sourceMappingURL=site-links.js.map