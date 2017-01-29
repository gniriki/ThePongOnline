import { GameObject } from "../Shared/GameObject";
import { Vector2 } from "../Shared/Vector2";

export class GameSimulation {
    ball: GameObject;
    paddles: GameObject[] = [];
    ballSpeed: number = 150;
    paddleSpeed: number = 1;
    clock: number = 0;
    screen: Vector2;
    simulationTime: number;

    public constructor() {
        this.screen = new Vector2(500, 300);

        this.ball = new GameObject();
        this.ball.size = new Vector2(5, 5);
        this.ball.position = new Vector2(this.screen.x / 2, this.screen.y / 2);
        this.ball.velocity = new Vector2(0.5 * this.ballSpeed, 0.5 * this.ballSpeed);

        this.simulationTime = 0;

        let paddle = new GameObject();
        paddle.position = new Vector2(10, this.screen.y / 2);
        paddle.size = new Vector2(5, 25);

        this.paddles.push(paddle);

        let paddle2 = new GameObject();
        paddle2.position = new Vector2(this.screen.x - 15, this.screen.y / 2);
        paddle2.size = new Vector2(2, 25);

        this.paddles.push(paddle2);
    }

    public simulate(deltaTime: number) {
        if (this.ball.getBounds().left < 0) {
            this.ball.velocity.x = -this.ball.velocity.x;
            //console.log("Bump left");
        }

        if (this.ball.getBounds().right > this.screen.x) {
            this.ball.velocity.x = -this.ball.velocity.x;
            //console.log("Bump right");
        }

        if (this.ball.getBounds().top < 0) {
            this.ball.velocity.y = -this.ball.velocity.y;
            //console.log("Bump top");
        }

        if (this.ball.getBounds().bottom > this.screen.y) {
            this.ball.velocity.y = -this.ball.velocity.y;
            //console.log("Bump bottom");
        }

        let paddle0FuturePosition = this.getFuturePosition(this.paddles[0], deltaTime);

        if (this.testAabb(paddle0FuturePosition, this.paddles[0].size, this.ball.position, this.ball.size)) {
            this.ball.velocity.x = -this.ball.velocity.x;
            //console.log("Player 0 hit the ball");
        }

        let paddle1FuturePosition = this.getFuturePosition(this.paddles[1], deltaTime);

        if (this.testAabb(paddle1FuturePosition, this.paddles[1].size, this.ball.position, this.ball.size)) {
            this.ball.velocity.x = -this.ball.velocity.x;
            //console.log("Player 1 hit the ball");
        }

        this.updatePosition(this.ball, deltaTime);

        for (var paddle of this.paddles) {
            this.updatePosition(paddle, deltaTime);
        }

        this.simulationTime += deltaTime;
    }

    input(id: number, type: string): any {
        let newVelocity = new Vector2(0, 0);

        if (type === 'left')
            newVelocity.y = -1;

        if (type === 'right')
            newVelocity.y = 1;

        this.paddles[id].velocity = newVelocity;
    }

    updatePosition(gameObject: GameObject, deltaTime: number): any {
        gameObject.position.x += gameObject.velocity.x * deltaTime / 1000;
        gameObject.position.y += gameObject.velocity.y * deltaTime / 1000;
    }

    getFuturePosition(gameObject: GameObject, deltaTime: number): Vector2 {
        let futurePos = new Vector2(0, 0);
        futurePos.x = gameObject.position.x + gameObject.velocity.x * deltaTime;
        futurePos.y = gameObject.position.y + gameObject.velocity.y * deltaTime;

        return futurePos;
    }

    clearInput(id: number): any {
        this.paddles[id].velocity = new Vector2(0, 0);
    }

    testAabb(aPosition: Vector2, aSize: Vector2, bPosition: Vector2, bSize: Vector2) : boolean {
        if (Math.abs(aPosition.x - bPosition.x) > (aSize.x / 2 + bSize.x / 2)) return false;
        if (Math.abs(aPosition.y - bPosition.y) > (aSize.y / 2 + bSize.y / 2)) return false;

        return true;
    }
}