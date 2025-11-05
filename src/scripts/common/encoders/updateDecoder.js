"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeVelocity = writeVelocity;
exports.readVelocity = readVelocity;
exports.writeCoordX = writeCoordX;
exports.writeCoordY = writeCoordY;
exports.readCoordX = readCoordX;
exports.readCoordY = readCoordY;
exports.emptyUpdate = emptyUpdate;
exports.decodeUpdate = decodeUpdate;
exports.readOneUpdate = readOneUpdate;
const browser_1 = require("ag-sockets/dist/browser");
const utf8_1 = require("ag-sockets/dist/utf8");
const constants_1 = require("../constants");
function writeVelocity(writer, value) {
    if (value >= constants_1.MAX_VELOCITY || value <= -constants_1.MAX_VELOCITY) {
        throw new Error(`Exceeded max velocity (${value})`);
    }
    (0, browser_1.writeInt16)(writer, (value * 0x8000) / constants_1.MAX_VELOCITY);
}
function readVelocity(reader) {
    return ((0, browser_1.readInt16)(reader) * constants_1.MAX_VELOCITY) / 0x8000;
}
function writeCoordX(writer, value) {
    (0, browser_1.writeInt16)(writer, (value * constants_1.tileWidth) | 0);
}
function writeCoordY(writer, value) {
    (0, browser_1.writeInt16)(writer, (value * constants_1.tileHeight) | 0);
}
function readCoordX(reader) {
    return (0, browser_1.readInt16)(reader) / constants_1.tileWidth;
}
function readCoordY(reader) {
    return (0, browser_1.readInt16)(reader) / constants_1.tileHeight;
}
function emptyUpdate(id) {
    return {
        id,
        x: undefined,
        y: undefined,
        vx: 0,
        vy: 0,
        state: undefined,
        expression: undefined,
        type: undefined,
        options: undefined,
        crc: undefined,
        name: undefined,
        filterName: false,
        info: undefined,
        action: undefined,
        switchRegion: false,
        playerState: undefined,
    };
}
function decodeUpdate(data) {
    const reader = (0, browser_1.createBinaryReader)(data);
    const x = (0, browser_1.readUint16)(reader);
    const y = (0, browser_1.readUint16)(reader);
    const updates = [];
    let update;
    while (update = readOneUpdate(reader)) {
        updates.push(update);
    }
    const removesLength = (0, browser_1.readLength)(reader);
    const removes = [];
    for (let i = 0; i < removesLength; i++) {
        removes.push((0, browser_1.readUint32)(reader));
    }
    const tilesLength = (0, browser_1.readLength)(reader);
    const tiles = [];
    for (let i = 0; i < tilesLength; i++) {
        tiles.push({
            x: (0, browser_1.readUint8)(reader),
            y: (0, browser_1.readUint8)(reader),
            type: (0, browser_1.readUint8)(reader),
        });
    }
    const tileData = (0, browser_1.readUint8Array)(reader);
    return { x, y, updates, removes, tiles, tileData };
}
function readOneUpdate(reader) {
    if (reader.offset >= reader.view.byteLength)
        return undefined;
    const flags = (0, browser_1.readUint16)(reader);
    if (flags === 0) {
        return undefined;
    }
    const id = (0, browser_1.readUint32)(reader);
    const update = emptyUpdate(id);
    update.switchRegion = (flags & 2048 /* UpdateFlags.SwitchRegion */) !== 0;
    if ((flags & 1 /* UpdateFlags.Position */) !== 0) {
        update.x = readCoordX(reader);
        update.y = readCoordY(reader);
    }
    if ((flags & 2 /* UpdateFlags.Velocity */) !== 0) {
        update.vx = readVelocity(reader);
        update.vy = readVelocity(reader);
    }
    if ((flags & 4 /* UpdateFlags.State */) !== 0) {
        update.state = (0, browser_1.readUint8)(reader);
    }
    if ((flags & 8 /* UpdateFlags.Expression */) !== 0) {
        update.expression = (0, browser_1.readUint32)(reader);
    }
    if ((flags & 16 /* UpdateFlags.Type */) !== 0) {
        update.type = (0, browser_1.readUint16)(reader);
    }
    if ((flags & 32 /* UpdateFlags.Options */) !== 0) {
        update.options = (0, browser_1.readObject)(reader);
    }
    if ((flags & 64 /* UpdateFlags.Info */) !== 0) {
        update.crc = (0, browser_1.readUint16)(reader);
        update.info = (0, browser_1.readUint8Array)(reader);
    }
    if ((flags & 128 /* UpdateFlags.Action */) !== 0) {
        update.action = (0, browser_1.readUint8)(reader);
    }
    if ((flags & 256 /* UpdateFlags.Name */) !== 0) {
        update.name = (0, utf8_1.decodeString)((0, browser_1.readUint8Array)(reader)) || undefined;
        update.filterName = (flags & 512 /* UpdateFlags.NameBad */) !== 0;
    }
    if ((flags & 1024 /* UpdateFlags.PlayerState */) !== 0) {
        update.playerState = (0, browser_1.readUint8)(reader);
    }
    return update;
}
//# sourceMappingURL=updateDecoder.js.map