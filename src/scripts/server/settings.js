"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
exports.loadSettings = loadSettings;
exports.saveSettings = saveSettings;
exports.updateSettings = updateSettings;
exports.reloadSettings = reloadSettings;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const utils_1 = require("../common/utils");
const paths = tslib_1.__importStar(require("./paths"));
const defaultSettings = {
    canCreateAccounts: true,
    servers: {},
};
exports.settings = (0, utils_1.cloneDeep)(defaultSettings);
const settingsPath = paths.pathTo('settings', `settings.json`);
/* istanbul ignore next */
async function loadSettings() {
    try {
        const json = await (0, fs_1.readFileAsync)(settingsPath, 'utf8');
        return JSON.parse(json);
    }
    catch {
        return {};
    }
}
/* istanbul ignore next */
async function saveSettings(settings) {
    const json = JSON.stringify(settings, undefined, 2);
    await (0, fs_1.writeFileAsync)(settingsPath, json, 'utf8');
}
/* istanbul ignore next */
async function updateSettings(update) {
    let settings = { ...defaultSettings };
    try {
        settings = await loadSettings();
    }
    catch { }
    Object.assign(settings, update);
    await saveSettings(settings);
}
/* istanbul ignore next */
async function reloadSettings() {
    try {
        const current = await loadSettings();
        Object.assign(exports.settings, current);
    }
    catch { }
}
//# sourceMappingURL=settings.js.map