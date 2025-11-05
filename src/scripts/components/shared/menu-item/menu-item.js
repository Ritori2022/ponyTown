"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const icons_1 = require("../../../client/icons");
let MenuItem = class MenuItem {
    constructor() {
        this.icon = icons_1.emptyIcon;
    }
};
exports.MenuItem = MenuItem;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], MenuItem.prototype, "route", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], MenuItem.prototype, "icon", void 0);
exports.MenuItem = MenuItem = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'menu-item',
        templateUrl: 'menu-item.pug',
        styleUrls: ['menu-item.scss'],
    })
], MenuItem);
//# sourceMappingURL=menu-item.js.map