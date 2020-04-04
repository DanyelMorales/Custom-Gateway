export class EndpointError {
  constructor(
    private _isError: boolean,
    private _type: any,
    private _endpoint: any,
    private _reason: any,
    private _status: any,
    private _data: string[] = []
  ) {}

  set isError(value: boolean) {
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

/**
 *
 */
export class ResponseContainer {
  constructor(private _error, private _response, private _body) {}

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
