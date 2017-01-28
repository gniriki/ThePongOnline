import { Vector2 } from "./Vector2";
import { Rect } from "./Rect";

export class GameObject {
    public position: Vector2;
    public velocity: Vector2;
    public size: Vector2;
    private bounds: Rect;

    public constructor() {
        this.position = new Vector2(0,0);
        this.velocity = new Vector2(0, 0);
        this.size = new Vector2(0, 0);
        this.bounds = new Rect();
    }

    public getBounds(): Rect {
        this.bounds.left = this.position.x - this.size.x / 2;
        this.bounds.right = this.position.x + this.size.x / 2;
        this.bounds.top = this.position.y - this.size.y / 2;
        this.bounds.bottom = this.position.y + this.size.y / 2;

        return this.bounds;
    }
}