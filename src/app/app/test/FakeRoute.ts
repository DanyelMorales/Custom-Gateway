import * as RouteRegister from "@utils/RouteRegister";

/**
 *
 */
export class FakeRoute implements RouteRegister.IComplexRoute {
  private route: string;

  /**
   *
   */
  constructor() {
    this.route = "/proxy/*";
  }

  /**
   *
   */
  getType(): RouteRegister.RouteType {
    return RouteRegister.RouteType.ALL;
  }

  /**
   *
   */
  invoke(req: any, res: any, next: any) {
    console.log(req.method);
    res.send("Express RESTful APsssI");
  }

  /**
   *
   */
  getRoute(): string {
    return "/testfake";
  }
}
