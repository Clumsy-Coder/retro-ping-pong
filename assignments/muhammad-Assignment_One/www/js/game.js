//main container
var canvas;
var cContext;

//paddle
var p1Paddle;
var p2Paddle;
const paddleWidth = 2;
const paddleHeight = 10;

//ball
var ballXcoord;
var ballYcoord;

//score
var p1Score;
var p2Score;

//player name
var p1Name;

//frames per second
const FPS = 60;


window.onload = function()
{
    canvas = document.getElementById("gameCanvas");
    cContext = canvas.getContext("2d");
    //set the ball x and y coordinate
    ballXcoord = canvas.width / 2;
    ballYcoord = canvas.height / 2;
    setInterval(function() {
                            moveElements();
                            setup();
                           }
                , 1000 / FPS);
}

//create the objects of the game
function setup()
{
    //create the background
    createBox(0, 0, canvas.width, canvas.height, "black");
    
    //create the paddle
    
    //create the ball
    createBox(ballXcoord, ballYcoord, 10, 10, "red");
    
    //create the center line
    
    //create the score board
}

//move the ball and the paddle
function moveElements()
{
    
}

function createBox(xCoord, yCoord, width, height, colour)
{
    cContext.fullStyle(colour);
    cContext.fillRect(xCoord, yCoord, width, height);
}

function moveP1()
{
    
}

function moveP2()
{
    
}