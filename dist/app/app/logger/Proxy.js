"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemLog_1 = require("@root/SystemLog");
const ProxyService_1 = require("@proxy/ProxyService");
/**
 * @author Daniel Vera Morales
 */
class SecurityServiceLogger {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.log = SystemLog_1.Log.Message.instance();
        this.subscribe();
    }
    subscribe() {
        this.eventEmitter.on(ProxyService_1.ProxyService.ON_REQUEST_RESULT, (container, endpoint) => {
            const messageType = container.response.statusCode > 200 ? SystemLog_1.Log.MessageType.ERROR : SystemLog_1.Log.MessageType.NOTICE;
            this.log
                .is()
                .type(messageType)
                .action(SystemLog_1.Log.MessageAction.STATUS)
                .printf("proxy", container.response.statusCode, endpoint);
        });
        this.eventEmitter.on(ProxyService_1.ProxyService.ON_ERROR, (json) => {
            this.log
                .is()
                .error()
                .action(SystemLog_1.Log.MessageAction.USER_SYS_ACTION)
                .printf("Proxy", json.type, json.reason + " FOR " + json.endpoint);
        });
        this.eventEmitter.on(ProxyService_1.ProxyService.ON_BEFORE_REQUEST, (payload, endpoint) => {
            this.log
                .is()
                .notice()
                .action(SystemLog_1.Log.MessageAction.STATUS)
                .printf("PROXY", "processing", `${payload.method} <${endpoint}>  ${payload.uristr}`);
        });
    }
}
exports.SecurityServiceLogger = SecurityServiceLogger;
//# sourceMappingURL=Proxy.js.map