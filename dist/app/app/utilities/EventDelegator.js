"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDelegator {
    static delegateEvents(from, to, events) {
        for (const evName in events) {
            if (!events.hasOwnProperty(evName)) {
                continue;
            }
            const event = events[evName];
            from.once(event, function () {
                const args = [evName];
                for (const item of arguments) {
                    args.push(item);
                }
                to.emit.apply(to, args);
            });
        }
    }
}
exports.EventDelegator = EventDelegator;
//# sourceMappingURL=EventDelegator.js.map