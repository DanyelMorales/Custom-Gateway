import { Log } from "@root/SystemLog";
import { EventEmitter } from "events";
import { ProxyService } from "@proxy/ProxyService";
import { EndpointError, ResponseContainer } from "@app/dto/Route";

/**
 * @author Daniel Vera Morales
 */
export class SecurityServiceLogger {
  private log: Log.Message;
  constructor(private eventEmitter: EventEmitter) {
    this.log = Log.Message.instance();
    this.subscribe();
  }

  subscribe() {
    this.eventEmitter.on(
      ProxyService.ON_REQUEST_RESULT,
      (container: ResponseContainer, endpoint) => {
        const messageType = container.response.statusCode > 200 ? Log.MessageType.ERROR : Log.MessageType.NOTICE;
        this.log
          .is()
          .type(messageType)
          .action(Log.MessageAction.STATUS)
          .printf("proxy", container.response.statusCode, endpoint);
      }
    );

    this.eventEmitter.on(ProxyService.ON_ERROR, (json: EndpointError) => {
      this.log
        .is()
        .error()
        .action(Log.MessageAction.USER_SYS_ACTION)
        .printf("Proxy", json.type, json.reason + " FOR " + json.endpoint);
    });

    this.eventEmitter.on(ProxyService.ON_BEFORE_REQUEST, (payload, endpoint) => {
      this.log
        .is()
        .notice()
        .action(Log.MessageAction.STATUS)
        .printf("PROXY", "processing", `${payload.method} <${endpoint}>  ${payload.uristr}`);
    });
  }
}
