"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollbarErrorReporter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const Rollbar = tslib_1.__importStar(require("rollbar"));
const rollbar_1 = require("../../common/rollbar");
const rollbarErrorHandler_1 = require("./rollbarErrorHandler");
const errorReporter_1 = require("./errorReporter");
let RollbarErrorReporter = class RollbarErrorReporter extends errorReporter_1.ErrorReporter {
    constructor(rollbar) {
        super();
        this.rollbar = rollbar;
    }
    configureUser(person) {
        if (this.rollbar) {
            this.rollbar.configure({ payload: { person }, checkIgnore: rollbar_1.rollbarCheckIgnore });
        }
    }
    configureData(data) {
        if (this.rollbar) {
            this.rollbar.configure({ payload: data, checkIgnore: rollbar_1.rollbarCheckIgnore });
        }
    }
    captureEvent(data) {
        if (this.rollbar) {
            this.rollbar.captureEvent(data, 'info');
        }
    }
    reportError(error, data) {
        DEVELOPMENT && console.error(error, data);
        if (this.rollbar && !(0, rollbar_1.isIgnoredError)(error)) {
            this.rollbar.error(error, data);
        }
    }
    disable() {
        if (this.rollbar) {
            this.rollbar.configure({ enabled: false });
        }
    }
};
exports.RollbarErrorReporter = RollbarErrorReporter;
exports.RollbarErrorReporter = RollbarErrorReporter = tslib_1.__decorate([
    (0, core_1.Injectable)(),
    tslib_1.__param(0, (0, core_1.Inject)(rollbarErrorHandler_1.RollbarService)),
    tslib_1.__metadata("design:paramtypes", [Object])
], RollbarErrorReporter);
//# sourceMappingURL=rollbarErrorReporter.js.map