"use strict";
const express = require('express');
class PongHttpServer {
    constructor() {
        this.port = process.env.port || 1337;
        this.baseDirectory = "./client";
    }
    run() {
        var app = express();
        app.use('/', express.static(this.baseDirectory));
        var port = this.port;
        app.listen(this.port, function () { console.log("listening on port " + port); });
    }
}
exports.PongHttpServer = PongHttpServer;
//# sourceMappingURL=PongHttpServer.js.map