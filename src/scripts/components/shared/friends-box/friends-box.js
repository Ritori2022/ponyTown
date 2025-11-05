"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsBox = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const icons_1 = require("../../../client/icons");
const model_1 = require("../../services/model");
const game_1 = require("../../../client/game");
const utils_1 = require("../../../common/utils");
const settingsService_1 = require("../../services/settingsService");
let FriendsBox = class FriendsBox {
    constructor(settings, model, game) {
        this.settings = settings;
        this.model = model;
        this.game = game;
        this.friendsIcon = icons_1.faUserFriends;
        this.cogIcon = icons_1.faCog;
        this.addToPartyIcon = icons_1.faUserPlus;
        this.userOptionsIcon = icons_1.faUserCog;
        this.statusIcon = icons_1.faCircle;
        this.sendMessage = new core_1.EventEmitter();
    }
    get friends() {
        return this.model.friends;
    }
    get hidden() {
        return !!this.settings.account.hidden;
    }
    toggleHidden() {
        this.settings.account.hidden = !this.settings.account.hidden;
        this.settings.saveAccountSettings(this.settings.account);
    }
    toggle() {
        this.removing = undefined;
    }
    sendMessageTo(friend) {
        this.sendMessage.emit(friend);
    }
    inviteToParty(friend) {
        this.game.send(server => server.playerAction(friend.entityId, 3 /* PlayerAction.InviteToParty */, undefined));
    }
    remove(friend) {
        this.removing = friend;
    }
    cancelRemove() {
        this.removing = undefined;
    }
    confirmRemove() {
        if (this.removing && this.model.friends) {
            const { accountId } = this.removing;
            this.game.send(server => server.actionParam(22 /* Action.RemoveFriend */, accountId));
            (0, utils_1.removeItem)(this.model.friends, this.removing);
            this.removing = undefined;
        }
    }
    setStatus(status) {
        this.settings.account.hidden = status === 'invisible';
        this.settings.saveAccountSettings(this.settings.account);
    }
};
exports.FriendsBox = FriendsBox;
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], FriendsBox.prototype, "sendMessage", void 0);
exports.FriendsBox = FriendsBox = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'friends-box',
        templateUrl: 'friends-box.pug',
        styleUrls: ['friends-box.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [settingsService_1.SettingsService, model_1.Model, game_1.PonyTownGame])
], FriendsBox);
//# sourceMappingURL=friends-box.js.map