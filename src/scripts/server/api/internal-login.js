"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalLoginApi = exports.createUpdateLiveSettings = exports.createLoginServerStats = exports.createLoginServerState = void 0;
exports.createLoginServerStatus = createLoginServerStatus;
const internal_common_1 = require("./internal-common");
const merge_1 = require("./merge");
function createLoginServerStatus(settings, live) {
    return {
        canCreateAccounts: !!settings.canCreateAccounts,
        isPageOffline: !!settings.isPageOffline,
        blockWebView: !!settings.blockWebView,
        reportPotentialDuplicates: !!settings.reportPotentialDuplicates,
        autoMergeDuplicates: !!settings.autoMergeDuplicates,
        suspiciousNames: settings.suspiciousNames || '',
        suspiciousAuths: settings.suspiciousAuths || '',
        suspiciousPonies: settings.suspiciousPonies || '',
        suspiciousMessages: settings.suspiciousMessages || '',
        suspiciousSafeMessages: settings.suspiciousSafeMessages || '',
        suspiciousSafeWholeMessages: settings.suspiciousSafeWholeMessages || '',
        suspiciousSafeInstantMessages: settings.suspiciousSafeInstantMessages || '',
        suspiciousSafeInstantWholeMessages: settings.suspiciousSafeInstantWholeMessages || '',
        updating: live.updating,
        dead: false,
    };
}
const createLoginServerState = (settings, live) => async () => createLoginServerStatus(settings, live);
exports.createLoginServerState = createLoginServerState;
const createLoginServerStats = (statsTracker) => async () => statsTracker.getStats();
exports.createLoginServerStats = createLoginServerStats;
const createUpdateLiveSettings = (liveSettings) => async (update) => {
    Object.assign(liveSettings, update);
};
exports.createUpdateLiveSettings = createUpdateLiveSettings;
const createInternalLoginApi = (settings, live, statsTracker, reloadSettings, removedDocument) => ({
    reloadSettings: (0, internal_common_1.createReloadSettings)(reloadSettings),
    state: (0, exports.createLoginServerState)(settings, live),
    loginServerStats: (0, exports.createLoginServerStats)(statsTracker),
    updateLiveSettings: (0, exports.createUpdateLiveSettings)(live),
    mergeAccounts: async (id, withId, reason, allowAdmin, creatingDuplicates) => {
        if (live.shutdown) {
            throw new Error(`Cannot merge while server is shutdown`);
        }
        await (0, merge_1.mergeAccounts)(id, withId, reason, removedDocument, allowAdmin, creatingDuplicates);
    },
});
exports.createInternalLoginApi = createInternalLoginApi;
//# sourceMappingURL=internal-login.js.map