var game;

var ballInitiated = false;
var ball;

var w = 500;
var h = 300;

var ballcoordX = w / 2;
var ballcoordY = h / 2;

var vx = 0;
var vy = 0;

function setupSocket(socket)
{
    socket.on('simulation', function (data) {
        if (ballInitiated)
        {
            if (Math.abs(ball.position.x - data.ball.position.x) > 3)
            {
                ball.position.x = data.ball.position.x;
            }
            
            if (Math.abs(ball.position.y - data.ball.position.y) > 3)
            {
                ball.position.y = data.ball.position.y;
            }
            
            vx = data.ball.velocity.x;
            vy = data.ball.velocity.y;
        }
        else
        {
            ballcoordX = data.ball.position.x;
            ballcoordY = data.ball.position.y;
        }
    });
}

function update () {

    if (ballInitiated)
    {
        ball.position.x += vx * this.game.time.elapsed / 1000.0;
        ball.position.y += vy * this.game.time.elapsed / 1000.0;
    }
}

function connectToGame()
{
    game = new Phaser.Game(500, 300, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
    var socket = io("http://localhost:1338");
    setupSocket(socket);
}

function preload() {
    game.load.image('ball', 'assets/ball.png');
}

function create() {
    ball = game.add.sprite(ballcoordX, ballcoordY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    
    ballInitiated = true;
}