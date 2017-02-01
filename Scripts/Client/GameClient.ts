//Phaser dependencies
require("expose-loader?PIXI!pixi");
require("expose-loader?p2!p2");

import * as Phaser from 'phaser';
import * as io from 'socket.io-client';

import { GameSession } from "./gamesession";

export class GameClient {
    game: Phaser.Game;
    w: number = 500;
    h: number = 300;
    session: GameSession = null;

    setupSocket(socket: SocketIOClient.Socket) {
        socket.on('setup',
            (data: any) => {
                //do init here
                console.log('Setting up...');
                this.session = new GameSession(data, this.game);
                console.log(this.session);
                socket.emit('gotit');
            });

        socket.on('startGame',
            (data: any) => {
                //to do
            });

        socket.on('simulation',
            (data: any) => {
                this.session.processTurnData(data);
            });
    }

    update() {

        if (this.session != null) {
            this.session.update();
        }
    }

    run() {
        this.game = new Phaser.Game(500,
            300,
            Phaser.AUTO,
            'phaser-example',
            { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
    }

    preload() {
        this.game.load.onLoadComplete.add(this.onLoadComplete);

        this.game.load.image('ball', 'assets/ball.png');
        this.game.load.image('player', 'assets/player.png');
        this.game.load.start();
    }

    onLoadComplete = () => {
        console.log('Asset load complete..');
        var socket = io("http://localhost:1338");
        this.setupSocket(socket);
    }

    create() {

        // connect, request new game
    }
}