"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsModal = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const buttonActions_1 = require("../../../client/buttonActions");
const sprites = tslib_1.__importStar(require("../../../generated/sprites"));
const clientUtils_1 = require("../../../client/clientUtils");
const colors_1 = require("../../../common/colors");
const icons_1 = require("../../../client/icons");
const spriteUtils_1 = require("../../../client/spriteUtils");
const utils_1 = require("../../../common/utils");
const game_1 = require("../../../client/game");
const model_1 = require("../../services/model");
function eyeSprite(e) {
    return (0, spriteUtils_1.createEyeSprite)(e, 0, sprites.defaultPalette);
}
let ActionsModal = class ActionsModal {
    constructor(game) {
        this.game = game;
        this.lockIcon = icons_1.faLock;
        this.actionsIcon = icons_1.faApple;
        this.expressionsIcon = icons_1.faLaughBeam;
        this.chatIcon = icons_1.faComment;
        this.optionsIcon = icons_1.faCog;
        this.devIcon = icons_1.faCogs;
        this.dev = BETA;
        this.close = new core_1.EventEmitter();
        this.actions = (0, buttonActions_1.createButtionActionActions)();
        this.commands = (0, buttonActions_1.createButtonCommandActions)();
        this.emoteAction = (0, buttonActions_1.expressionButtonAction)((0, clientUtils_1.createExpression)(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 0 /* Muzzle.Smile */));
        this.entityAction = (0, buttonActions_1.entityButtonAction)('apple');
        this.entityActions = [];
        this.entityName = 'apple';
        this.lockEyes = true;
        this.lockIrises = true;
        this.eyesLeft = sprites.eyeLeft.map(e => e && e[0]).map(eyeSprite);
        this.eyesRight = sprites.eyeRight.map(e => e && e[0]).map(eyeSprite);
        this.irisesLeft = (0, utils_1.times)(8 /* Iris.COUNT */, i => (0, spriteUtils_1.createEyeSprite)(sprites.eyeLeft[1][0], i, sprites.defaultPalette));
        this.irisesRight = (0, utils_1.times)(8 /* Iris.COUNT */, i => (0, spriteUtils_1.createEyeSprite)(sprites.eyeRight[1][0], i, sprites.defaultPalette));
        this.muzzles = sprites.noses
            .map(n => n[0][0])
            .map(({ color, colors, mouth }) => ({
            color, colors, extra: mouth, palettes: [buttonActions_1.actionExpressionDefaultPalette.colors]
        }));
        this.noseFills = [colors_1.ACTION_EXPRESSION_BG];
        this.noseOutlines = [(0, colors_1.fillToOutline)(colors_1.ACTION_EXPRESSION_BG)];
        this.coatFill = colors_1.ACTION_EXPRESSION_BG;
        this.eyeColor = colors_1.ACTION_EXPRESSION_EYE_COLOR;
        this.muzzle = 0;
        this.eyeLeft = 1;
        this.eyeRight = 1;
        this.irisLeft = 0;
        this.irisRight = 0;
        this.tabIndex = 0;
        this.blush = false;
        this.sleeping = false;
        this.tears = false;
        this.crying = false;
        this.hearts = false;
        this.activeTab = 'right-eye';
        this.interval = 0;
        this.actionsToUndo = [];
        this.updateEmoteAction();
    }
    ngOnInit() {
        document.body.classList.add('actions-modal-opened');
        this.game.editingActions = true;
        this.interval = setInterval(() => this.game.send(server => server.action(21 /* Action.KeepAlive */)), 10000);
        this.subscription = this.game.onLeft.subscribe(() => this.ok());
        if (BETA) {
            this.entityActions = (0, model_1.getEntityNames)().map(name => (0, buttonActions_1.entityButtonAction)(name));
        }
    }
    ngOnDestroy() {
        document.body.classList.remove('actions-modal-opened');
        this.game.editingActions = false;
        clearInterval(this.interval);
        this.subscription && this.subscription.unsubscribe();
    }
    ok() {
        this.close.emit();
    }
    changed(locked) {
        if (locked) {
            this.eyeLeft = this.eyeRight;
        }
        if (this.lockIrises) {
            this.irisLeft = this.irisRight;
        }
        this.updateEmoteAction();
    }
    drop(action) {
        if (action.type === 'expression' && action.expression) {
            const e = action.expression;
            this.lockEyes = e.right === e.left;
            this.lockIrises = e.rightIris === e.leftIris;
            this.eyeRight = e.right;
            this.eyeLeft = e.left;
            this.muzzle = e.muzzle;
            this.irisRight = e.rightIris;
            this.irisLeft = e.leftIris;
            this.blush = (0, utils_1.hasFlag)(e.extra, 1 /* ExpressionExtra.Blush */);
            this.sleeping = (0, utils_1.hasFlag)(e.extra, 2 /* ExpressionExtra.Zzz */);
            this.tears = (0, utils_1.hasFlag)(e.extra, 8 /* ExpressionExtra.Tears */);
            this.crying = (0, utils_1.hasFlag)(e.extra, 4 /* ExpressionExtra.Cry */);
            this.hearts = (0, utils_1.hasFlag)(e.extra, 16 /* ExpressionExtra.Hearts */);
            this.changed(this.lockEyes);
        }
    }
    updateEmoteAction() {
        const extra = (this.blush ? 1 /* ExpressionExtra.Blush */ : 0) |
            (this.sleeping ? 2 /* ExpressionExtra.Zzz */ : 0) |
            (this.tears ? 8 /* ExpressionExtra.Tears */ : 0) |
            (this.crying ? 4 /* ExpressionExtra.Cry */ : 0) |
            (this.hearts ? 16 /* ExpressionExtra.Hearts */ : 0);
        const expression = (0, clientUtils_1.createExpression)(this.eyeRight, this.eyeLeft, this.muzzle, this.irisRight, this.irisLeft, extra);
        this.emoteAction = (0, buttonActions_1.expressionButtonAction)(expression);
    }
    resetToDefault() {
        this.actionsToUndo.push(this.game.actions);
        this.game.actions = [...(0, buttonActions_1.createDefaultButtonActions)(), { action: undefined }];
    }
    clearActionBar() {
        this.actionsToUndo.push(this.game.actions);
        this.game.actions = this.game.actions.map(() => ({ action: undefined }));
    }
    undo() {
        if (this.actionsToUndo.length) {
            this.game.actions = this.actionsToUndo.pop();
        }
    }
    updateEntity() {
        if (BETA) {
            this.entityAction = (0, buttonActions_1.entityButtonAction)(this.entityName);
        }
    }
    export() {
        const data = (0, buttonActions_1.serializeActions)(this.game.actions);
        saveAs(new Blob([data], { type: 'text/plain;charset=utf-8' }), `pony-town-actions.json`);
    }
    async import(file) {
        if (file) {
            const text = await (0, clientUtils_1.readFileAsText)(file);
            this.game.actions = (0, buttonActions_1.deserializeActions)(text);
            this.game.editingActions = false;
            setTimeout(() => this.game.editingActions = true, 500);
        }
    }
};
exports.ActionsModal = ActionsModal;
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], ActionsModal.prototype, "close", void 0);
exports.ActionsModal = ActionsModal = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'actions-modal',
        templateUrl: 'actions-modal.pug',
        styleUrls: ['actions-modal.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame])
], ActionsModal);
//# sourceMappingURL=actions-modal.js.map