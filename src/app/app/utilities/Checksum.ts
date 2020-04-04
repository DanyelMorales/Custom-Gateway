const crypto = require("crypto");

export function checksum(str, algorithm = null, encoding = null) {
  return crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex");
}

export function base64(str) {
  const nospaces = str.replace(/\s/g, "");
  return Buffer.from(nospaces).toString("base64");
}
