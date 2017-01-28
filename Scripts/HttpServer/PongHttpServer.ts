import http = require('http');
import url = require('url');
import fs = require('fs');
import path = require('path');
import express = require('express');

export class PongHttpServer {
    port: number = process.env.port || 1337;
    baseDirectory: string = "./client";   // or whatever base directory you want

    public run() {
        var app = express();
        app.use('/', express.static(this.baseDirectory)); // ← adjust
        app.listen(this.port, function () { console.log("listening on port " + this.port); });
    }
}