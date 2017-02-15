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
var ballDir = true      //true = go right. false = go left

//gives a Y range for the playable area. Area behind the paddle is not considered.
//set in window.onload
var minRange;
var maxRange;
var minXRange;
var maxXRange;

//score
var p1Score = 0;
var p2Score = 0;
var scoreThreshold = 3; //how long will be. set in loadUserSettings()
var winScreen = false;

//player name
var p1Name = "player 1";

//frames per second
const FPS = 60;

////////////////////////////
//once the page has finished loading.
window.onload = function()
{
    loadGameSettings();
    setInterval(startGame, 1000 / FPS);
}

function loadGameSettings()
{
    $("#gameCanvas").attr("width", window.innerWidth);
    $("#gameCanvas").attr("height", window.innerHeight);
    
    canvas = document.getElementById("gameCanvas");
    cContext = canvas.getContext("2d");
    //set the ball x and y coordinate to the center of the game
    ballXcoord = canvas.width / 2;
    ballYcoord = canvas.height / 2;
    //center the player's paddle
    p1PaddleX = (canvas.width / 2) - PADDLE_WIDTH / 2;
    p2PaddleX = (canvas.width / 2) - PADDLE_WIDTH / 2;
    //set the min and max range for Y axis
    minRange = (canvas.height * paddleY_offset) + PADDLE_HEIGHT;
    maxRange = (canvas.height - (canvas.height * paddleY_offset)) - PADDLE_HEIGHT;
    //set the min and max range for X axis
    minXRange = 0;
    maxXRange = canvas.width;
    //load user's settings
    loadUserSettings();
}

function loadUserSettings()
{
    //get the user's name. default is 'player1'
    
    //get difficulty
        //easy:   ball goes slow
        //        computer's paddle move slowly
        //        score threshold is 5
        //normal: ball goes in normal speed
        //        computer's paddle moves in normal speed
        //        score threshold is 10
        //hard:   ball goes normal speed. Gets faster after each successful paddle strike
        //        computer's paddle moves in higher speed
        //        score threshold is 20
}

function startGame()
{
    moveElements();
    drawAll();
}

function restartGame()
{
    //set the paddle location
    p1PaddleX = (canvas.width / 2) - PADDLE_WIDTH / 2;
    p2PaddleX = (canvas.width / 2) - PADDLE_WIDTH / 2;
    //set the ball location
    ballXcoord = canvas.width / 2;
    ballYcoord = canvas.height / 2;
    //set the score to 0
    p1Score = p2Score = 0;
    //set winScreen to false. Just in case
    winScreen = false;
}

function showWinScreen()
{
    cContext.font = "30px Arial";
    cContext.fillStyle = "white";
    //if player 1 wins
    if(p1Score >= scoreThreshold)
    {
        var msg = p1Name + " won!";
        cContext.textAlign = "center";
        cContext.fillText("'" + p1Name + "' wins!", 
                          canvas.width / 2, 
                          canvas.height/2);

    }
    //player 2 wins
    else
    {
        cContext.textAlign = "center";
        cContext.fillText("'player 2' wins!", 
                          canvas.width / 2, 
                          canvas.height/2);
    }

    cContext.font = "20px Arial";
    cContext.textAlign = "center";
    cContext.fillText("Click or tap to continue", 
                          canvas.width / 2, 
                          (canvas.height - (canvas.height * 0.30)));

    $(document).on('mousedown', function(event){
        restartGame();
    });

    $(document).on('tap', function(e){
        restartGame();
    });
}

//create the objects of the game
function drawAll()
{
    //create the background
    createBox(0, 0, canvas.width, canvas.height, "black");
    
    //if the game has ended
    if(winScreen)
    {
        showWinScreen();
        return;
    }
    
    //create the paddle
    //player 1 paddle, bottom
    createBox(p1PaddleX,                                        // X coordinate
              maxRange + 2,                                     // Y coordinate
              PADDLE_WIDTH,                                     // width
              PADDLE_HEIGHT,                                    // height
              "white");                                         // colour
    //player 2 paddle, top
    createBox(p2PaddleX,                                        // X coordinate
              minRange - PADDLE_HEIGHT,                         // Y coordinate
              PADDLE_WIDTH,                                     // width
              PADDLE_HEIGHT,                                    // height
              "white");                                         // colour
    
    //create the center line and a goal line for the players
    drawNet();
    
    //create the score board
    cContext.font = "30px Arial";
    cContext.fillStyle = "white";
    cContext.fillText(p1Score,                                          // text
                      (canvas.width/2) * 0.15,                          // X coordinate
                      ((canvas.height/2) * 0.15) + canvas.height/2);    // Y coordinate
    
    cContext.fillText(p2Score,                                          // text
                      canvas.width - (canvas.width * 0.15),             // X coordinate
                      canvas.height/2 - ((canvas.height/2) * 0.15));    // Y coordinate
    
    //create the ball
    createBox(ballXcoord - (ballWidth / 2),                     // X coordinate
              ballYcoord - (ballHeight / 2),                    // Y coordinate
              ballWidth,                                        // width
              ballHeight,                                       // height
              "red");                                           // colour
    
}

//used when a player has scored.
function reset()
{   
    //if player 1 scored
    if(ballYcoord < minRange - PADDLE_HEIGHT*2) //*2 to offset the PADDLE_HEIGHT value.
    {
        //switch the ball to player 2.
        ballYSpeed = -ballYSpeed;
    }
    //if player 2 scored
    else if(ballYcoord > maxRange + PADDLE_HEIGHT*2) //*2 to offset the PADDLE_HEIGHT value.
    {
        //switch the ball to player 1.
        ballYSpeed = -ballYSpeed;
    }
    
    //check if either of the players has reached the score threshold
    if(p1Score >= scoreThreshold || p2Score >= scoreThreshold)
    {
        //reset the score
//        p1Score = p2Score = 0;
        winScreen = true;
    }
    
    //reset the position of the ball
    ballXcoord = canvas.width / 2;
    ballYcoord = canvas.height / 2;
    
    //change ball X direction when someone scores. 
    //true = go right
    //false = go left
    if(ballDir)
    {
        ballXSpeed = 5;
        ballDir = false;
    }
    else
    {
        ballXSpeed = -5;
        ballDir = true;
    }
}

//move the ball and the paddle
function moveElements()
{
    //check if the game has ended
    if(winScreen)
    {
        return;
    }
    moveBall();
    moveP1();
    moveP2();
}

function moveBall()
{
    //move the ball
    ballYcoord += ballYSpeed;
    ballXcoord += ballXSpeed;
    
    //check if the ball is touching the side walls
    sideWallBounce();
    
    //check if the ball is close to player 2.
    //check if it touched the paddle or player 1 scored.
    checkPlayer2();
    
    //check if the ball is close to player 1.
    //check if it touched the paddle or player 2 scored.
    checkPlayer1();
}

function checkPlayer1()
{
    //if player 2 scored
    if(ballYcoord > canvas.height)
    {
        p2Score++;
        reset();
    }
    
    //if the ball is close to player 1
    else if(ballYcoord > maxRange - ballHeight/2)
    {
        //check if player's paddle was there.
        if(ballXcoord > p1PaddleX && 
           ballXcoord < p1PaddleX + PADDLE_WIDTH)
        {
            ballYSpeed = -ballYSpeed;
            var deltaX = ballXcoord - (p1PaddleX + (PADDLE_WIDTH / 2));
            ballXSpeed = deltaX * 0.35;
        }
    }
}

function checkPlayer2()
{
    //if player 1 scored
    if(ballYcoord < 0)
    {
        p1Score++;
        reset();
    }
    
    //if the ball is close to player 2
    else if(ballYcoord < minRange + ballHeight/2)
    {
        //check if player's 2 paddle was there.
        if(ballXcoord > p2PaddleX && 
           ballXcoord < p2PaddleX + PADDLE_WIDTH)
        {
            ballYSpeed = -ballYSpeed;
            var deltaX = ballXcoord - (p2PaddleX + (PADDLE_WIDTH / 2));
            ballXSpeed = deltaX * 0.35;
        }
    }
}

//bounce the ball of the side
function sideWallBounce()
{
    //code to bounce the ball of the side walls (left and right)
    //don't bounce beyond the paddle. might cause some bugs
    if(ballXcoord < minXRange + ballWidth/2 && (ballYcoord > minRange && ballYcoord < maxRange))
    {
        ballXSpeed = -ballXSpeed;
    }
    if(ballXcoord > maxXRange - ballWidth/2 && (ballYcoord > minRange && ballYcoord < maxRange))
    {
        ballXSpeed = -ballXSpeed;
    }
}

//draw a net in the center of the page
function drawNet()
{   
    for(var i = 0; i < canvas.width; i += 40)
    {
        createBox(i, canvas.height/2-1, 20, 2, "white");
        createBox(i, minRange, 20, 2, "green");
        createBox(i, maxRange, 20, 2, "green");
    }
}

//moving player 1 paddle
function moveP1()
{
    //get the mouse position to move player 1 paddle
    //supports desktop and mobile device
    $(document).on('vmousemove', function(event){
        p1PaddleX = event.pageX - (PADDLE_WIDTH / 2);
    });

    $(document).on('taphold', function(e){
        p1PaddleX = e.pageX - (PADDLE_WIDTH / 2);
    });
    
//    var p1PaddleX_center = p1PaddleX + (PADDLE_WIDTH / 2);
//    // +/- 35 so the computer paddle won't jitter
//    //stop the paddle once it reached the end of either side.
//    if(p1PaddleX_center < ballXcoord - 35 && 
//       (p1PaddleX + PADDLE_WIDTH <= maxXRange))
//    {
//        //move right
//        p1PaddleX += 7;
//    }
//    else if(p1PaddleX_center > ballXcoord + 35 &&
//            (p1PaddleX >= minXRange))
//    {
//        //move left
//        p1PaddleX -= 7;
//    }
}

//moving player 2 paddle
function moveP2()
{
    //simple AI computer
    var p2PaddleX_center = p2PaddleX + (PADDLE_WIDTH / 2);
    // +/- 35 so the computer paddle won't jitter
    //stop the paddle once it reached the end of either side.
    if(p2PaddleX_center < ballXcoord - 35 && 
       (p2PaddleX + PADDLE_WIDTH <= maxXRange))
    {
        //move right
        p2PaddleX += 6;
    }
    else if(p2PaddleX_center > ballXcoord + 35 &&
            (p2PaddleX >= minXRange))
    {
        //move left
        p2PaddleX -= 6;
    }
}

//use canvas context to create and place the rectangle/square in the canvas
function createBox(xCoord, yCoord, width, height, colour)
{
    cContext.fillStyle = colour;
    cContext.fillRect(xCoord, yCoord, width, height);
}