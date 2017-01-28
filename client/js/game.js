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
        console.log(data);
        if (ballInitiated)
        {
            if (Math.abs(ball.position.x - data.ball.position.x) > 2)
            {
                ball.position.x = data.ball.position.x;
            }
            
            if (Math.abs(ball.position.y - data.ball.position.y) > 2)
            {
                ball.position.y = data.ball.position.y;
            }
            
            ball.body.velocity.x = data.ball.velocity.x;
            ball.body.velocity.y = data.ball.velocity.y;
            
        }
        else
        {
            ballcoordX = data.ball.position.x;
            ballcoordY = data.ball.position.y;
        }
    });
}

/*
function update () {

    if (ballInitiated)
    {
    }
}
*/

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
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    ball = game.add.sprite(ballcoordX, ballcoordY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    
    ballInitiated = true;
}