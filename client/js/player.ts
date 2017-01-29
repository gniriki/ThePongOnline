var Phaser: any;

var colors: number[] = [0xff0000ff, 0x00ff00ff];

export class Player {
    game: any;
    sprite: any;
    constructor(game: any, data: any, num: number) {
        console.log(data);
        this.game = game;
        this.sprite = game.add.sprite(data.position.x, data.position.y, 'player');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.width = data.size.x;
        this.sprite.height = data.size.y;
        this.sprite.tint = colors[num];
    }
}