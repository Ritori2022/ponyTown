"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.account = account;
exports.character = character;
exports.mock = mock;
exports.entity = entity;
exports.serverEntity = serverEntity;
exports.clientPony = clientPony;
exports.genId = genId;
exports.genObjectId = genObjectId;
exports.mockClient = mockClient;
exports.mockReporter = mockReporter;
exports.mockSubject = mockSubject;
exports.createStubFromInstance = createStubFromInstance;
exports.setupCollider = setupCollider;
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const sinon_1 = require("sinon");
const clientActions_1 = require("../client/clientActions");
const interfaces_1 = require("../common/interfaces");
const serverMap_1 = require("../server/serverMap");
const camera_1 = require("../common/camera");
const worldMap_1 = require("../common/worldMap");
const mixins_1 = require("../common/mixins");
const ag_sockets_1 = require("ag-sockets");
const constants_1 = require("../common/constants");
function auth(item) {
    return item;
}
function account(item) {
    return item;
}
function character(item) {
    return item;
}
function mock(ctor, fields = {}) {
    const object = {};
    const prototype = ctor.prototype;
    Object.getOwnPropertyNames(prototype)
        .filter(key => !Object.getOwnPropertyDescriptor(prototype, key).get && typeof prototype[key] === 'function')
        .forEach(key => object[key] = function () { });
    return Object.assign(object, fields);
}
function entity(id, x = 0, y = 0, type = 0, more = {}) {
    return {
        id, x, y, z: 0, vx: 0, vy: 0, type, order: 0, state: 0, playerState: 0, flags: 0, timestamp: 0,
        options: {}, ...more
    };
}
function serverEntity(id, x = 0, y = 0, type = 0, more = {}) {
    return {
        id, x, y, z: 0, vx: 0, vy: 0, type, order: 0, state: 0, playerState: 0, flags: 0, timestamp: 0,
        options: {}, ...more
    };
}
function clientPony() {
    return mockClient().pony;
}
let id = 1;
let ponyId = 1;
function genId() {
    return (++id).toString(16).padStart(24, '0');
}
function genObjectId() {
    return mongoose_1.Types.ObjectId(genId());
}
function mockClient(fields = {}) {
    const pony = entity(++ponyId, 0, 0, constants_1.PONY_TYPE);
    const accountId = genId();
    const characterId = genId();
    pony.options = {};
    const partial = {
        accountId,
        characterId,
        ignores: new Set(),
        hides: new Set(),
        permaHides: new Set(),
        friends: new Set(),
        accountSettings: {},
        originalRequest: { headers: {} },
        account: { id: accountId, _id: mongoose_1.Types.ObjectId(accountId), ignores: [] },
        character: { id: characterId, _id: mongoose_1.Types.ObjectId(characterId) },
        isMod: false,
        pony,
        map: (0, serverMap_1.createServerMap)('', 0, 1, 1),
        notifications: [],
        regions: [],
        updateQueue: (0, ag_sockets_1.createBinaryWriter)(128),
        regionUpdates: [],
        unsubscribes: [],
        subscribes: [],
        saysQueue: [],
        lastSays: [],
        lastAction: 0,
        lastBoopAction: 0,
        lastExpressionAction: 0,
        viewWidth: 3,
        viewHeight: 3,
        screenSize: { width: 20, height: 20 },
        reporter: mockReporter(),
        camera: (0, camera_1.createCamera)(),
        reportInviteLimit() { },
        disconnect() { },
        ...fields,
    };
    const client = mock(clientActions_1.ClientActions, partial);
    client.pony.client = client;
    return client;
}
function mockReporter() {
    return {
        info() { },
        warn() { },
        warnLog() { },
        danger() { },
        error() { },
        system() { },
        systemLog() { },
        setPony() { },
    };
}
function mockSubject() {
    const values = [];
    return {
        values,
        next(value) {
            values.push(value);
        },
    };
}
function createStubFromInstance(instance) {
    return (0, lodash_1.mapValues)(instance, () => (0, sinon_1.stub)());
}
function setupCollider(map, x, y) {
    const entity = serverEntity(0, x, y, 0);
    (0, mixins_1.mixColliderRect)(-16, -12, 32, 24)(entity, {}, interfaces_1.defaultWorldState);
    (0, worldMap_1.getRegionGlobal)(map, x, y).colliders.push(entity);
}
//# sourceMappingURL=mocks.js.map