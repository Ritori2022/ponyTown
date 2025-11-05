"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const entities = tslib_1.__importStar(require("../../common/entities"));
const db_1 = require("../db");
const entityUtils_1 = require("../entityUtils");
const utils_1 = require("../../common/utils");
const characterUtils_1 = require("../characterUtils");
const camera_1 = require("../../common/camera");
const timing_1 = require("../timing");
const ag_sockets_1 = require("ag-sockets");
class TestController {
    constructor(world, map) {
        this.world = world;
        this.map = map;
        this.clients = [];
        this.initialized = false;
    }
    initialize() {
        if (this.initialized)
            return;
        const world = this.world;
        const map = this.map;
        if (DEVELOPMENT) {
            Promise.all((0, utils_1.times)(10, i => `debug ${i + 1}`).map(name => db_1.Character.findOne({ name }).exec()))
                .then(lodash_1.compact)
                .then(items => items.forEach((item, i) => {
                const name = item.name;
                const tag = i === 0 ? 'mod' : (i === 2 ? 'sup2' : '');
                const extraOptions = i === 0 ? {
                    site: {
                        provider: 'github',
                        name: 'Test name',
                        url: 'https://github.com/Microsoft/TypeScript',
                    }
                } : undefined;
                const p = entities.pony(57 + 1 * i, 47 + 1 * i);
                p.options = { tag };
                (0, entityUtils_1.setEntityName)(p, name);
                p.encryptedInfoSafe = (0, characterUtils_1.encryptInfo)(item.info || '');
                p.client = {
                    map,
                    accountSettings: {},
                    account: { id: 'foobar', name: 'Debug account' },
                    country: 'XY',
                    regions: [],
                    saysQueue: { push() { }, length: 0 },
                    notifications: [],
                    camera: (0, camera_1.createCamera)(),
                    accountId: 'foobar',
                    characterId: '',
                    ignores: new Set(),
                    hides: new Set(),
                    permaHides: new Set(),
                    updateQueue: (0, ag_sockets_1.createBinaryWriter)(1),
                    addEntity() { },
                    addNotification() { },
                    removeNotification() { },
                    updateParty() { },
                    mapUpdate() { },
                };
                p.client.pony = p;
                this.clients.push(p.client);
                p.extraOptions = extraOptions;
                world.addEntity(p, map);
            }));
        }
        this.initialized = true;
    }
    update() {
        (0, timing_1.timingStart)('TestController.update()');
        (0, timing_1.timingEnd)();
    }
    sparseUpdate() {
        (0, timing_1.timingStart)('TestController.sparseUpdate()');
        for (const client of this.clients) {
            for (const notification of client.notifications) {
                notification.accept && notification.accept();
            }
        }
        (0, timing_1.timingEnd)();
    }
}
exports.TestController = TestController;
//# sourceMappingURL=testController.js.map