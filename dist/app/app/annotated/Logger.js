"use strict";
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
const SystemLog_1 = require("@root/SystemLog");
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
var AvailableEvals;
(function (AvailableEvals) {
    AvailableEvals["TYPE_OF"] = "typeof";
})(AvailableEvals || (AvailableEvals = {}));
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class ParseResult {
    constructor(_original, _expected, _found = false) {
        this._original = _original;
        this._expected = _expected;
        this._found = _found;
    }
    set original(value) {
        this._original = value;
    }
    set expected(value) {
        this._expected = value;
    }
    set asserts(value) {
        this._found = value;
    }
    get original() {
        return this._original;
    }
    get expected() {
        return this._expected;
    }
    get asserts() {
        return this._found;
    }
}
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class LogParseStrategyTypeof {
    constructor() {
        this.name = AvailableEvals.TYPE_OF;
    }
    parse(originalValue, expected) {
        const result = new ParseResult(originalValue, expected);
        if (typeof originalValue === expected) {
            result.asserts = true;
        }
        return result;
    }
}
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class LogParserEngine {
    constructor(strategyCollection) {
        this.strategyCollection = strategyCollection;
    }
    parse(statement, originalValue) {
        const parts = statement.split("@");
        if (parts.length !== 2) {
            throw Error("LogParse condition must have 2 parts: eval@expected: " + statement);
        }
        const evaluation = this.cleanStmt(parts[0]).toUpperCase();
        const expected = this.cleanStmt(parts[1]);
        const strat = this.getStrategy(evaluation);
        return strat.parse(originalValue, expected);
    }
    getStrategy(name) {
        for (const element of this.strategyCollection) {
            if (this.cleanStmt(element.name.toUpperCase()) === name) {
                return element;
            }
        }
        throw Error("LogParse  Strategy not found for: " + name);
    }
    cleanStmt(stmt) {
        return stmt.replace(/\s/gi, "");
    }
}
/**
 * Parser middleware
 * @param args
 * @param originalValue
 * @param action
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
const parseLog = function (msg, args, originalValue, action) {
    const statement = args["on"];
    const strategies = [new LogParseStrategyTypeof()];
    const parser = new LogParserEngine(strategies);
    const result = parser.parse(statement, originalValue);
    // no cae en la comparación
    if (!result.asserts) {
        return originalValue;
    }
    SystemLog_1.Log.Message.instance()
        .is()
        .cmd(args["level"])
        .action(action)
        .printf_(msg.build(result));
    return args["return"];
};
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class MsgBuilder {
    constructor(clazz, attr, original) {
        this.clazz = clazz;
        this.attr = attr;
        this.original = original;
    }
    build(result) {
        if (this.original !== null && this.original.length === 3) {
            return this.original;
        }
        return [
            this.attr,
            this.clazz,
            "Current value: " + JSON.stringify(result.original)
        ];
    }
}
/**
 * Genera un paquete de autenticación utilizando un ruta y los datos
 * originales que devuelve el metodo.
 *
 * @param path ruta que se desea iterar
 * @param sendInmediately true or false
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
const systemInvokation = (args, msg = null) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            const originalValue = originalMethod.apply(this, arguments);
            const msgbuilder = new MsgBuilder(target.constructor.name, propertyKey, msg);
            return parseLog(msgbuilder, args, originalValue, SystemLog_1.Log.MessageAction.USER_SYS_ACTION);
        };
        return descriptor;
    };
};
module.exports = {
    eval: systemInvokation
};
//# sourceMappingURL=Logger.js.map