"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationGuardOptions_1 = require("./interfaces/ValidationGuardOptions");
const PriorityQueue_1 = require("@utils/PriorityQueue");
const ActionFIlter_1 = require("@utils/ActionFIlter");
/**
 * Administra los verificadores de rutas
 */
class RouteGuardManager extends ActionFIlter_1.ActionFilter {
    constructor() {
        super();
        this.ON_ALLOWED = "ALLOWED_ROUTE";
        this.ON_NOT_ALLOWED = "NOT_ALLOWED_ROUTE";
        this.FILTER_NO_GUARDS = "FILTER_NO_GUARDS";
        this.FOR_EMPTY_GUARDS = true;
        this.queue = new PriorityQueue_1.PriorityQueue();
    }
    /**
     * @param route a verificar
     * @returns true si no se encontró algún validador que retorne true o si algún validador dijo explicitamente que no es valido.
     */
    isAllowed(route) {
        if (this.isEmpty()) {
            return this.applyFilter(this.FILTER_NO_GUARDS, this.FOR_EMPTY_GUARDS);
        }
        const _result_ = [route, "ROUTE_MANAGER", ["REQUEST NOT VERIFIED"]];
        for (const item of this.get()) {
            const result = item.isAllowed(route);
            if (result === ValidationGuardOptions_1.GuardOptions.CONTINUE) {
                continue;
            }
            _result_[1] = item.constructor.name;
            _result_[2] = item.messages;
            if (result === ValidationGuardOptions_1.GuardOptions.ACCEPT) {
                this.emit(this.ON_ALLOWED, _result_);
                return true;
            }
            else if (result === ValidationGuardOptions_1.GuardOptions.DIE) {
                this.emit(this.ON_NOT_ALLOWED, _result_);
                return false;
            }
        }
        this.emit(this.ON_NOT_ALLOWED, _result_);
        return false;
    }
    add(value, priority = 0) {
        this.queue.add(value, priority);
        return this;
    }
    remove(value) {
        this.queue.remove(value);
        return this;
    }
    clearAll() {
        this.queue.clearAll();
    }
    get() {
        return this.queue.get();
    }
    isEmpty() {
        return this.queue.isEmpty();
    }
}
exports.RouteGuardManager = RouteGuardManager;
//# sourceMappingURL=RouteGuardManager.js.map