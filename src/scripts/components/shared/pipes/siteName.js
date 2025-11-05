"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteNamePipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SiteNamePipe = class SiteNamePipe {
    transform(value) {
        const match = String(value || '').match(/(\w+)\.com/);
        return match && match[1];
    }
};
exports.SiteNamePipe = SiteNamePipe;
exports.SiteNamePipe = SiteNamePipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'siteName',
    })
], SiteNamePipe);
//# sourceMappingURL=siteName.js.map