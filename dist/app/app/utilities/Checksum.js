"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function checksum(str, algorithm = null, encoding = null) {
    return crypto
        .createHash(algorithm || "md5")
        .update(str, "utf8")
        .digest(encoding || "hex");
}
exports.checksum = checksum;
function base64(str) {
    const nospaces = str.replace(/\s/g, "");
    return Buffer.from(nospaces).toString("base64");
}
exports.base64 = base64;
//# sourceMappingURL=Checksum.js.map