class WWW {
  readonly http = require("http");
  private app: any;
  private port: any;
  private server: any;

  constructor(services: string, the_port: any, runningMode: string) {
    this.setRunningMode(runningMode);
    this.app = require("@services/" + services).bootstrap();
    this.port = this.normalizePort(the_port);
    this.server = this.http.createServer(this.app.myExpress);
  }

  initialize() {
    this.server.listen(this.port);
    this.server.on("error", this.onError.bind(this));
    this.server.on("listening", this.onListening.bind(this));
  }

  private normalizePort(val) {
    val = val || "3000";
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  }

  private onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind =
      typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  private onListening() {
    const addr = this.server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
    this.app.initialize();
  }
  private setRunningMode(runningMode: string) {
    runningMode = runningMode || "dev";
    process.env.RMODE = runningMode;
    console.log("Running Mode: " + runningMode);
  }
}

export = WWW;
