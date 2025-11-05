"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const tslib_1 = require("tslib");
const express_1 = require("express");
const requestUtils_1 = require("../requestUtils");
const api_account_1 = tslib_1.__importDefault(require("./api-account"));
const api_pony_1 = tslib_1.__importDefault(require("./api-pony"));
const api_game_1 = tslib_1.__importDefault(require("./api-game"));
function default_1(server, settings, config, removedDocument) {
    const app = (0, express_1.Router)();
    app.use(requestUtils_1.auth);
    app.use((0, api_account_1.default)(server, settings));
    app.use((0, api_pony_1.default)(server, settings, removedDocument));
    app.use((0, api_game_1.default)(server, settings, config));
    return app;
}
//# sourceMappingURL=api.js.map