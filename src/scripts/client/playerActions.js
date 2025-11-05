"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleActionCommand = handleActionCommand;
exports.upAction = upAction;
exports.downAction = downAction;
exports.sitAction = sitAction;
exports.standAction = standAction;
exports.lieAction = lieAction;
exports.flyAction = flyAction;
exports.boopAction = boopAction;
exports.turnHeadAction = turnHeadAction;
exports.interact = interact;
exports.toggleWall = toggleWall;
exports.editorSelectEntities = editorSelectEntities;
exports.editorDragEntities = editorDragEntities;
exports.editorMoveEntities = editorMoveEntities;
const utils_1 = require("../common/utils");
const pony_1 = require("../common/pony");
const entityUtils_1 = require("../common/entityUtils");
const constants_1 = require("../common/constants");
const stringUtils_1 = require("../common/stringUtils");
const worldMap_1 = require("../common/worldMap");
const rect_1 = require("../common/rect");
const positionUtils_1 = require("../common/positionUtils");
const entities_1 = require("../common/entities");
function handleActionCommand(message, game) {
    if ((0, utils_1.isCommand)(message)) {
        const { command = '' } = (0, utils_1.processCommand)(message);
        const player = game.player;
        if (DEVELOPMENT) {
            if (command === 'spammessages') {
                let i = 0;
                setInterval(() => game.send(server => server.say(0, (0, stringUtils_1.randomString)(5) + ` #${i++}`, 0 /* ChatType.Say */)), 100);
                return true;
            }
        }
        switch (command.toLowerCase()) {
            case 'testerrorreporting':
                throw new Error('test error');
            case 'disablepixelratio':
                game.togglePixelRatio();
                return true;
            case 'lie':
            case 'lay':
                if (player) {
                    if ((0, entityUtils_1.isPonyLying)(player)) {
                        sitAction(player, game);
                    }
                    else {
                        lieAction(player, game);
                    }
                }
                return true;
            case 'sit':
                if (player) {
                    if ((0, entityUtils_1.isPonyFlying)(player)) {
                        standAction(player, game);
                    }
                    else {
                        sitAction(player, game);
                    }
                }
                return true;
            case 'stand':
                if (player) {
                    standAction(player, game);
                }
                return true;
            case 'fly':
                if (player) {
                    if ((0, entityUtils_1.isPonyFlying)(player)) {
                        standAction(player, game);
                    }
                    else {
                        flyAction(player, game);
                    }
                }
                return true;
        }
    }
    return false;
}
function upAction(game) {
    const player = game.player;
    if (player) {
        if ((0, entityUtils_1.isPonyLying)(player)) {
            sitAction(player, game);
        }
        else if ((0, entityUtils_1.isPonySitting)(player)) {
            standAction(player, game);
        }
        else if ((0, entityUtils_1.isPonyStanding)(player)) {
            flyAction(player, game);
        }
    }
}
function downAction(game) {
    const player = game.player;
    if (player) {
        if ((0, entityUtils_1.isPonySitting)(player)) {
            lieAction(player, game);
        }
        else if ((0, entityUtils_1.isPonyStanding)(player)) {
            sitAction(player, game);
        }
        else if ((0, entityUtils_1.isPonyFlying)(player)) {
            standAction(player, game);
        }
    }
}
function sitAction(player, game) {
    if ((0, pony_1.canPonySit)(player, game.map) && game.send(server => server.action(6 /* Action.Sit */))) {
        player.state = (0, entityUtils_1.setPonyState)(player.state, 48 /* EntityState.PonySitting */);
        game.stateOverride = 48 /* EntityState.PonySitting */;
        game.onActionsUpdate.next();
    }
}
function standAction(player, game) {
    if ((0, pony_1.canPonyStand)(player, game.map) && game.send(server => server.action(10 /* Action.Stand */))) {
        player.state = (0, entityUtils_1.setPonyState)(player.state, 0 /* EntityState.PonyStanding */);
        game.stateOverride = 0 /* EntityState.PonyStanding */;
        game.onActionsUpdate.next();
    }
}
function lieAction(player, game) {
    if ((0, pony_1.canPonyLie)(player, game.map) && game.send(server => server.action(7 /* Action.Lie */))) {
        player.state = (0, entityUtils_1.setPonyState)(player.state, 64 /* EntityState.PonyLying */);
        game.stateOverride = 64 /* EntityState.PonyLying */;
        game.onActionsUpdate.next();
    }
}
function flyAction(player, game) {
    if ((0, pony_1.canPonyFlyUp)(player) && game.send(server => server.action(8 /* Action.Fly */))) {
        player.state = (0, entityUtils_1.setPonyState)(player.state, 80 /* EntityState.PonyFlying */);
        player.inTheAirDelay = constants_1.FLY_DELAY;
        game.stateOverride = 80 /* EntityState.PonyFlying */;
        game.onActionsUpdate.next();
    }
}
function boopAction(game) {
    if (game.player && (0, entityUtils_1.canBoop)(game.player) && game.send(server => server.action(1 /* Action.Boop */))) {
        (0, pony_1.doBoopPonyAction)(game, game.player);
    }
}
function turnHeadAction(game) {
    if (game.player && game.send(server => server.action(2 /* Action.TurnHead */))) {
        game.player.state = game.player.state ^ 4 /* EntityState.HeadTurned */;
        game.headTurnedOverride = (0, utils_1.hasFlag)(game.player.state, 4 /* EntityState.HeadTurned */);
        game.onActionsUpdate.next();
    }
}
function interact(game, shift) {
    const player = game.player;
    if (player) {
        const bounds = (0, entityUtils_1.getInteractBounds)(player);
        const entities = (0, worldMap_1.pickEntitiesByRect)(game.map, bounds, true, false);
        const center = (0, rect_1.centerPoint)(bounds);
        center.x += (bounds.w / 4) * ((0, entityUtils_1.isFacingRight)(player) ? -1 : 1);
        const entity = (0, entityUtils_1.closestEntity)((0, positionUtils_1.pointToWorld)(center), entities);
        if (entity && (0, entityUtils_1.entityInRange)(entity, player)) {
            game.send(server => server.interact(entity.id));
        }
        else if (player.hold === entities_1.hammer.type) {
            game.changePlaceEntity(shift);
        }
        else if (player.hold === entities_1.shovel.type) {
            game.changePlaceTile(shift);
        }
        else if (player.ponyState.holding && (0, utils_1.hasFlag)(player.ponyState.holding.flags, 8 /* EntityFlags.Usable */)) {
            game.send(server => server.use());
        }
    }
}
function toggleWall(game, hover) {
    const x = hover.x | 0;
    const y = hover.y | 0;
    const dx = hover.x - x;
    const dy = hover.y - y;
    if (dx > dy) {
        if ((dx + dy) < 1) {
            game.send(server => server.changeTile(x, y, 100 /* TileType.WallH */));
        }
        else {
            game.send(server => server.changeTile(x + 1, y, 101 /* TileType.WallV */));
        }
    }
    else {
        if ((dx + dy) < 1) {
            game.send(server => server.changeTile(x, y, 101 /* TileType.WallV */));
        }
        else {
            game.send(server => server.changeTile(x, y + 1, 100 /* TileType.WallH */));
        }
    }
}
function editorSelectEntities(game, hover, shift) {
    game.apply(() => {
        const entities = (0, worldMap_1.pickAnyEntities)(game.map, hover);
        if (shift) {
            const entity = entities.filter(e => !(0, utils_1.includes)(game.editor.selectedEntities, e))[0];
            entity && game.editor.selectedEntities.push(entity);
        }
        else {
            const index = entities.findIndex(e => (0, utils_1.includes)(game.editor.selectedEntities, e));
            const entity = entities[(index + 1) % entities.length];
            game.editor.selectedEntities = entity ? [entity] : [];
        }
    });
}
function editorDragEntities(game, hover, buttonPressed) {
    if (buttonPressed) {
        const dx = hover.x - game.editor.draggingStart.x;
        const dy = hover.y - game.editor.draggingStart.y;
        game.editor.selectedEntities.forEach(e => {
            e.x = (0, positionUtils_1.roundPositionX)(e.draggingStart.x + dx);
            e.y = (0, positionUtils_1.roundPositionY)(e.draggingStart.y + dy);
        });
    }
    else {
        game.apply(() => game.editor.draggingEntities = false);
        game.send(server => server.editorAction({
            type: 'move',
            entities: game.editor.selectedEntities.map(({ id, x, y }) => ({ id, x, y })),
        }));
    }
}
function editorMoveEntities(game, hover) {
    game.editor.draggingEntities = true;
    game.editor.draggingStart = hover;
    game.editor.selectedEntities.forEach(e => e.draggingStart = (0, utils_1.point)(e.x, e.y));
}
//# sourceMappingURL=playerActions.js.map