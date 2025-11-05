"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapBox = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const game_1 = require("../../../client/game");
const dropdown_1 = require("../directives/dropdown");
const icons_1 = require("../../../client/icons");
const ponyInfo_1 = require("../../../common/ponyInfo");
const model_1 = require("../../services/model");
// import { SWAP_TIMEOUT, SECOND } from '../../../common/constants';
let SwapBox = class SwapBox {
    constructor(game, zone, model) {
        this.game = game;
        this.zone = zone;
        this.model = model;
        this.swapIcon = icons_1.faExchangeAlt;
        this.timerIcon = icons_1.faClock;
        this.timeout = false;
    }
    toggleSwapDropdown() {
        this.zone.run(() => setTimeout(() => { }, 10));
    }
    swapPony(pony) {
        this.game.send(server => server.actionParam(11 /* Action.SwapCharacter */, pony.id));
        setTimeout(() => {
            this.dropdown && this.dropdown.close();
            pony.lastUsed = (new Date()).toISOString();
            this.model.sortPonies();
        });
        // if (!this.timeout) {
        // 	this.timeout = true;
        // 	setTimeout(() => this.timeout = false, SWAP_TIMEOUT + SECOND);
        // }
    }
    preview(pony) {
        const info = pony && pony.ponyInfo;
        this.previewInfo = info && (0, ponyInfo_1.toPalette)(info, ponyInfo_1.mockPaletteManager);
    }
};
exports.SwapBox = SwapBox;
tslib_1.__decorate([
    (0, core_1.ViewChild)('dropdown', { static: true }),
    tslib_1.__metadata("design:type", dropdown_1.Dropdown)
], SwapBox.prototype, "dropdown", void 0);
exports.SwapBox = SwapBox = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'swap-box',
        templateUrl: 'swap-box.pug',
        styleUrls: ['swap-box.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame, core_1.NgZone, model_1.Model])
], SwapBox);
//# sourceMappingURL=swap-box.js.map