var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import { GameSimulation } from "./GameSimulation";
import { GameMode } from "./GameMode";

import Socket = SocketIO.Socket;

export class GameServer {
    simulation: GameSimulation;
    players: Array<Socket>;
    gameMode: GameMode;
    nextPlayerNumber: number = 0;
    dt: number = 0.01;

    currentTime: number = new Date().valueOf();
    accumulator: number = 0.0;

    public constructor() {
        this.simulation = new GameSimulation();
        this.players = [];
        this.gameMode = GameMode.twoPlayerMode();
    }

    public run() {
        this.setupSockets();

        http.listen(1338, function () {
            console.log('listening on *:1338');
        });

        //this.startGame();
    }

    public broadcastState() {
        for (var socket of this.players) {
            socket.emit('simulation', { ball: this.simulation.ball });
        }
    }

    public gameLoop() {
        let newTime = new Date().valueOf();
        let frameTime = newTime - this.currentTime;
        this.currentTime = newTime;

        this.accumulator += frameTime;

        while (this.accumulator >= this.dt) {
            this.simulation.simulate(this.dt);
            this.accumulator -= this.dt;
        }
    }

    public setupSockets() {
        io.on('connection',
            (socket: Socket) => {
                console.log('A user connected!', socket.handshake.query.type);
                //console.log(socket);

                if (this.isMaxPlayers()) {
                    socket.emit('kick', { message: 'Too many players!' });
                    socket.disconnect(true);
                }

                var player = {
                    id: this.getNextPlayerId()
                };

                socket.on('inputLeft',
                    () => {
                        this.simulation.input(player.id, 'left');
                    });

                socket.on('inputRight',
                    () => {
                        this.simulation.input(player.id, 'right');
                    });

                socket.on('clearInput',
                    () => {
                        this.simulation.clearInput(player.id);
                    });

                this.players.push(socket);
                this.playerConnected();
            });
    }

    playerConnected(): any {
        //if (this.isMaxPlayers())
        {
            this.startGame();
        }
    }

    startGame(): any {
        setInterval(() => this.gameLoop(), 1000 / 60);
        setInterval(() => this.broadcastState(), 1000 / 100);
    }

    isMaxPlayers(): boolean {
        return this.players.length >= this.gameMode.maxPlayers;
    }

    getNextPlayerId(): number {
        let newNumber = this.nextPlayerNumber;
        this.nextPlayerNumber++;
        return newNumber;
    }
}