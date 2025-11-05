"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNotification = addNotification;
exports.removeNotification = removeNotification;
exports.resetGameFields = resetGameFields;
exports.markGameAsLoaded = markGameAsLoaded;
exports.isSelected = isSelected;
const utils_1 = require("../common/utils");
function addNotification({ notifications }, notification) {
    const open = notifications.length === 0;
    notifications.push(notification);
    setTimeout(() => {
        notification.open = open;
        notification.fresh = false;
    }, 500);
}
function removeNotification({ notifications }, id) {
    const notification = (0, utils_1.removeById)(notifications, id);
    if (notification && notification.open && notifications.length) {
        notifications[0].open = true;
    }
}
function resetGameFields(game) {
    game.loaded = false;
    game.placeInQueue = 0;
    game.playerId = undefined;
    game.playerName = undefined;
    game.playerInfo = undefined;
    game.playerCRC = undefined;
    game.party = undefined;
    game.whisperTo = undefined;
    game.messageQueue = [];
    game.lastWhisperFrom = undefined;
    game.onPartyUpdate.next();
    game.fallbackPonies.clear();
}
function markGameAsLoaded(game) {
    if (!game.loaded) {
        game.loaded = true;
        game.fullyLoaded = false;
        setTimeout(() => game.fullyLoaded = true, 300);
    }
}
function isSelected(game, id) {
    return game.selected && game.selected.id === id;
}
//# sourceMappingURL=gameUtils.js.map