"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParty = updateParty;
exports.isPonyInParty = isPonyInParty;
exports.isPartyLeader = isPartyLeader;
exports.isInParty = isInParty;
const lodash_1 = require("lodash");
function updateParty(current, info) {
    if (!info || !info.length) {
        return undefined;
    }
    else {
        const party = current || {
            leaderId: 0,
            members: [],
        };
        (0, lodash_1.remove)(party.members, p => !info.some(m => p.id === m.id));
        info.forEach(m => {
            const existing = party.members.find(x => m.id === x.id);
            if (existing) {
                Object.assign(existing, m);
            }
            else {
                party.members.push(m);
            }
            if (m.leader) {
                party.leaderId = m.id;
            }
        });
        return party;
    }
}
function isPonyInParty(party, pony, pending) {
    return !!party && party.members.some(m => m.pony === pony && (pending || !m.pending));
}
function isPartyLeader(game) {
    return game.party !== undefined && game.player !== undefined && game.player.id === game.party.leaderId;
}
function isInParty(game) {
    return game.party !== undefined && game.party.members.length > 0;
}
//# sourceMappingURL=partyUtils.js.map