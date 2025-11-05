"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionButton = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const game_1 = require("../../../client/game");
const buttonActions_1 = require("../../../client/buttonActions");
const utils_1 = require("../../../common/utils");
let ActionButton = class ActionButton {
    constructor(game) {
        this.game = game;
        this.editable = false;
        this.active = false;
        this.shadow = true;
        this.shortcut = '';
        this.use = new core_1.EventEmitter();
        this.dirty = true;
        this.state = {};
    }
    ngOnInit() {
        game_1.actionButtons.push(this);
    }
    ngOnDestroy() {
        (0, utils_1.removeItem)(game_1.actionButtons, this);
    }
    ngOnChanges() {
        this.dirty = true;
    }
    click() {
        if (this.action) {
            this.use.emit(this.action);
        }
    }
    draw() {
        (0, buttonActions_1.drawAction)(this.canvas.nativeElement, this.action, this.state, this.game);
        this.dirty = false;
    }
};
exports.ActionButton = ActionButton;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "action", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "editable", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "active", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "shadow", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "shortcut", void 0);
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "use", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('canvas', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], ActionButton.prototype, "canvas", void 0);
exports.ActionButton = ActionButton = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'action-button',
        templateUrl: 'action-button.pug',
        styleUrls: ['action-button.scss'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        host: {
            '[class.empty]': '!editable && !action',
        },
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame])
], ActionButton);
//# sourceMappingURL=action-button.js.map