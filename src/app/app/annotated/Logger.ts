/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
import { Log } from "@root/SystemLog";
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
enum AvailableEvals {
  TYPE_OF = "typeof"
}

/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
interface ILogStrategy {
  readonly name: string;
  parse(originalValue: string, expected: string): ParseResult;
}

/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class ParseResult {
  constructor(
    private _original: string,
    private _expected: string,
    private _found: boolean = false
  ) {}
  set original(value: string) {
    this._original = value;
  }

  set expected(value: string) {
    this._expected = value;
  }

  set asserts(value: boolean) {
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
class LogParseStrategyTypeof implements ILogStrategy {
  readonly name: string = AvailableEvals.TYPE_OF;
  private container: string[];

  parse(originalValue: string, expected: string): ParseResult {
    const result: ParseResult = new ParseResult(originalValue, expected);
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
  constructor(private strategyCollection: ILogStrategy[]) {}

  parse(statement: string, originalValue: string): ParseResult {
    const parts: string[] = statement.split("@");

    if (parts.length !== 2) {
      throw Error(
        "LogParse condition must have 2 parts: eval@expected: " + statement
      );
    }

    const evaluation: string = this.cleanStmt(parts[0]).toUpperCase();
    const expected: string = this.cleanStmt(parts[1]);
    const strat: ILogStrategy = this.getStrategy(evaluation);
    return strat.parse(originalValue, expected);
  }

  private getStrategy(name: string): ILogStrategy {
    for (const element of this.strategyCollection) {
      if (this.cleanStmt(element.name.toUpperCase()) === name) {
        return element;
      }
    }
    throw Error("LogParse  Strategy not found for: " + name);
  }

  private cleanStmt(stmt: string): string {
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
const parseLog = function(
  msg: MsgBuilder,
  args: any,
  originalValue: any,
  action: Log.MessageAction
) {
  const statement = args["on"];
  const strategies = [new LogParseStrategyTypeof()];
  const parser = new LogParserEngine(strategies);
  const result: ParseResult = parser.parse(statement, originalValue);

  // no cae en la comparación
  if (!result.asserts) {
    return originalValue;
  }

  Log.Message.instance()
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
  constructor(
    private clazz: string,
    private attr: string,
    private original: string[]
  ) {}
  build(result: ParseResult): string[] {
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
const systemInvokation = (args: any, msg: string[] = null) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      const originalValue = originalMethod.apply(this, arguments);
      const msgbuilder = new MsgBuilder(
        target.constructor.name,
        propertyKey,
        msg
      );
      return parseLog(
        msgbuilder,
        args,
        originalValue,
        Log.MessageAction.USER_SYS_ACTION
      );
    };
    return descriptor;
  };
};

export = {
  eval: systemInvokation
};
