"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAclCookie = void 0;
exports.setupPlayer = setupPlayer;
exports.savePlayerPosition = savePlayerPosition;
exports.restorePlayerPosition = restorePlayerPosition;
const utils_1 = require("../common/utils");
const collision_1 = require("../common/collision");
const constants_1 = require("../common/constants");
let currentPlayer;
let setX = 0;
let setY = 0;
function setupPlayer(game, player) {
    const pony = player;
    pony.flags = (0, utils_1.setFlag)(pony.flags, 256 /* EntityFlags.Interactive */, false);
    if ((0, collision_1.isStaticCollision)(player, game.map, false)) {
        (0, collision_1.fixCollision)(player, game.map);
    }
    game.setPlayer(pony);
    currentPlayer = player;
    savePlayerPosition();
}
function savePlayerPosition() {
    if (currentPlayer) {
        setX = currentPlayer.x;
        setY = currentPlayer.y;
    }
}
function restorePlayerPosition() {
    if (currentPlayer) {
        if (currentPlayer.x !== setX || currentPlayer.y !== setY) {
            currentPlayer.x = setX;
            currentPlayer.y = setY;
            DEVELOPMENT && console.warn('Restoring player position');
        }
    }
}
// Account creation lock
const setAclCookie = (acl) => {
    document.cookie = `acl=${acl}; expires=${(0, utils_1.fromNow)(constants_1.WEEK).toUTCString()}; path=/`;
};
exports.setAclCookie = setAclCookie;
//# sourceMappingURL=sec.js.map