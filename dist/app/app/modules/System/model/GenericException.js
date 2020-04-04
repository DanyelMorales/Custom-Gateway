"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Daniel Vera Morales
 */
class GenericException extends Error {
    constructor(_name, _message, _code, _status) {
        super(_message);
        this._name = _name;
        this._message = _message;
        this._code = _code;
        this._status = _status;
    }
    get name() {
        return this._name;
    }
    get message() {
        return this._message;
    }
    get code() {
        return this._code;
    }
    get status() {
        return this._status;
    }
}
exports.GenericException = GenericException;
//# sourceMappingURL=GenericException.js.map