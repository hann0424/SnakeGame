// Name: 최용한 ChoiYoungHan
// Date: 2023-12-06 end
// Version: Demo
// Project: Snake Game Project

let Board = [
	["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","W"],
	["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
];

// x and y positions of snake
let Snake = [
	[9,10],
	[10,10],
	[11,10]
];

let Direction = "right";
let Timer;
let Apple;

//score and level variable
let score = 0;
let level = 0;

//this is enemy variable, predatormode variable
let enemy;
let enemyMole = false;
let predatorMode = false;


//game score board and level system
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const levelElement = document.querySelector('.level');

//Getting high score form the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

//Play sound file functions
function playAppleSound(){
    let appleSound = document.getElementById("appleSound");
    appleSound.play();
}
function playHitSound(){
    let hitSound = document.getElementById("hitSound");
    hitSound.play();
}
function playLevelSound(){
    let levelSound = document.getElementById("levelSound");
    levelSound.play();
}
function playStartSound(){
    let startSound = document.getElementById("gameStartSound");
    startSound.play();
}
function playWallSound(){
    let wallSound = document.getElementById("wallSound");
    wallSound.play();
}
function playPredatorSound(){
    let predatorSound = document.getElementById("predatorSound");
	predatorSound.volume = 0.2;
    predatorSound.play();
}

//Changes the terrain when a certain level is reached.
function CreateNewWall(){
	if (Board[15][15] != "S") Board[15][15] = "W";
	if (Board[4][4] != "S") Board[4][4] = "W";
	if (Board[15][4] != "S") Board[15][4] = "W";
	if (Board[4][15] != "S") Board[4][15] = "W";
}
function CreateNewWall2(){
	if (Board[9][9] != "S") Board[9][9] = "W";
	if (Board[10][10] != "S") Board[10][10] = "W";
	if (Board[9][10] != "S") Board[9][10] = "W";
	if (Board[10][9] != "S") Board[10][9] = "W";
}

function CreateApple(){
	//Creating a random x and y positions
	let xRandomPos = Math.floor(Math.random() * 20);
	let yRandomPos = Math.floor(Math.random() * 20);

	//If that position falls on a non-blank space,
	//then make new random positions
	while (Board[yRandomPos][xRandomPos] != "."){
		xRandomPos = Math.floor(Math.random() * 20);
		yRandomPos = Math.floor(Math.random() * 20);
	}
	Apple = [xRandomPos,yRandomPos];
}

//It is inspired by the CreateApple function and randomly summons moles 
//that interfere with the player's movement.
function CreateEnemy(){

	let xRandomPosE = Math.floor(Math.random() * 20);
	let yRandomPosE = Math.floor(Math.random() * 20);
	while (Board[yRandomPosE][xRandomPosE] != "."){
		xRandomPosE = Math.floor(Math.random() * 20);
		yRandomPosE = Math.floor(Math.random() * 20);
	}
	enemy = [xRandomPosE,yRandomPosE];
}

function DrawBoard()
{
	ClearGrid();

	//Add Snake to Board
	for (let i in Snake){
		let xPosOfSnake = Snake[i][0];
		let yPosOfSnake = Snake[i][1];
		Board[yPosOfSnake][xPosOfSnake] = "S";
	}
	
	//Add Apple to Board
	let xPosApple = Apple[0];
	let yPosApple = Apple[1];
	Board[yPosApple][xPosApple] = "A";

	//Draw Board
	for (let y = 0; y < Board.length; y++){
		for (let x = 0; x < Board[y].length; x++){
			if (Board[y][x] == "W") AddBlock(x,y, "red");
			else if (Board[y][x] == ".") AddBlock(x,y, "white");
			else if (Board[y][x] == "S") AddBlock(x,y, "blue");
			else if (Board[y][x] == "A") AddBlock(x,y, "green");
			else if (Board[y][x] == "E") AddBlock(x,y, "enemy");
		}
	}
}


function StartGame(){
	playStartSound();
	CreateApple();
	DrawBoard();
	Timer = setInterval(Tick, 400);
	document.addEventListener("keydown", KeyPressed);

	//Code to prevent duplicate execution of the game.
	document.getElementById("startButton").disabled = true;
}

function KeyPressed(event){
	if (event.keyCode == 38 && Direction != "down") Direction = "up";
	if (event.keyCode == 40 && Direction != "up") Direction = "down";
	if (event.keyCode == 37 && Direction != "right") Direction = "left";
	if (event.keyCode == 39 && Direction != "left") Direction = "right";
}

function UpdateDirection(direction){
	//Set direction
	Direction = direction;
	MoveSnake();
}

function MoveSnake(){
	let isGrowing = false;

	//Get x and y positions of snake head
	let xPosOfSnakeHead = Snake[Snake.length - 1][0];
	let yPosOfSnakeHead = Snake[Snake.length - 1][1];

	//Check for deadly collisions
	//Current position of head
	let xPosHeadNext = Snake[Snake.length - 1][0];
	let yPosHeadNext = Snake[Snake.length - 1][1];

	//Update to next position
	if (Direction == "right") xPosHeadNext++;
	if (Direction == "left") xPosHeadNext--;
	if (Direction == "up") yPosHeadNext--;
	if (Direction == "down") yPosHeadNext++;

	//Check if we hit a wall, snake
	if (Board[yPosHeadNext][xPosHeadNext] == "W"){
		playHitSound();
		GameOver();
		alert("*=*=*=*=*=* Game Over! *=*=*=*=*=*\n\n   You hit your head against the wall!\n\n*=*=*=*=*=* Try again! *=*=*=*=*=*=*");
		location.reload();
	}
	if ( Board[yPosHeadNext][xPosHeadNext] == "S"){
		playHitSound();
		GameOver();
		alert("*=*=*=*=*=* Game Over! *=*=*=*=*=*\n\nYou hit your head against your own body!\n\n*=*=*=*=*=* Try again! *=*=*=*=*=*=*");
		location.reload();
	}

	//It's not Predator mode, and it's game over when it hits a mole.
	if ( Board[yPosHeadNext][xPosHeadNext] == "E" && predatorMode == false){
		playHitSound();
		GameOver();
		alert("*=*=*=*=*=* Game Over! *=*=*=*=*=*\n\n     Attacked by moles!\n\n*=*=*=*=*=* Try again! *=*=*=*=*=*=*");
		location.reload();
	}

	//If you meet a mole while the Predator mode is active, you eat the mole and get 30 points.
	if ( Board[yPosHeadNext][xPosHeadNext] == "E" && predatorMode == true){
		isGrowing = true;
		playAppleSound();
		score = score + 30;
	}
	

	//Check if we hit a apple
	if (Board[yPosHeadNext][xPosHeadNext] == "A"){

		//Set growing to true
		isGrowing = true;

		//play apple sound
		playAppleSound();

		// +10 score
		score = score + 10;
		

		//Below, check the score to raise the player's level
		//and apply factors such as snake movement speed, moles,
		//and terrain changes according to the level.
		if (score == 30){ //Level.1
			enemyMole = true;
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 380);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 60){ //Level.2
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 360);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 100){ //Level.3
			CreateNewWall();
			playWallSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 340);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 150){ //Level.4
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 320);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 200){ //Level.5
			CreateNewWall2();
			playWallSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 300);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 250){ //Level.6
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 270);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 300){ //Level.7
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 240);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 350){ //Level.8
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 210);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 400){ //Level.9
			predatorMode = true;
			playPredatorSound();
			CreateEnemy();
			clearInterval(Timer);
			Timer = setInterval(Tick, 180);
			level++
			levelElement.innerText = `Level: ${level}`;
		}
		if (score == 500){ //Level.10
			CreateEnemy();
			playLevelSound();
			clearInterval(Timer);
			Timer = setInterval(Tick, 150);
			level++
			levelElement.innerText = `Level: ${level}`;
		}

		//Summon moles when the emyMole variable is true.
		if (enemyMole){
			let xPosMole = enemy[0];
			let yPosMole = enemy[1];
			Board[yPosMole][xPosMole] = "E";
		}

		//Change the highscore count
		highScore = score >= highScore ? score : highScore;
		localStorage.setItem("high-score", highScore);
		//Change the score count
		scoreElement.innerText = `Score: ${score}`;
		
		//Set the apple tile to a blank space
		let appleXPos = Apple[0];
		let appleYPos = Apple[1];
		Board[appleYPos][appleXPos] = ".";
		CreateApple();
	}

	//Append (add) another segment to the snake, moving right
	if (Direction == "right"){
		Snake.push([xPosOfSnakeHead + 1, yPosOfSnakeHead]);
	}
	if (Direction == "left"){
		Snake.push([xPosOfSnakeHead - 1, yPosOfSnakeHead]);
	}
	if (Direction == "up"){
		Snake.push([xPosOfSnakeHead, yPosOfSnakeHead - 1]);
	}
	if (Direction == "down"){
		Snake.push([xPosOfSnakeHead, yPosOfSnakeHead + 1]);
	}
	
	if (!isGrowing){
		//Fix the board = replace blank space
		//Get x and y positions of snake head
		let xPosOfSnakeTail = Snake[0][0];
		let yPosOfSnakeTail = Snake[0][1];
		Board[yPosOfSnakeTail][xPosOfSnakeTail] = ".";

		//Remove the last segment from the Snake array
		Snake.shift();
	}
	
	//Redraw Board
	DrawBoard();
}

function GameOver(){
	clearInterval(Timer);
}

//The main logic loop of or program
function Tick(){
	MoveSnake();
}