/**
 * @author Daniel Vera Morales
 */
export class GenericException extends Error {
  constructor(
    protected _name: string,
    protected _message: string,
    protected _code: string,
    protected _status: number
  ) {
    super(_message);
  }

  get name(): string {
    return this._name;
  }

  get message(): string {
    return this._message;
  }

  get code(): string {
    return this._code;
  }

  get status(): number {
    return this._status;
  }
}
