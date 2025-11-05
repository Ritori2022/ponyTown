"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.log = log;
exports.formatMessage = formatMessage;
exports.systemMessage = systemMessage;
exports.system = system;
exports.admin = admin;
exports.logPatreon = logPatreon;
exports.logServer = logServer;
exports.logPerformance = logPerformance;
exports.chat = chat;
const tslib_1 = require("tslib");
const tracer_1 = require("tracer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const interfaces_1 = require("../common/interfaces");
const commands_1 = require("./commands");
const playerUtils_1 = require("./playerUtils");
const paths_1 = require("./paths");
const { reset, gray, magenta, cyan, green, yellow, red } = chalk_1.default;
function format(color) {
    //'[{{timestamp}}] [{{title}}] {{message}} ({{file}}:{{line}})',
    return [
        reset('['),
        gray('{{timestamp}}'),
        reset('] ['),
        color('{{title}}'),
        reset('] {{message}} '),
        gray('({{file}}:{{line}})'),
    ].join('');
}
exports.logger = (0, tracer_1.console)({
    level: 0,
    dateformat: 'mmm dd HH:MM:ss',
    format: [
        format(reset),
        {
            trace: format(cyan),
            debug: format(magenta),
            info: format(green),
            warn: format(yellow),
            error: format(red),
        }
    ],
});
const daily = (0, tracer_1.dailyfile)({
    root: (0, paths_1.pathTo)('logs'),
    maxLogFiles: 14,
    dateformat: 'HH:MM:ss',
    format: '{{timestamp}} {{message}}', // ({{file}}:{{line}})
});
function log(message) {
    daily.info(message);
}
function formatMessage(accountId, type, message) {
    return `[${accountId}]${type}\t${message}`;
}
function systemMessage(accountId, message) {
    return formatMessage(accountId, '[system]', message);
}
function adminMessage(accountId, message) {
    return formatMessage(accountId, '[admin]', message);
}
function system(accountId, message) {
    log(systemMessage(accountId, message));
}
function admin(accountId, message) {
    log(adminMessage(accountId, message));
}
function logPatreon(message) {
    log(formatMessage('patreon', '', message));
}
function logServer(message) {
    log(formatMessage('server', '', message));
}
function logPerformance(message) {
    log(formatMessage('performance', '', message));
}
function chat(server, client, text, type, ignored, target) {
    let prefix = (0, commands_1.getChatPrefix)(type);
    let mod = '';
    if (ignored) {
        mod = '[ignored]';
    }
    else if ((0, playerUtils_1.isMutedOrShadowed)(client)) {
        mod = '[muted]';
    }
    else if (client.accountSettings.ignorePublicChat && (0, interfaces_1.isPublicChat)(type)) {
        mod = '[ignorepub]';
    }
    if (type === 9 /* ChatType.Whisper */) {
        prefix += `[${target ? `${target.accountId}${target.shadowed ? '][shadowed' : ''}` : 'undefined'}] `;
    }
    const message = formatMessage(client.accountId, `[${server.id}][${client.map.id || 'main'}][${client.characterName}]${mod}`, `${prefix}${text}`);
    log(message);
}
//# sourceMappingURL=logger.js.map