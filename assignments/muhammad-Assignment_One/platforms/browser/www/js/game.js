//main container
var canvas;
var cContext;

//paddle
var p1Paddle;
var p2Paddle;
const paddleWidth = 100;
const paddleHeight = 15;

//ball
var ballXcoord;
var ballYcoord;
const ballWidth = 20;
const ballHeight = 20;

//score
var p1Score;
var p2Score;

//player name
var p1Name;

//frames per second
const FPS = 60;

//functions


window.onload = function()
{
    $("#gameCanvas").attr("width", window.innerWidth);
    $("#gameCanvas").attr("height", window.innerHeight);
    
    console.log(document.getElementById("gameCanvas"));
    canvas = document.getElementById("gameCanvas");
    cContext = canvas.getContext("2d");
    //set the ball x and y coordinate
    ballXcoord = canvas.width / 2;
    ballYcoord = canvas.height / 2;
    setInterval(init(), 1000 / FPS);
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
    createBox(canvas.width/2 - (paddleWidth / 2), canvas.height - (canvas.height * 0.10), paddleWidth, paddleHeight, "white");
    //player 2 paddle, top
    createBox(canvas.width/2 - (paddleWidth / 2), (canvas.height * 0.10), paddleWidth, paddleHeight, "white");
    
    //create the center line
    drawNet();
    
    //create the ball
    createBox(ballXcoord, ballYcoord, ballWidth, ballHeight, "red");
    
    
    //create the score board
}

//move the ball and the paddle
function moveElements()
{
    //move the ball
    ballYcoord += 5;
    
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
//        createBox(canvas.height / 2, i, 2, 20, "white");
        createBox(i, canvas.height/2-1, 20, 2, "white");
    }
}

function moveP1()
{
    
}

function moveP2()
{
    
}