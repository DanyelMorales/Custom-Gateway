const util = require("util");
/**
 * System printer
 */
export namespace Log {
  /**
   * Tipo de mensaje
   */
  export enum MessageType {
    ERROR,
    WARNING,
    NOTICE,
    SUCCESS,
    UBUNTU,
    SOFT_BLUE
  }

  /**
   * Tipos de mensaje a generar
   */
  export enum MessageAction {
    SYS_ACTION,
    USER_ACTION,
    SIMPLE_ACTION,
    USER_SYS_ACTION,
    STATUS
  }

  /**
   * Clase que administra los colores en las notificaciones
   */
  export class MessageColor {
    readonly colors: any = require("cli-color");
    private _color: MessageType;
    private _context: any;

    static _() {
      return new MessageColor();
    }

    constructor(color: MessageType = null) {
      this._color = color;
    }

    get context() {
      return this._context;
    }

    set context(value: any) {
      this._context = value;
    }

    type(color: MessageType): any {
      this._color = color;
      return this.context;
    }

    cmd(type: string): any {
      this.type(MessageType[type.toUpperCase()]);
      return this.context;
    }

    error(): any {
      this.type(MessageType.ERROR);
      return this.context;
    }
    warning(): any {
      this.type(MessageType.WARNING);
      return this.context;
    }

    success(): any {
      this.type(MessageType.SUCCESS);
      return this.context;
    }
    ubuntu(): any {
      this.type(MessageType.UBUNTU);
      return this.context;
    }
    softblue(): any {
      this.type(MessageType.SOFT_BLUE);
      return this.context;
    }
    notice(): any {
      this.type(MessageType.NOTICE);
      return this.context;
    }

    reset(): void {
      this._color = null;
      this._context = null;
    }

    getColorFunc() {
      switch (this._color) {
        case MessageType.ERROR:
          return this.colors.red.bold;
        case MessageType.WARNING:
          return this.colors.yellow;
        case MessageType.SUCCESS:
          return this.colors.xterm(81);
        case MessageType.UBUNTU:
          return this.colors.xterm(90);
        case MessageType.SOFT_BLUE:
          return this.colors.xterm(117);
        case MessageType.NOTICE:
        default:
          return this.colors.xterm(87);
      }
    }
  }

  /**
   * Formateador de mensajes
   */
  export class Message {
    readonly log: Function = console.log;
    private color: MessageColor;
    private _action: MessageAction;
    private msgs: string[] = [
      "[%s] => %s ",
      "[%s] ~ %s",
      "~ %s",
      "~ <%s> in [%s] -> %s",
      "~ <%s> [%s] -> %s "
    ];

    static instance() {
      return new Message();
    }
    private reset(): void {
      this.color = null;
      this._action = null;
    }

    action(action: MessageAction): Message {
      this._action = action;
      return this;
    }

    is(): MessageColor {
      this.color = new MessageColor();
      this.color.context = this;
      return this.color;
    }

    sprintf_(args: string[]): string {
      let baseStr = this.msgs[this._action];
      args.forEach(arg => {
        baseStr = util.format(baseStr, arg);
      });
      return baseStr;
    }
    sprintf(...args: string[]): string {
      return this.sprintf_(args);
    }

    printf_(args: string[]): string {
      const result = this.sprintf_(args);
      this.print(result);
      return result;
    }

    printf(...args: string[]): string {
      const result = this.sprintf(...args);
      this.print(result);
      return result;
    }

    printfc(
      color: MessageType,
      action: MessageAction,
      ...args: string[]
    ): void {
      this.action(action);
      this.color = new MessageColor(color);
      this.printf(...args);
    }

    private print(msg: string): void {
      let content = msg;
      if (this.color !== null) {
        const thefunc = this.color.getColorFunc();
        content = thefunc(msg);
        this.color.reset();
      }
      this.log(content);
      this.reset();
    }
  }
}
