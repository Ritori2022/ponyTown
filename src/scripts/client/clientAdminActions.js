"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAdminActions = void 0;
const tslib_1 = require("tslib");
const browser_1 = require("ag-sockets/dist/browser");
class ClientAdminActions {
    constructor(model) {
        this.model = model;
    }
    connected() {
        this.model.initialize(true);
        this.model.connectedToSocket();
    }
    disconnected() {
        this.model.updateTitle();
    }
    updates(updates) {
        for (const { type, id, update } of updates) {
            const model = this.model[type];
            if (model) {
                model.update(id, update);
            }
            else {
                console.error(`Invalid model type "${type}"`);
            }
        }
    }
}
exports.ClientAdminActions = ClientAdminActions;
tslib_1.__decorate([
    (0, browser_1.Method)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", void 0)
], ClientAdminActions.prototype, "updates", null);
//# sourceMappingURL=clientAdminActions.js.map