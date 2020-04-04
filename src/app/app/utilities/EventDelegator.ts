import { EventEmitter } from "events";

export class EventDelegator {
  static delegateEvents(from: EventEmitter, to: EventEmitter, events: {}) {
    for (const evName in events) {
      if (!events.hasOwnProperty(evName)) {
        continue;
      }
      const event = events[evName];
      from.once(event, function() {
        const args: any[] = [evName];
        for (const item of arguments) {
          args.push(item);
        }
        to.emit.apply(to, args);
      });
    }
  }
}
