"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
/**
 * System printer
 */
var Log;
(function (Log) {
    /**
     * Tipo de mensaje
     */
    let MessageType;
    (function (MessageType) {
        MessageType[MessageType["ERROR"] = 0] = "ERROR";
        MessageType[MessageType["WARNING"] = 1] = "WARNING";
        MessageType[MessageType["NOTICE"] = 2] = "NOTICE";
        MessageType[MessageType["SUCCESS"] = 3] = "SUCCESS";
        MessageType[MessageType["UBUNTU"] = 4] = "UBUNTU";
        MessageType[MessageType["SOFT_BLUE"] = 5] = "SOFT_BLUE";
    })(MessageType = Log.MessageType || (Log.MessageType = {}));
    /**
     * Tipos de mensaje a generar
     */
    let MessageAction;
    (function (MessageAction) {
        MessageAction[MessageAction["SYS_ACTION"] = 0] = "SYS_ACTION";
        MessageAction[MessageAction["USER_ACTION"] = 1] = "USER_ACTION";
        MessageAction[MessageAction["SIMPLE_ACTION"] = 2] = "SIMPLE_ACTION";
        MessageAction[MessageAction["USER_SYS_ACTION"] = 3] = "USER_SYS_ACTION";
        MessageAction[MessageAction["STATUS"] = 4] = "STATUS";
    })(MessageAction = Log.MessageAction || (Log.MessageAction = {}));
    /**
     * Clase que administra los colores en las notificaciones
     */
    class MessageColor {
        constructor(color = null) {
            this.colors = require("cli-color");
            this._color = color;
        }
        static _() {
            return new MessageColor();
        }
        get context() {
            return this._context;
        }
        set context(value) {
            this._context = value;
        }
        type(color) {
            this._color = color;
            return this.context;
        }
        cmd(type) {
            this.type(MessageType[type.toUpperCase()]);
            return this.context;
        }
        error() {
            this.type(MessageType.ERROR);
            return this.context;
        }
        warning() {
            this.type(MessageType.WARNING);
            return this.context;
        }
        success() {
            this.type(MessageType.SUCCESS);
            return this.context;
        }
        ubuntu() {
            this.type(MessageType.UBUNTU);
            return this.context;
        }
        softblue() {
            this.type(MessageType.SOFT_BLUE);
            return this.context;
        }
        notice() {
            this.type(MessageType.NOTICE);
            return this.context;
        }
        reset() {
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
    Log.MessageColor = MessageColor;
    /**
     * Formateador de mensajes
     */
    class Message {
        constructor() {
            this.log = console.log;
            this.msgs = [
                "[%s] => %s ",
                "[%s] ~ %s",
                "~ %s",
                "~ <%s> in [%s] -> %s",
                "~ <%s> [%s] -> %s "
            ];
        }
        static instance() {
            return new Message();
        }
        reset() {
            this.color = null;
            this._action = null;
        }
        action(action) {
            this._action = action;
            return this;
        }
        is() {
            this.color = new MessageColor();
            this.color.context = this;
            return this.color;
        }
        sprintf_(args) {
            let baseStr = this.msgs[this._action];
            args.forEach(arg => {
                baseStr = util.format(baseStr, arg);
            });
            return baseStr;
        }
        sprintf(...args) {
            return this.sprintf_(args);
        }
        printf_(args) {
            const result = this.sprintf_(args);
            this.print(result);
            return result;
        }
        printf(...args) {
            const result = this.sprintf(...args);
            this.print(result);
            return result;
        }
        printfc(color, action, ...args) {
            this.action(action);
            this.color = new MessageColor(color);
            this.printf(...args);
        }
        print(msg) {
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
    Log.Message = Message;
})(Log = exports.Log || (exports.Log = {}));
//# sourceMappingURL=SystemLog.js.map