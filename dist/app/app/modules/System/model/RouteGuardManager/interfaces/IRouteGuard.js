"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionFIlter_1 = require("@utils/ActionFIlter");
class AbstractRouteGuard extends ActionFIlter_1.ActionFilter {
    constructor() {
        super(...arguments);
        this._messages = [];
    }
    get messages() {
        return this._messages;
    }
    reset() {
        this._messages = [];
    }
}
exports.AbstractRouteGuard = AbstractRouteGuard;
//# sourceMappingURL=IRouteGuard.js.map