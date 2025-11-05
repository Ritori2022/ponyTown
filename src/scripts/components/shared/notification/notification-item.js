"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationItem = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const game_1 = require("../../../client/game");
const utils_1 = require("../../../common/utils");
const icons_1 = require("../../../client/icons");
const pony_1 = require("../../../common/pony");
let NotificationItem = class NotificationItem {
    constructor(game) {
        this.game = game;
        this.banIcon = icons_1.faBan;
    }
    get isOpen() {
        return this.notification.open;
    }
    set isOpen(value) {
        if (value) {
            this.game.notifications.forEach(n => n.open = false);
        }
        this.notification.open = value;
    }
    get okButton() {
        return (0, utils_1.hasFlag)(this.notification.flags, 1 /* NotificationFlags.Ok */);
    }
    get yesButton() {
        return (0, utils_1.hasFlag)(this.notification.flags, 2 /* NotificationFlags.Yes */);
    }
    get acceptButton() {
        return (0, utils_1.hasFlag)(this.notification.flags, 8 /* NotificationFlags.Accept */);
    }
    get noButton() {
        return (0, utils_1.hasFlag)(this.notification.flags, 4 /* NotificationFlags.No */);
    }
    get rejectButton() {
        return (0, utils_1.hasFlag)(this.notification.flags, 16 /* NotificationFlags.Reject */);
    }
    get ignoreButton() {
        return (0, utils_1.hasFlag)(this.notification.flags, 64 /* NotificationFlags.Ignore */);
    }
    get paletteInfo() {
        return (0, pony_1.getPaletteInfo)(this.notification.pony);
    }
    ngOnDestroy() {
        this.isOpen = false;
    }
    accept() {
        this.game.send(server => server.acceptNotification(this.notification.id));
    }
    reject() {
        this.game.send(server => server.rejectNotification(this.notification.id));
    }
    ignore() {
        this.reject();
        const pony = this.notification.pony;
        if (pony !== this.game.player) {
            this.game.send(server => server.playerAction(pony.id, 1 /* PlayerAction.Ignore */, undefined));
            pony.playerState = (0, utils_1.setFlag)(pony.playerState, 1 /* EntityPlayerState.Ignored */, true);
        }
    }
};
exports.NotificationItem = NotificationItem;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], NotificationItem.prototype, "notification", void 0);
exports.NotificationItem = NotificationItem = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'notification-item',
        templateUrl: 'notification-item.pug',
        styleUrls: ['notification-item.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame])
], NotificationItem);
//# sourceMappingURL=notification-item.js.map