"use strict";
class WWW {
    constructor(services, the_port, runningMode) {
        this.http = require("http");
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
    normalizePort(val) {
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
    onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }
        const bind = typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port;
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
    onListening() {
        const addr = this.server.address();
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        console.log("Listening on " + bind);
        this.app.initialize();
    }
    setRunningMode(runningMode) {
        runningMode = runningMode || "dev";
        process.env.RMODE = runningMode;
        console.log("Running Mode: " + runningMode);
    }
}
module.exports = WWW;
//# sourceMappingURL=AbstractRunner.js.map