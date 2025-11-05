"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationList = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const icons_1 = require("../../../client/icons");
const LIMIT = 8;
let NotificationList = class NotificationList {
    constructor() {
        this.ellipsisIcon = icons_1.faEllipsisV;
        this.start = 0;
    }
    set notificationsLength(value) {
        while (this.start > value) {
            this.prev();
        }
    }
    get limit() {
        return this.start + LIMIT;
    }
    get hasMore() {
        return this.notifications.length > (this.start + this.limit);
    }
    next() {
        this.start += this.limit;
    }
    prev() {
        this.start -= this.start <= LIMIT ? LIMIT : LIMIT - 1;
    }
};
exports.NotificationList = NotificationList;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Array)
], NotificationList.prototype, "notifications", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Number),
    tslib_1.__metadata("design:paramtypes", [Number])
], NotificationList.prototype, "notificationsLength", null);
exports.NotificationList = NotificationList = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'notification-list',
        templateUrl: 'notification-list.pug',
        styleUrls: ['notification-list.scss'],
    })
], NotificationList);
//# sourceMappingURL=notification-list.js.map