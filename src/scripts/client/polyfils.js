/// <reference path="../../typings/my.d.ts" />
// Safari <= 8.4, Android
try {
    if (!('performance' in window && 'now' in performance)) {
        window.performance = Date;
    }
}
catch { }
try {
    if (!('getGamepads' in navigator)) {
        window.navigator.getGamepads = () => [];
    }
}
catch { }
try {
    if (!('requestAnimationFrame' in window)) {
        window.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 1000 / 60);
    }
}
catch { }
try {
    if (!('cancelAnimationFrame' in window)) {
        window.cancelAnimationFrame = clearTimeout;
    }
}
catch { }
// IE <= 10
try {
    if (!('devicePixelRatio' in window)) {
        window.devicePixelRatio = 1;
    }
}
catch { }
//# sourceMappingURL=polyfils.js.map