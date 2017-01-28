import { GameObject } from "../Shared/GameObject";
import { Vector2 } from "../Shared/Vector2";

export class GameSimulation {
    ball: GameObject;
    ballSpeed: number = 1;
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
    }

    public simulate(deltaTime: number) {

        this.ball.position.x += this.ball.velocity.x * deltaTime;
        this.ball.position.y += this.ball.velocity.y * deltaTime;

        if (this.ball.getBounds().left < 0) {
            this.ball.velocity.x = -this.ball.velocity.x;
            console.log("Bump left");
        }

        if (this.ball.getBounds().right > this.screen.x) {
            this.ball.velocity.x = -this.ball.velocity.x;
            console.log("Bump right");
        }

        if (this.ball.getBounds().top < 0) {
            this.ball.velocity.y = -this.ball.velocity.y;
            console.log("Bump top");
        }

        if (this.ball.getBounds().bottom > this.screen.y) {
            this.ball.velocity.y = -this.ball.velocity.y;
            console.log("Bump bottom");
        }

        this.simulationTime += deltaTime;
    }
}