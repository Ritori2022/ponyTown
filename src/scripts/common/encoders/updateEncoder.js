"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeOneUpdate = writeOneUpdate;
exports.writeOneEntity = writeOneEntity;
exports.writeUpdate = writeUpdate;
exports.writeRegion = writeRegion;
exports.encodeUpdateSimple = encodeUpdateSimple;
exports.encodeRegionSimple = encodeRegionSimple;
const browser_1 = require("ag-sockets/dist/browser");
const binaryUtils_1 = require("../binaryUtils");
const entityUtils_1 = require("../../server/entityUtils");
const serverRegion_1 = require("../../server/serverRegion");
const updateDecoder_1 = require("./updateDecoder");
const playerUtils_1 = require("../../server/playerUtils");
const logger_1 = require("../../server/logger");
function getOptionsOrUndefined(entity) {
    return (entity.options !== undefined && Object.keys(entity.options).length > 0) ? entity.options : undefined;
}
function writeOneUpdate(writer, entity, flags, x, y, vx, vy, options, action, playerState) {
    if (DEVELOPMENT && flags === 0) {
        logger_1.logger.error(`Writing empty update`);
    }
    if ((flags & 1 /* UpdateFlags.Position */) !== 0) {
        flags |= 4 /* UpdateFlags.State */;
        if (vx || vy) {
            flags |= 2 /* UpdateFlags.Velocity */;
        }
    }
    if ((flags & 256 /* UpdateFlags.Name */) !== 0 && entity.nameBad === true) {
        flags |= 512 /* UpdateFlags.NameBad */;
    }
    (0, browser_1.writeUint16)(writer, flags);
    (0, browser_1.writeUint32)(writer, entity.id);
    if ((flags & 1 /* UpdateFlags.Position */) !== 0) {
        (0, updateDecoder_1.writeCoordX)(writer, x);
        (0, updateDecoder_1.writeCoordY)(writer, y);
    }
    if ((flags & 2 /* UpdateFlags.Velocity */) !== 0) {
        (0, updateDecoder_1.writeVelocity)(writer, vx);
        (0, updateDecoder_1.writeVelocity)(writer, vy);
    }
    if ((flags & 4 /* UpdateFlags.State */) !== 0) {
        (0, browser_1.writeUint8)(writer, entity.state);
    }
    if ((flags & 8 /* UpdateFlags.Expression */) !== 0) {
        (0, browser_1.writeUint32)(writer, entity.options.expr);
    }
    if ((flags & 16 /* UpdateFlags.Type */) !== 0) {
        (0, browser_1.writeUint16)(writer, entity.type);
    }
    if ((flags & 32 /* UpdateFlags.Options */) !== 0) {
        (0, browser_1.writeObject)(writer, options);
    }
    if ((flags & 64 /* UpdateFlags.Info */) !== 0) {
        (0, browser_1.writeUint16)(writer, entity.crc);
        (0, browser_1.writeUint8Array)(writer, entity.encryptedInfoSafe);
    }
    if ((flags & 128 /* UpdateFlags.Action */) !== 0) {
        (0, browser_1.writeUint8)(writer, action);
    }
    if ((flags & 256 /* UpdateFlags.Name */) !== 0) {
        (0, browser_1.writeUint8Array)(writer, entity.encodedName);
    }
    if ((flags & 1024 /* UpdateFlags.PlayerState */) !== 0) {
        (0, browser_1.writeUint8)(writer, playerState);
    }
}
function writeOneEntity(writer, entity, client) {
    const { x, y, vx, vy } = entity;
    // TODO: const expression = !!entity.options && !!entity.options.expr; // instead of in options
    const options = getOptionsOrUndefined(entity);
    const playerState = (0, playerUtils_1.getPlayerState)(client, entity);
    let flags = 1 /* UpdateFlags.Position */ | 4 /* UpdateFlags.State */ | 16 /* UpdateFlags.Type */;
    if (entity.encryptedInfoSafe !== undefined) {
        flags |= 64 /* UpdateFlags.Info */;
    }
    if (entity.encodedName !== undefined) {
        flags |= 256 /* UpdateFlags.Name */;
    }
    if (playerState !== 0) {
        flags |= 1024 /* UpdateFlags.PlayerState */;
    }
    if (options !== undefined) {
        flags |= 32 /* UpdateFlags.Options */;
    }
    writeOneUpdate(writer, entity, flags, x, y, vx, vy, options, 0 /* Action.None */, playerState);
}
function writeUpdate(writer, region) {
    const { x, y, entityUpdates, entityRemoves, tileUpdates } = region;
    (0, browser_1.writeUint16)(writer, x);
    (0, browser_1.writeUint16)(writer, y);
    for (const { entity, flags, x, y, vx, vy, options, action, playerState } of entityUpdates) {
        writeOneUpdate(writer, entity, flags, x, y, vx, vy, options, action, playerState);
    }
    (0, browser_1.writeUint16)(writer, 0); // end marker
    (0, browser_1.writeLength)(writer, entityRemoves.length);
    for (const remove of entityRemoves) {
        (0, browser_1.writeUint32)(writer, remove);
    }
    (0, browser_1.writeLength)(writer, tileUpdates.length);
    for (const { x, y, type: tile } of tileUpdates) {
        (0, browser_1.writeUint8)(writer, x);
        (0, browser_1.writeUint8)(writer, y);
        (0, browser_1.writeUint8)(writer, tile);
    }
    (0, browser_1.writeUint8Array)(writer, null); // tile data
}
function writeRegion(writer, region, client) {
    const { x, y, entities } = region;
    (0, browser_1.writeUint16)(writer, x);
    (0, browser_1.writeUint16)(writer, y);
    for (const entity of entities) {
        if (!(0, entityUtils_1.isEntityShadowed)(entity) || entity === client.pony) {
            writeOneEntity(writer, entity, client);
        }
    }
    (0, browser_1.writeUint16)(writer, 0); // end marker
    (0, browser_1.writeLength)(writer, 0); // removes
    (0, browser_1.writeLength)(writer, 0); // tile updates
    (0, browser_1.writeUint8Array)(writer, (0, serverRegion_1.getRegionTiles)(region)); // tile data
}
// For testing
function encodeUpdateSimple(region) {
    return (0, binaryUtils_1.writeBinary)(writer => writeUpdate(writer, region));
}
// For testing
function encodeRegionSimple(region, client) {
    return (0, binaryUtils_1.writeBinary)(writer => writeRegion(writer, region, client));
}
//# sourceMappingURL=updateEncoder.js.map