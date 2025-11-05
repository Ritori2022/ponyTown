"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageLoader = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const icons_1 = require("../../../client/icons");
const model_1 = require("../../services/model");
const clientUtils_1 = require("../../../client/clientUtils");
let PageLoader = class PageLoader {
    constructor(model) {
        this.model = model;
        this.spinnerIcon = icons_1.faSpinner;
    }
    get loading() {
        return this.model.loading;
    }
    get updating() {
        return this.model.updating;
    }
    get updatingTakesLongTime() {
        return this.model.updatingTakesLongTime;
    }
    get loadingError() {
        return this.model.loadingError;
    }
    reload() {
        (0, clientUtils_1.hardReload)();
    }
};
exports.PageLoader = PageLoader;
exports.PageLoader = PageLoader = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'page-loader',
        templateUrl: 'page-loader.pug',
        styleUrls: ['page-loader.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [model_1.Model])
], PageLoader);
//# sourceMappingURL=page-loader.js.map