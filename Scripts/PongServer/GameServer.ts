var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import { GameSimulation } from "./GameSimulation";
import Socket = SocketIO.Socket;

export class GameServer {
    simulation: GameSimulation;
    players: Array<Socket>;
    gameMode: GameMode;

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

                if (this.isMaxPlayers()) {
                    socket.emit('kick', { message: 'Too many players!' });
                    socket.disconnect(true);
                }

                this.players.push(socket);
                this.playerConnected();
            });
    }

    playerConnected(): any {
        //if (isMaxPlayers())
        {
            setInterval(() => this.gameLoop(), 1000 / 60);
            setInterval(() => this.broadcastState(), 1000 / 200);
        }
    }

    isMaxPlayers(): boolean {
        return this.players.length >= this.gameMode.maxPlayers;
    }
}