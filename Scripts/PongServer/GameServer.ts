import * as http from 'http';
import * as io from 'socket.io';

import { GameSimulation } from "./GameSimulation";
import { GameMode } from "./GameMode";

import Socket = SocketIO.Socket;

export class GameServer {
    httpServer: http.Server;
    ioServer: SocketIO.Server;

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

        this.httpServer = http.createServer();
    }

    public run() {
        this.setupSockets();

        this.httpServer.listen(1338, () => {
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
        this.ioServer = io(this.httpServer);

        this.ioServer.on('connection',
            (socket: Socket) => {
                console.log('A user connected!', socket.handshake.query.type);
                //console.log(socket);

                if (this.isMaxPlayers()) {
                    socket.emit('kick', { message: 'Too many players!' });
                    socket.disconnect(true);
                }

                var playerSettings = {
                    playerId: this.getNextPlayerId(),
                    screenSize: this.simulation.screen,
                    ball: {
                        size: this.simulation.ball.size,
                        position: this.simulation.ball.position
                    },
                    paddle1: {
                        size: this.simulation.paddleSize,
                        position: this.simulation.paddles[0].position
                    },
                    paddle2: {
                        size: this.simulation.paddleSize,
                        position: this.simulation.paddles[1].position
                    }
                };

                socket.emit('setup', playerSettings);

                socket.on('inputLeft',
                    () => {
                        this.simulation.input(playerSettings.playerId, 'left');
                    });

                socket.on('inputRight',
                    () => {
                        this.simulation.input(playerSettings.playerId, 'right');
                    });

                socket.on('clearInput',
                    () => {
                        this.simulation.clearInput(playerSettings.playerId);
                    });

                socket.on('gotit',
                    () => {
                        this.players.push(socket);
                        this.playerConnected(socket);
                    });

            });
    }

    playerConnected(socket: Socket): any {
        //if (this.isMaxPlayers())
        {
            this.startGame();

            socket.emit('startGame', {});
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