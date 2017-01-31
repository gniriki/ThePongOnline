import { Player } from "./player";

var Phaser: any;

export class GameSession {
    game: any;
    ball: any;
    vx: number = 0;
    vy: number = 0;

    paddle: any[] = [];

    constructor(data: any, game: any) {
        this.game = game;
        this.ball = game.add.sprite(data.ball.position.x, data.ball.position.y, 'ball');
        this.ball.anchor.setTo(0.5, 0.5);
        this.ball.width = data.ball.size.x;
        this.ball.height = data.ball.size.y;

        this.paddle.push(new Player(this.game, data.paddle1, 0));
        this.paddle.push(new Player(this.game, data.paddle2, 1));
        /*
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
        */
    }
    update() {
        this.ball.position.x += this.vx * this.game.time.elapsed;
        this.ball.position.y += this.vy * this.game.time.elapsed;
    }

    processTurnData(data: any) {
        if (Math.abs(this.ball.position.x - data.ball.position.x) > 3) {
            this.ball.position.x = data.ball.position.x;
        }

        if (Math.abs(this.ball.position.y - data.ball.position.y) > 3) {
            this.ball.position.y = data.ball.position.y;
        }

        this.vx = data.ball.velocity.x;
        this.vy = data.ball.velocity.y;
    }
}