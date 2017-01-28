"use strict";
var express = require('express');
var PongHttpServer = (function () {
    function PongHttpServer() {
        this.port = process.env.port || 1337;
        this.baseDirectory = "./client"; // or whatever base directory you want
    }
    PongHttpServer.prototype.run = function () {
        var app = express();
        app.use('/', express.static(this.baseDirectory)); // ← adjust
        app.listen(this.port, function () { console.log("listening on port " + this.port); });
    };
    return PongHttpServer;
}());
exports.PongHttpServer = PongHttpServer;
//# sourceMappingURL=PongHttpServer.js.map