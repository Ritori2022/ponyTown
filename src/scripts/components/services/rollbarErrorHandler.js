"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollbarErrorHandler = exports.RollbarService = void 0;
exports.rollbarFactory = rollbarFactory;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const Rollbar = tslib_1.__importStar(require("rollbar"));
const data_1 = require("../../client/data");
const hash_1 = require("../../generated/hash");
const rollbarConfig_1 = require("../../generated/rollbarConfig");
const rollbar_1 = require("../../common/rollbar");
const host = typeof location === 'undefined' ? '' : location.host;
const rollbarConfig = {
    environment: rollbarConfig_1.ROLLBAR_ENV,
    accessToken: rollbarConfig_1.ROLLBAR_TOKEN,
    ignoredMessages: ['disconnected'],
    hostWhiteList: [host],
    captureUncaught: true,
    captureUnhandleRejections: true,
    // checkIgnore,
    enabled: true,
    payload: {
        environment: rollbarConfig_1.ROLLBAR_ENV,
        version: data_1.version, // NOTE: workaround for compilation issue
        client: {
            javascript: {
                source_map_enabled: true,
                guess_uncaught_frames: true,
                code_version: hash_1.HASH,
            },
        },
    },
};
exports.RollbarService = new core_1.InjectionToken('rollbar');
function rollbarFactory() {
    if (DEVELOPMENT) {
        return undefined;
    }
    else {
        const rollbar = Rollbar.init(rollbarConfig);
        rollbar.configure({ checkIgnore: rollbar_1.rollbarCheckIgnore });
        return rollbar;
    }
}
let RollbarErrorHandler = class RollbarErrorHandler extends core_1.ErrorHandler {
    constructor(injector) {
        super();
        this.injector = injector;
    }
    handleError(error) {
        super.handleError(error);
        if (!DEVELOPMENT && rollbarConfig.accessToken) {
            const rollbar = this.injector.get(exports.RollbarService);
            const err = error.originalError || error || {};
            if (!(0, rollbar_1.isIgnoredError)(err)) {
                rollbar.error(err);
            }
        }
    }
};
exports.RollbarErrorHandler = RollbarErrorHandler;
exports.RollbarErrorHandler = RollbarErrorHandler = tslib_1.__decorate([
    (0, core_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Injector])
], RollbarErrorHandler);
//# sourceMappingURL=rollbarErrorHandler.js.map