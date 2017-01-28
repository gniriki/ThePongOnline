var game;

var ballInitiated = false;
var ball;

var w = 500;
var h = 300;

var ballcoordX = w / 2;
var ballcoordY = h / 2;

function setupSocket(socket)
{
    socket.on('simulation', function (data) {
        if (ballInitiated)
        {
            ball.position.x = data.ball.position.x;
            ball.position.y = data.ball.position.y;
        }
        else
        {
            ballcoordX = data.ball.position.x;
            ballcoordY = data.ball.position.y;
        }
    });
}

function connectToGame()
{
    game = new Phaser.Game(500, 300, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
    var socket = io("http://localhost:1338");
    setupSocket(socket);
}

function preload() {
    game.load.image('ball', 'assets/ball.png');
}

function create() {
    ball = game.add.sprite(ballcoordX, ballcoordY, 'ball');
    ballInitiated = true;
}