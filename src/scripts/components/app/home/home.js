"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const model_1 = require("../../services/model");
const ponyHelpers_1 = require("../../../client/ponyHelpers");
const gameService_1 = require("../../services/gameService");
const installService_1 = require("../../services/installService");
let Home = class Home {
    constructor(gameService, model, installService) {
        this.gameService = gameService;
        this.model = model;
        this.installService = installService;
        this.state = (0, ponyHelpers_1.defaultPonyState)();
        this.previewPony = undefined;
    }
    get authError() {
        return this.model.authError;
    }
    get accountAlert() {
        return this.model.accountAlert;
    }
    get canInstall() {
        return this.installService.canInstall;
    }
    get playing() {
        return this.gameService.playing;
    }
    get loading() {
        return this.model.loading || this.model.updating;
    }
    get account() {
        return this.model.account;
    }
    get pony() {
        return this.model.pony;
    }
    get previewInfo() {
        return this.previewPony ? this.previewPony.ponyInfo : this.pony.ponyInfo;
    }
    get previewName() {
        return this.previewPony ? this.previewPony.name : this.pony.name;
    }
    get previewTag() {
        return (0, model_1.getPonyTag)(this.previewPony || this.pony, this.account);
    }
    signIn(provider) {
        this.model.signIn(provider);
    }
};
exports.Home = Home;
exports.Home = Home = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'home',
        templateUrl: 'home.pug',
        styleUrls: ['home.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [gameService_1.GameService,
        model_1.Model,
        installService_1.InstallService])
], Home);
//# sourceMappingURL=home.js.map