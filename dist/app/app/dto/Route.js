"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EndpointError {
    constructor(_isError, _type, _endpoint, _reason, _status, _data = []) {
        this._isError = _isError;
        this._type = _type;
        this._endpoint = _endpoint;
        this._reason = _reason;
        this._status = _status;
        this._data = _data;
    }
    set isError(value) {
        this._isError = value;
    }
    set type(value) {
        this._type = value;
    }
    set endpoint(value) {
        this._endpoint = value;
    }
    set reason(value) {
        this._reason = value;
    }
    set status(value) {
        this._status = value;
    }
    get isError() {
        return this._isError;
    }
    get type() {
        return this._type;
    }
    get endpoint() {
        return this._endpoint;
    }
    get reason() {
        return this._reason;
    }
    get status() {
        return this._status;
    }
}
exports.EndpointError = EndpointError;
/**
 *
 */
class ResponseContainer {
    constructor(_error, _response, _body) {
        this._error = _error;
        this._response = _response;
        this._body = _body;
    }
    set error(value) {
        this._error = value;
    }
    set response(value) {
        this._response = value;
    }
    set body(value) {
        this._body = value;
    }
    get error() {
        return this._error;
    }
    get response() {
        return this._response;
    }
    get body() {
        return this._body;
    }
}
exports.ResponseContainer = ResponseContainer;
//# sourceMappingURL=Route.js.map