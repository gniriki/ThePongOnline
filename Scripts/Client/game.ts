﻿//Phaser dependencies
require("expose-loader?PIXI!pixi");
require("expose-loader?p2!p2");

import * as Phaser from 'phaser';
import * as io from 'socket.io-client';

import { GameSession } from "./gamesession";

var game : any;

var w: number = 500;
var h: number = 300;

var session: GameSession = null;

function setupSocket(socket : SocketIOClient.Socket) {
    socket.on('setup',
        function (data : any) {
            //do init here
            console.log('Setting up...');
            session = new GameSession(data, game);
            console.log(session);
            socket.emit('gotit');
        });

    socket.on('startGame',
        function (data : any) {
            //to do
        });

    socket.on('simulation', function (data: any) {
        session.processTurnData(data);
    });
}

function update() {

    if (session != null) {
        session.update();
    }

}

(<any>window).connectToGame = function() {
    game = new Phaser.Game(500, 300, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
}


function preload() {


    game.load.onLoadComplete.add(function () {
        console.log('Asset load complete..');
        var socket = io("http://localhost:1338");
        setupSocket(socket);
    }, this);

    game.load.image('ball', 'assets/ball.png');
    game.load.image('player', 'assets/player.png');
    game.load.start();
}

function create() {

    // connect, request new game
}