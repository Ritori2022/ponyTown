"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyBox = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const game_1 = require("../../../client/game");
const icons_1 = require("../../../client/icons");
const pony_1 = require("../../../common/pony");
let PartyBox = class PartyBox {
    constructor(game) {
        this.game = game;
        this.leaderIcon = icons_1.partyLeaderIcon;
        this.offlineIcon = icons_1.offlineIcon;
    }
    get paletteInfo() {
        return this.member.pony && (0, pony_1.getPaletteInfo)(this.member.pony);
    }
    click() {
        this.game.select(this.member.pony);
    }
};
exports.PartyBox = PartyBox;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], PartyBox.prototype, "member", void 0);
exports.PartyBox = PartyBox = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'party-box',
        templateUrl: 'party-box.pug',
        styleUrls: ['party-box.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame])
], PartyBox);
//# sourceMappingURL=party-box.js.map