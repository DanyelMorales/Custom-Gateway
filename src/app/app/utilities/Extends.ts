export function serializeJSON(data) {
    return Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
}

export namespace _Array_ {
    export function contains(what: any, arr: any[]): boolean {
        if (arr.length === 0) {
            return false;
        }
        return arr.indexOf(what) > -1;
    }
    export function range() { }
}

export interface PrintableResult {
    contains: boolean,
    index: number,
    char: number
}
export function hasNonPrintableChar(str: string): PrintableResult {
    const limit = str.length;
    const chars: number[] = Array(31).fill(1).map((x, y) => x + y);
    chars.push(127);

    for (let i = 0; i < limit; i++) {
        const singleChar: number = str.charCodeAt(i);
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

export function serializeHTTPJSON(data) {
    const result = Object.keys(data).map(function (k) {
        if (typeof data[k] !== 'object') {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }
        const theKey = encodeURIComponent(k) + '=';
        return theKey + (data[k].join("&" + theKey));
    });
    return result.join('&');
}
