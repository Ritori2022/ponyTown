"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const express_1 = require("express");
const requestUtils_1 = require("../requestUtils");
const reporter_1 = require("../reporter");
const pony_1 = require("../api/pony");
const db_1 = require("../db");
const accountUtils_1 = require("../accountUtils");
const logger_1 = require("../logger");
const admin_1 = require("../api/admin");
const security_1 = require("../../common/security");
const characterUtils_1 = require("../characterUtils");
function default_1(server, settings, removedDocument) {
    const offline = (0, requestUtils_1.offline)(settings);
    const validAccount = (0, requestUtils_1.validAccount)(server);
    const app = (0, express_1.Router)();
    const isSuspiciousName = (0, security_1.createIsSuspiciousName)(settings);
    const isSuspiciousPony = (0, security_1.createIsSuspiciousPony)(settings);
    const savePonyHandler = (0, pony_1.createSavePony)(db_1.findCharacter, db_1.findAuth, db_1.characterCount, accountUtils_1.updateCharacterCount, db_1.createCharacter, logger_1.system, isSuspiciousName, isSuspiciousPony);
    const removePonyHandler = (0, pony_1.createRemovePony)(admin_1.kickFromAllServersByCharacter, db_1.removeCharacter, accountUtils_1.updateCharacterCount, id => removedDocument('ponies', id), characterUtils_1.logRemovedCharacter);
    app.post('/pony/save', offline, requestUtils_1.hash, validAccount, (0, requestUtils_1.wrap)(server, req => savePonyHandler(req.user, req.body.pony, (0, reporter_1.createFromRequest)(server, req))));
    app.post('/pony/remove', offline, requestUtils_1.hash, validAccount, (0, requestUtils_1.wrap)(server, req => removePonyHandler(req.body.id, req.user.id)));
    return app;
}
//# sourceMappingURL=api-pony.js.map