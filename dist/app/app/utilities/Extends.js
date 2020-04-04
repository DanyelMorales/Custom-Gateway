"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function serializeJSON(data) {
    return Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
}
exports.serializeJSON = serializeJSON;
var _Array_;
(function (_Array_) {
    function contains(what, arr) {
        if (arr.length === 0) {
            return false;
        }
        return arr.indexOf(what) > -1;
    }
    _Array_.contains = contains;
})(_Array_ = exports._Array_ || (exports._Array_ = {}));
function hasNonPrintableChar(str) {
    const limit = str.length;
    const chars = Array(31).fill(1).map((x, y) => x + y);
    chars.push(127);
    for (let i = 0; i < limit; i++) {
        const singleChar = str.charCodeAt(i);
        if (chars.indexOf(singleChar) === -1) {
            continue;
        }
        return {
            contains: true,
            index: i,
            char: singleChar
        };
    }
    return {
        contains: false,
        index: 0,
        char: 0
    };
}
exports.hasNonPrintableChar = hasNonPrintableChar;
function serializeHTTPJSON(data) {
    console.log("*************************************");
    console.log(JSON.stringify(data.description));
    console.log("*************************************");
    const nonPrintable = hasNonPrintableChar(JSON.stringify(data["description"]));
    if (nonPrintable.contains) {
        console.warn(JSON.stringify(nonPrintable));
    }
    else {
        console.log("REQUEST CLEAR OF NON PRINTABLE");
    }
    const result = Object.keys(data).map(function (k) {
        if (typeof data[k] !== 'object') {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }
        const theKey = encodeURIComponent(k) + '=';
        return theKey + (data[k].join("&" + theKey));
    });
    return result.join('&');
}
exports.serializeHTTPJSON = serializeHTTPJSON;
//# sourceMappingURL=Extends.js.map