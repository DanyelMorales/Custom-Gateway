"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriorityQueue {
    constructor() {
        this.collection = [];
    }
    orderMe(a, b) {
        return b.priority - a.priority;
    }
    add(value, priority) {
        const map = {
            priority: priority,
            value: value
        };
        this.collection.push(map);
        this.collection.sort(this.orderMe);
        return this;
    }
    clearAll() {
        delete this.collection;
        this.collection = [];
    }
    remove(value) {
        for (const i in this.collection) {
            if (this.collection[i].value === value) {
                delete this.collection[i];
            }
        }
        return this;
    }
    get() {
        if (this.collection.length === 0) {
            return null;
        }
        const container = [];
        this.collection.forEach(element => {
            container.push(element.value);
        });
        return container;
    }
    isEmpty() {
        return this.collection.length === 0;
    }
}
exports.PriorityQueue = PriorityQueue;
//# sourceMappingURL=PriorityQueue.js.map