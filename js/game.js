//main container
var canvas;
var cContext;

//paddle
var p1PaddleX;
var p2PaddleX;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
var paddleY_offset = 0.10;
var p2PaddleX_speed;

//ball
var ballXcoord;
var ballYcoord;
const BALL_WIDTH = 20;
const BALL_HEIGHT = 20;
var ballXSpeed = 5;
var ballYSpeed = -5;    //negative to move the ball up.
var ballDir = true      //true = go right. false = go left

//gives a Y range for the playable area. Area behind the paddle is considered.
//set in window.onload
var minY_range;
var maxY_range;
//gives a X range for the playable area.
//set in window.onload
var minX_range;
var maxX_range;

//score
var p1Score = 0;
var p2Score = 0;
var scoreThreshold = 3; //how long the game will be. set in loadUserSettings()
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

//set variable settings to get the game going
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
    minY_range = (canvas.height * paddleY_offset) + PADDLE_HEIGHT;
    maxY_range = (canvas.height - (canvas.height * paddleY_offset)) - PADDLE_HEIGHT;
    //set the min and max range for X axis
    minX_range = 0;
    maxX_range = canvas.width;
    //load user's settings
    loadUserSettings();
}

//load user settings. name and difficulty
function loadUserSettings()
{
    //get the user's name. default is 'player1'
    var name = $("#username").val();
    if(name.length == 0)
    {
        p1Name = "player 1";
    }
    else
    {
        p1Name = name;
    }

    //get difficulty
        //easy:   ball goes slow
        //        computer's paddle move slowly
        //        score threshold is 5
        //normal: ball goes in normal speed
        //        computer's paddle moves in normal speed
        //        score threshold is 10
    var difficulty = $("#difficulty :radio:checked").val();

    if(difficulty == "easy")
    {
        ballXSpeed = 3;
        ballYSpeed = -3;
        p2PaddleX_speed = 3;
        scoreThreshold = 5;
    }
    else if(difficulty == "normal")
    {
        ballXSpeed = 5;
        ballYSpeed = -5;
        p2PaddleX_speed = 6;
        scoreThreshold = 10;
    }
}

//draw the elements and move them.
function startGame()
{
    moveElements();
    drawAll();
}

//reset the score. place the paddle (x axis only) and the ball in the center.
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

//showen when a player wins the game.
function showWinScreen()
{
    cContext.font = "30px Arial";
    cContext.fillStyle = "white";
    //if player 1 wins
    if(p1Score >= scoreThreshold)
    {
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
              maxY_range + 2,                                     // Y coordinate
              PADDLE_WIDTH,                                     // width
              PADDLE_HEIGHT,                                    // height
              "white");                                         // colour
    //player 2 paddle, top
    createBox(p2PaddleX,                                        // X coordinate
              minY_range - PADDLE_HEIGHT,                         // Y coordinate
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
    createBox(ballXcoord - (BALL_WIDTH / 2),                     // X coordinate
              ballYcoord - (BALL_HEIGHT / 2),                    // Y coordinate
              BALL_WIDTH,                                        // width
              BALL_HEIGHT,                                       // height
              "red");                                           // colour

}

//used when a player has scored.
function reset()
{
    //if player 1 scored
    if(ballYcoord < minY_range - PADDLE_HEIGHT*2) //*2 to offset the PADDLE_HEIGHT value.
    {
        //switch the ball to player 2.
        ballYSpeed = -ballYSpeed;
    }
    //if player 2 scored
    else if(ballYcoord > maxY_range + PADDLE_HEIGHT*2) //*2 to offset the PADDLE_HEIGHT value.
    {
        //switch the ball to player 1.
        ballYSpeed = -ballYSpeed;
    }

    //check if either of the players has reached the score threshold
    if(p1Score >= scoreThreshold || p2Score >= scoreThreshold)
    {
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

//move the ball and check if a player
//scored or deflected the ball with a paddle.
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

//check if player 2 scored or
//player 1 deflected the ball with the paddle
function checkPlayer1()
{
    //if player 2 scored
    if(ballYcoord > canvas.height ||                                //check if it went passed horizontally
       (ballYcoord > canvas.height && ballXcoord <= 0) ||           //check if it went passed left diagonaly
       (ballYcoord > canvas.height && ballXcoord >= canvas.width))  //check if it went passed right diagonaly
    {
        p2Score++;
        reset();
    }

    //if the ball is close to player 1
    else if(ballYcoord > maxY_range - BALL_HEIGHT/2 &&
            ballYcoord < maxY_range)
    {
        //check if player's paddle was there.
        if(ballXcoord > p1PaddleX &&
           ballXcoord < p1PaddleX + PADDLE_WIDTH)
        {
            ballYSpeed = -ballYSpeed;
            //bouncing in an angle
            var deltaX = ballXcoord - (p1PaddleX + (PADDLE_WIDTH / 2));
            ballXSpeed = deltaX * 0.35;
        }
    }
}

//check if player 1 scored or
//player 1 deflected the ball with the paddle
function checkPlayer2()
{
    //if player 1 scored
    if(ballYcoord < 0 ||                                //check if it went passed horizontally
       (ballYcoord < 0 && ballXcoord <= 0) ||           //check if it went passed left diagonaly
       (ballYcoord < 0 && ballXcoord >= canvas.width))  //check if it went passed right diagonaly
    {
        p1Score++;
        reset();
    }

    //if the ball is close to player 2
    else if(ballYcoord < minY_range + BALL_HEIGHT/2 &&
            ballYcoord > minY_range)
    {
        //check if player's 2 paddle was there.
        if(ballXcoord > p2PaddleX &&
           ballXcoord < p2PaddleX + PADDLE_WIDTH)
        {
            ballYSpeed = -ballYSpeed;
            //bouncing in an angle
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
    if(ballXcoord < minX_range + BALL_WIDTH/2 && (ballYcoord > minY_range && ballYcoord < maxY_range))
    {
        ballXSpeed = -ballXSpeed;
    }
    if(ballXcoord > maxX_range - BALL_WIDTH/2 && (ballYcoord > minY_range && ballYcoord < maxY_range))
    {
        ballXSpeed = -ballXSpeed;
    }
}

//draw a net in the center and for the paddles
function drawNet()
{
    for(var i = 0; i < canvas.width; i += 40)
    {
        createBox(i, canvas.height/2-1, 20, 2, "white");
        createBox(i, minY_range, 20, 2, "green");
        createBox(i, maxY_range, 20, 2, "green");
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
}

//moving player 2 paddle
function moveP2()
{
    //simple AI computer
    var p2PaddleX_center = p2PaddleX + (PADDLE_WIDTH / 2);
    // +/- 35 so the computer paddle won't jitter
    //stop the paddle once it reached the end of either side.
    if(p2PaddleX_center < ballXcoord - 35 &&
       (p2PaddleX + PADDLE_WIDTH <= maxX_range))
    {
        //move right
        p2PaddleX += p2PaddleX_speed;
    }
    else if(p2PaddleX_center > ballXcoord + 35 &&
            (p2PaddleX >= minX_range))
    {
        //move left
        p2PaddleX -= p2PaddleX_speed;
    }
}

//use canvas context to create and place the rectangle/square in the canvas
function createBox(xCoord, yCoord, width, height, colour)
{
    cContext.fillStyle = colour;
    cContext.fillRect(xCoord, yCoord, width, height);
}
