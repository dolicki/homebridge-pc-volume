"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockLogging {
    constructor(prefix = "") {
        this.prefix = prefix;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-empty-function */
    info(message, ...parameters) { }
    warn(message, ...parameters) { }
    error(message, ...parameters) { }
    debug(message, ...parameters) { }
    log(level, message, ...parameters) { }
}
exports.default = MockLogging;
//# sourceMappingURL=MockLogging.js.map