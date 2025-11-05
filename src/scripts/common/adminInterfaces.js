"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimingEntryType = exports.Stats = exports.eventFields = exports.CharacterStateFlags = exports.supporterFlags = exports.SupporterFlags = exports.PatreonFlags = exports.accountFlags = exports.AccountFlags = exports.accountCounters = exports.SERVER_SETTINGS = exports.LOGIN_SERVER_SETTINGS = exports.CharacterFlags = exports.Suspicious = exports.SERVER_LABELS = exports.ROLES = exports.ITEM_LIMIT = void 0;
exports.ITEM_LIMIT = 1000;
exports.ROLES = ['superadmin', 'admin', 'mod', 'dev'];
exports.SERVER_LABELS = {
    'dev': 'badge-test',
    'test': 'badge-test',
    'main': 'badge-none',
    'main-ru': 'badge-none',
    'safe': 'badge-success',
    'safe-ru': 'badge-success',
    'safe-pr': 'badge-success',
    'safe-sp': 'badge-success',
};
var Suspicious;
(function (Suspicious) {
    Suspicious[Suspicious["No"] = 0] = "No";
    Suspicious[Suspicious["Yes"] = 1] = "Yes";
    Suspicious[Suspicious["Very"] = 2] = "Very";
})(Suspicious || (exports.Suspicious = Suspicious = {}));
var CharacterFlags;
(function (CharacterFlags) {
    CharacterFlags[CharacterFlags["None"] = 0] = "None";
    CharacterFlags[CharacterFlags["BadCM"] = 1] = "BadCM";
    CharacterFlags[CharacterFlags["HideSupport"] = 4] = "HideSupport";
    CharacterFlags[CharacterFlags["RespawnAtSpawn"] = 8] = "RespawnAtSpawn";
    CharacterFlags[CharacterFlags["ForbiddenName"] = 16] = "ForbiddenName";
})(CharacterFlags || (exports.CharacterFlags = CharacterFlags = {}));
// NOTE: also update createLoginServerStatus()
exports.LOGIN_SERVER_SETTINGS = [
    { id: 'canCreateAccounts', label: 'Can create accounts' },
    { id: 'blockWebView', label: 'Block web view' },
    { id: 'reportPotentialDuplicates', label: 'Report potential duplicates' },
    { id: 'autoMergeDuplicates', label: 'Auto-merge duplicates' },
];
exports.SERVER_SETTINGS = [
    { id: 'filterSwears', label: 'Swear filter' },
    { id: 'autoBanSwearing', label: 'Auto-Timeout for swearing' },
    { id: 'autoBanSpamming', label: 'Auto-Timeout for spam' },
    { id: 'doubleTimeouts', label: 'Double timeouts duration' },
    { id: 'reportSpam', label: 'Report spam' },
    { id: 'reportSwears', label: 'Report swearing' },
    { id: 'reportTeleporting', label: 'Report teleporting' },
    { id: 'logLagging', label: 'Log lagging' },
    { id: 'logTeleporting', label: 'Log teleporting' },
    { id: 'logFixingPosition', label: 'Log fixing position' },
    { id: 'hideSwearing', label: 'Hide swearing' },
    { id: 'kickSwearing', label: 'Kick for swearing' },
    { id: 'kickSwearingToSpawn', label: 'Reset swearing to spawn' },
    { id: 'blockJoining', label: 'Block joining' },
    { id: 'kickTeleporting', label: 'Kick teleporting players' },
    { id: 'fixTeleporting', label: 'Fix teleporting players' },
    { id: 'kickLagging', label: 'Kick lagging players' },
    { id: 'reportSitting', label: 'Report sitting' },
];
exports.accountCounters = [
    { name: 'spam', label: 'spam' },
    { name: 'swears', label: 'swearing' },
    { name: 'timeouts', label: 'timeouts' },
    { name: 'inviteLimit', label: 'party limits' },
    { name: 'friendLimit', label: 'friend limits' },
];
var AccountFlags;
(function (AccountFlags) {
    AccountFlags[AccountFlags["None"] = 0] = "None";
    AccountFlags[AccountFlags["BlockPartyInvites"] = 1] = "BlockPartyInvites";
    AccountFlags[AccountFlags["CreatingDuplicates"] = 2] = "CreatingDuplicates";
    AccountFlags[AccountFlags["DuplicatesNotification"] = 4] = "DuplicatesNotification";
    AccountFlags[AccountFlags["BlockMerging"] = 16] = "BlockMerging";
    AccountFlags[AccountFlags["BlockFriendRequests"] = 256] = "BlockFriendRequests";
})(AccountFlags || (exports.AccountFlags = AccountFlags = {}));
exports.accountFlags = [
    { value: 1 /* AccountFlags.BlockPartyInvites */, name: 'BlockPartyInvites', label: 'block party invites' },
    { value: 2 /* AccountFlags.CreatingDuplicates */, name: 'CreatingDuplicates', label: 'creating duplicates' },
    { value: 4 /* AccountFlags.DuplicatesNotification */, name: 'DuplicatesNotification', label: 'duplicates notification' },
    { value: 16 /* AccountFlags.BlockMerging */, name: 'BlockMerging', label: 'block merging' },
    { value: 256 /* AccountFlags.BlockFriendRequests */, name: 'BlockFriendRequests', label: 'block friend requests' },
];
var PatreonFlags;
(function (PatreonFlags) {
    PatreonFlags[PatreonFlags["None"] = 0] = "None";
    PatreonFlags[PatreonFlags["Supporter1"] = 1] = "Supporter1";
    PatreonFlags[PatreonFlags["Supporter2"] = 2] = "Supporter2";
    PatreonFlags[PatreonFlags["Supporter3"] = 3] = "Supporter3";
})(PatreonFlags || (exports.PatreonFlags = PatreonFlags = {}));
var SupporterFlags;
(function (SupporterFlags) {
    SupporterFlags[SupporterFlags["None"] = 0] = "None";
    SupporterFlags[SupporterFlags["Supporter1"] = 1] = "Supporter1";
    SupporterFlags[SupporterFlags["Supporter2"] = 2] = "Supporter2";
    SupporterFlags[SupporterFlags["Supporter3"] = 3] = "Supporter3";
    SupporterFlags[SupporterFlags["SupporterMask"] = 3] = "SupporterMask";
    SupporterFlags[SupporterFlags["IgnorePatreon"] = 128] = "IgnorePatreon";
    SupporterFlags[SupporterFlags["PastSupporter"] = 256] = "PastSupporter";
    SupporterFlags[SupporterFlags["ForcePastSupporter"] = 512] = "ForcePastSupporter";
    SupporterFlags[SupporterFlags["IgnorePastSupporter"] = 1024] = "IgnorePastSupporter";
})(SupporterFlags || (exports.SupporterFlags = SupporterFlags = {}));
exports.supporterFlags = [
    { value: 128 /* SupporterFlags.IgnorePatreon */, label: 'ignore data from patreon' },
];
var CharacterStateFlags;
(function (CharacterStateFlags) {
    CharacterStateFlags[CharacterStateFlags["None"] = 0] = "None";
    CharacterStateFlags[CharacterStateFlags["Right"] = 1] = "Right";
    CharacterStateFlags[CharacterStateFlags["Extra"] = 2] = "Extra";
})(CharacterStateFlags || (exports.CharacterStateFlags = CharacterStateFlags = {}));
exports.eventFields = [
    '_id', 'updatedAt', 'createdAt', 'type', 'server', 'message', 'desc', 'count', 'origin', 'account', 'pony'
];
var Stats;
(function (Stats) {
    Stats[Stats["Country"] = 0] = "Country";
    Stats[Stats["Support"] = 1] = "Support";
    Stats[Stats["Maps"] = 2] = "Maps";
})(Stats || (exports.Stats = Stats = {}));
var TimingEntryType;
(function (TimingEntryType) {
    TimingEntryType[TimingEntryType["Start"] = 0] = "Start";
    TimingEntryType[TimingEntryType["End"] = 1] = "End";
})(TimingEntryType || (exports.TimingEntryType = TimingEntryType = {}));
//# sourceMappingURL=adminInterfaces.js.map