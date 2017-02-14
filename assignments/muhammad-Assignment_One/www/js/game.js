//main container
var canvas;
var cContext;

//paddle
var p1PaddleX;
var p2PaddleX;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
var paddleY_offset = 0.10;

//ball
var ballXcoord;
var ballYcoord;
const ballWidth = 20;
const ballHeight = 20;
var ballXSpeed = 5;
var ballYSpeed = -5;    //negative to move the ball up.

//score
var p1Score;
var p2Score;

//player name
var p1Name;

//frames per second
const FPS = 60;

////////////////////////////

window.onload = function()
{
    $("#gameCanvas").attr("width", window.innerWidth);
    $("#gameCanvas").attr("height", window.innerHeight);
    
    canvas = document.getElementById("gameCanvas");
    cContext = canvas.getContext("2d");
    //set the ball x and y coordinate
    ballXcoord = canvas.width / 2;
    ballYcoord = canvas.height / 2;
    p1PaddleX = (canvas.width / 2) - PADDLE_WIDTH / 2;
    p2PaddleX = (canvas.width / 2) - PADDLE_WIDTH / 2;
    setInterval(init, 1000/FPS);
    
    //get the mouse position to move player 1 paddle
    //supports desktop and mobile device
    $(document).on('vmousemove', function(event){
        p1PaddleX = event.pageX - (PADDLE_WIDTH / 2);
    });

    $(document).on('taphold', function(e){
        p1PaddleX = e.pageX - (PADDLE_WIDTH / 2);
    });

}

function init()
{
    moveElements();
    setup();
}

//create the objects of the game
function setup()
{
    //create the background
    createBox(0, 0, canvas.width, canvas.height, "black");
    
    //create the paddle
    //player 1 paddle, bottom
    createBox(p1PaddleX,                                        // X coordinate
              canvas.height - (canvas.height * paddleY_offset), // Y coordinate
              PADDLE_WIDTH,                                     // width
              PADDLE_HEIGHT,                                    // height
              "white");                                         // colour
    //player 2 paddle, top
    createBox(p2PaddleX,                                        // X coordinate
              (canvas.height * paddleY_offset),                 // Y coordinate
              PADDLE_WIDTH,                                     // width
              PADDLE_HEIGHT,                                    // height
              "white");                                         // colour
    
    //create the center line
    drawNet();
    
    //create the score board
    
    //create the ball
    createBox(ballXcoord, ballYcoord, ballWidth, ballHeight, "red");
    
}

//used when the game has ended.
function reset()
{
    
}

//move the ball and the paddle
function moveElements()
{
    //move the ball
    ballXcoord += ballXSpeed;
    ballYcoord += ballYSpeed;
    
    //code to bounce the ball of the side walls (left and right)
    if(ballXcoord < 0)
    {
        //flip the X value
        ballXSpeed = -ballXcoord;
    }
    if(ballXcoord > canvas.width)
    {
        ballXSpeed = -ballXSpeed;
    }
    //testing if the ball moves up and down when touching the top or bottom wall
    if(ballYcoord < 0)
    {
        //flip the X value
        ballYSpeed = -ballYcoord;
    }
    if(ballYcoord > canvas.height)
    {
        ballYSpeed = -ballYSpeed;
    }
}

function createBox(xCoord, yCoord, width, height, colour)
{
    cContext.fillStyle = colour;
    cContext.fillRect(xCoord, yCoord, width, height);
}

function drawNet()
{
    for(var i = 0; i < canvas.width; i += 40)
    {
        createBox(i, canvas.height/2-1, 20, 2, "white");
    }
}

//moving player 1 paddle
function moveP1()
{
    
}

//moving player 2 paddle
function moveP2()
{
    
}