"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalUpdateService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const utils_1 = require("../../common/utils");
let IntervalUpdateService = class IntervalUpdateService {
    constructor(zone) {
        this.zone = zone;
        this.actions = [];
    }
    subscribe(action) {
        this.actions.push(action);
        if (!this.interval) {
            this.zone.runOutsideAngular(() => {
                this.interval = setInterval(() => {
                    this.actions.forEach(a => a());
                }, 1000 * 10);
            });
        }
        return () => {
            (0, utils_1.removeItem)(this.actions, action);
            if (this.actions.length === 0) {
                clearInterval(this.interval);
                this.interval = undefined;
            }
        };
    }
    toggle(action) {
        let unsubscribe;
        return (on) => {
            if (on && !unsubscribe) {
                unsubscribe = this.subscribe(action);
            }
            else if (!on && unsubscribe) {
                unsubscribe();
                unsubscribe = undefined;
            }
        };
    }
};
exports.IntervalUpdateService = IntervalUpdateService;
exports.IntervalUpdateService = IntervalUpdateService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    }),
    tslib_1.__metadata("design:paramtypes", [core_1.NgZone])
], IntervalUpdateService);
//# sourceMappingURL=intervalUpdateService.js.map