"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEncodeUpdate = resetEncodeUpdate;
exports.subscribeToRegionsInRange = subscribeToRegionsInRange;
exports.unsubscribeFromOutOfRangeRegions = unsubscribeFromOutOfRangeRegions;
exports.unsubscribeFromAllRegions = unsubscribeFromAllRegions;
exports.getExpectedRegion = getExpectedRegion;
exports.updateRegion = updateRegion;
exports.updateRegions = updateRegions;
exports.commitRegionUpdates = commitRegionUpdates;
exports.transferToRegion = transferToRegion;
exports.addToRegion = addToRegion;
exports.removeFromRegion = removeFromRegion;
exports.isSubscribedToRegion = isSubscribedToRegion;
exports.sparseRegionUpdate = sparseRegionUpdate;
exports.setupTiming = setupTiming;
exports.clearTiming = clearTiming;
const ag_sockets_1 = require("ag-sockets");
const utils_1 = require("../common/utils");
const serverRegion_1 = require("./serverRegion");
const entityUtils_1 = require("./entityUtils");
const updateEncoder_1 = require("../common/encoders/updateEncoder");
const positionUtils_1 = require("../common/positionUtils");
const camera_1 = require("../common/camera");
const timing_1 = require("./timing");
const worldMap_1 = require("../common/worldMap");
const logger_1 = require("./logger");
const constants_1 = require("../common/constants");
let updatesBuffer = new ArrayBuffer(4096);
let updatesBufferOffset = 0;
function resetEncodeUpdate() {
    updatesBufferOffset = 0;
}
function resizeUpdatesBuffer(e) {
    if ((0, entityUtils_1.isOverflowError)(e)) {
        updatesBuffer = new ArrayBuffer(updatesBuffer.byteLength * 2);
        updatesBufferOffset = 0;
        DEVELOPMENT && logger_1.logger.debug(`resize buffer to ${updatesBuffer.byteLength} (${e.message})`);
    }
    else {
        throw e;
    }
}
function createUpdatesWriter() {
    const buffer = new Uint8Array(updatesBuffer, updatesBufferOffset, updatesBuffer.byteLength - updatesBufferOffset);
    return (0, ag_sockets_1.createBinaryWriter)(buffer);
}
function commitUpdatesWriter(writer) {
    const result = (0, ag_sockets_1.getWriterBuffer)(writer);
    updatesBufferOffset += result.byteLength;
    return result;
}
function encodeUpdate(region) {
    (0, timing_1.timingStart)('encodeUpdate()');
    let result;
    while (true) {
        try {
            const writer = createUpdatesWriter();
            (0, updateEncoder_1.writeUpdate)(writer, region);
            result = commitUpdatesWriter(writer);
            break;
        }
        catch (e) {
            resizeUpdatesBuffer(e);
        }
    }
    (0, timing_1.timingEnd)();
    return result;
}
function encodeRegion(region, client) {
    (0, timing_1.timingStart)('encodeRegion()');
    let result;
    while (true) {
        try {
            const writer = createUpdatesWriter();
            (0, updateEncoder_1.writeRegion)(writer, region, client);
            result = commitUpdatesWriter(writer);
            break;
        }
        catch (e) {
            resizeUpdatesBuffer(e);
        }
    }
    (0, timing_1.timingEnd)();
    return result;
}
function subscribeToRegionsInRange(client) {
    (0, timing_1.timingStart)('subscribeToRegionsInRange()');
    const { map, camera } = client;
    const maxX = (0, utils_1.clamp)(Math.floor((0, positionUtils_1.toWorldX)(camera.x + camera.w) / constants_1.REGION_SIZE) + 1, 0, map.regionsX - 1);
    const maxY = (0, utils_1.clamp)(Math.floor((0, positionUtils_1.toWorldY)(camera.y + camera.h) / constants_1.REGION_SIZE) + 1, 0, map.regionsY - 1);
    const minX = (0, utils_1.clamp)(Math.floor((0, positionUtils_1.toWorldX)(camera.x) / constants_1.REGION_SIZE) - 1, 0, maxX);
    const minY = (0, utils_1.clamp)(Math.floor((0, positionUtils_1.toWorldY)(camera.y) / constants_1.REGION_SIZE) - 1, 0, maxY);
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const region = (0, worldMap_1.getRegion)(map, x, y);
            if ((0, camera_1.isRectVisible)(camera, region.subscribeBounds)) {
                if (!isSubscribedToRegion(client, region)) {
                    (0, timing_1.timingStart)('subscribeToRegion()');
                    region.clients.push(client);
                    client.regions.push(region);
                    client.subscribes.push(encodeRegion(region, client));
                    (0, timing_1.timingEnd)();
                }
            }
        }
    }
    (0, timing_1.timingEnd)();
}
function unsubscribeFromOutOfRangeRegions(client) {
    (0, timing_1.timingStart)('unsubscribeFromOutOfRangeRegions()');
    const regions = client.regions;
    for (let i = regions.length - 1; i >= 0; i--) {
        const region = regions[i];
        if (!(0, camera_1.isRectVisible)(client.camera, region.unsubscribeBounds)) {
            if ((0, utils_1.includes)(region.entities, client.pony)) {
                DEVELOPMENT && logger_1.logger.warn(`Trying to unsubscribe client from region they are in`);
            }
            else {
                (0, utils_1.removeItem)(region.clients, client);
                regions.splice(i, 1);
                client.unsubscribes.push(region.x, region.y);
            }
        }
    }
    (0, timing_1.timingEnd)();
}
function unsubscribeFromAllRegions(client, silent) {
    for (const region of client.regions) {
        (0, utils_1.removeItem)(region.clients, client);
        if (!silent) {
            client.unsubscribes.push(region.x, region.y);
        }
    }
    client.regions = [];
}
function getExpectedRegion({ x, y, flags, region }, map) {
    if (region !== undefined && (flags & 1 /* EntityFlags.Movable */) !== 0 && (0, utils_1.pointInRect)(x, y, region.boundsWithBorder)) {
        return region;
    }
    else {
        const rx = (0, utils_1.clamp)(Math.floor(x / constants_1.REGION_SIZE), 0, map.regionsX - 1) | 0;
        const ry = (0, utils_1.clamp)(Math.floor(y / constants_1.REGION_SIZE), 0, map.regionsY - 1) | 0;
        return map.regions[(rx + ((ry * map.regionsX) | 0)) | 0];
    }
}
function updateRegion(entity, map) {
    const expectedRegion = getExpectedRegion(entity, map);
    if (expectedRegion !== entity.region) {
        transferToRegion(entity, expectedRegion, map);
    }
}
const moves = [];
function updateRegions(maps) {
    (0, timing_1.timingStart)('updateRegions()');
    moves.length = 0;
    // TODO: only update changed entities
    (0, timing_1.timingStart)('getExpectedRegion');
    for (const map of maps) {
        for (const region of map.regions) {
            for (const entity of region.movables) {
                const expectedRegion = getExpectedRegion(entity, map);
                if (expectedRegion !== entity.region) {
                    moves.push({ entity, region: expectedRegion, map });
                }
            }
        }
    }
    (0, timing_1.timingEnd)();
    (0, timing_1.timingStart)('transferToRegion');
    for (const { entity, region, map } of moves) {
        transferToRegion(entity, region, map);
    }
    (0, timing_1.timingEnd)();
    moves.length = 0;
    (0, timing_1.timingEnd)();
}
function commitRegionUpdates(regions) {
    (0, timing_1.timingStart)('commitRegionUpdates()');
    for (const region of regions) {
        if (region.entityUpdates.length || region.entityRemoves.length || region.tileUpdates.length) {
            if (region.clients.length) {
                const data = encodeUpdate(region);
                for (const client of region.clients) {
                    client.regionUpdates.push(data);
                }
            }
            (0, serverRegion_1.resetRegionUpdates)(region);
        }
    }
    (0, timing_1.timingEnd)();
}
function transferToRegion(entity, region, map) {
    const oldRegion = entity.region;
    if (oldRegion) {
        (0, serverRegion_1.removeEntityFromRegion)(oldRegion, entity, map);
        (0, entityUtils_1.updateEntity)(entity, true);
    }
    entity.region = region;
    (0, serverRegion_1.addEntityToRegion)(region, entity, map);
    if (!(0, entityUtils_1.isEntityShadowed)(entity)) {
        for (const client of region.clients) {
            if (!oldRegion || !isSubscribedToRegion(client, oldRegion)) {
                (0, entityUtils_1.pushAddEntityToClient)(client, entity);
            }
        }
    }
}
function addToRegion(entity, region, map) {
    entity.region = region;
    (0, serverRegion_1.addEntityToRegion)(region, entity, map);
    if ((0, entityUtils_1.isEntityShadowed)(entity)) {
        (0, entityUtils_1.pushAddEntityToClient)(entity.client, entity);
    }
    else {
        for (const client of region.clients) {
            (0, entityUtils_1.pushAddEntityToClient)(client, entity);
        }
    }
}
function removeFromRegion(entity, region, map) {
    const removed = (0, serverRegion_1.removeEntityFromRegion)(region, entity, map);
    (0, serverRegion_1.pushRemoveEntityToRegion)(region, entity);
    return removed;
}
function isSubscribedToRegion(client, region) {
    return (0, utils_1.includes)(client.regions, region);
}
function sparseRegionUpdate(map, region, options) {
    if (options.restoreTerrain) {
        (0, serverRegion_1.tickTilesRestoration)(map, region);
    }
}
// timing helpers
function writingTiming() {
    (0, timing_1.timingStart)('write');
}
function sendingTiming() {
    (0, timing_1.timingEnd)();
    (0, timing_1.timingStart)('send');
}
function doneTiming() {
    (0, timing_1.timingEnd)();
}
function noop() {
}
function setupTiming(client) {
    if (client.__internalHooks) {
        client.__internalHooks.writing = writingTiming;
        client.__internalHooks.sending = sendingTiming;
        client.__internalHooks.done = doneTiming;
    }
}
function clearTiming(client) {
    if (client.__internalHooks) {
        client.__internalHooks.writing = noop;
        client.__internalHooks.sending = noop;
        client.__internalHooks.done = noop;
    }
}
//# sourceMappingURL=regionUtils.js.map