export function setImmediateFn(...args) {
    try {
        return window.setImmediate(args);
    }
    catch (_) {
        return process.nextTick(args);
    }
}
//# sourceMappingURL=set-immediate.js.map