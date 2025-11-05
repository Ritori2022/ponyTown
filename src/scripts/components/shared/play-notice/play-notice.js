"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayNotice = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const data_1 = require("../../../client/data");
const constants_1 = require("../../../common/constants");
let PlayNotice = class PlayNotice {
    constructor() {
        this.patreonLink = data_1.supporterLink;
        this.rules = constants_1.GENERAL_RULES;
    }
};
exports.PlayNotice = PlayNotice;
exports.PlayNotice = PlayNotice = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'play-notice',
        templateUrl: 'play-notice.pug',
    })
], PlayNotice);
//# sourceMappingURL=play-notice.js.map