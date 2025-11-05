"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const express_1 = require("express");
const requestUtils_1 = require("../requestUtils");
const game_1 = require("../api/game");
const internal_1 = require("../internal");
const db_1 = require("../db");
const internal_2 = require("../internal");
const originUtils_1 = require("../originUtils");
function default_1(server, settings, config) {
    const offline = (0, requestUtils_1.offline)(settings);
    const validAccount = (0, requestUtils_1.validAccount)(server);
    const join = (0, internal_2.createJoin)();
    const app = (0, express_1.Router)();
    let inQueue = 0;
    const joinGame = (0, game_1.createJoinGame)(internal_1.findServer, config, db_1.findCharacter, join, originUtils_1.addOrigin, db_1.hasActiveSupporterInvites);
    app.post('/game/join', offline, (0, requestUtils_1.limit)(60, 5 * 60), requestUtils_1.hash, validAccount, (0, requestUtils_1.wrap)(server, async (req) => {
        if (inQueue > 100) {
            return {};
        }
        else {
            try {
                inQueue++;
                const { ponyId, serverId, version, url, alert } = req.body;
                return await joinGame(req.user, ponyId, serverId, version, url, alert, (0, originUtils_1.getOrigin)(req));
            }
            finally {
                inQueue--;
            }
        }
    }));
    return app;
}
//# sourceMappingURL=api-game.js.map