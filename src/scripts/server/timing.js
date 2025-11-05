"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timingStart = timingStart;
exports.timingEnd = timingEnd;
exports.timingReset = timingReset;
exports.timingEntries = timingEntries;
const ENABLED = true;
const ENTRIES_LIMIT = 50000;
const entries = [];
let entriesCount = 0;
let now;
if (typeof window !== 'undefined') {
    now = performance.now;
}
else {
    const hrtime = process.hrtime;
    const getNanoSeconds = () => {
        const hr = hrtime();
        return hr[0] * 1e9 + hr[1];
    };
    const nodeLoadTime = getNanoSeconds() - process.uptime() * 1e9;
    now = () => (getNanoSeconds() - nodeLoadTime) / 1e6;
}
if (ENABLED) {
    for (let i = 0; i < ENTRIES_LIMIT; i++) {
        entries.push({ type: 0, time: 0, name: undefined });
    }
}
function timingStart(name) {
    if (ENABLED) {
        if (entriesCount < ENTRIES_LIMIT) {
            const entry = entries[entriesCount];
            entry.type = 0 /* TimingEntryType.Start */;
            entry.time = now();
            entry.name = name;
            entriesCount++;
        }
        else {
            console.warn(`exceeded timing entry limit`);
        }
    }
}
function timingEnd() {
    if (ENABLED) {
        if (entriesCount < ENTRIES_LIMIT) {
            const entry = entries[entriesCount];
            entry.type = 1 /* TimingEntryType.End */;
            entry.time = now();
            entry.name = undefined;
            entriesCount++;
        }
        else {
            console.warn(`exceeded timing entry limit`);
        }
    }
}
function timingReset() {
    if (ENABLED) {
        entriesCount = 0;
    }
}
function timingEntries() {
    return entries.slice(0, entriesCount);
}
//# sourceMappingURL=timing.js.map