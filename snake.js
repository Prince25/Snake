const GRID_WIDTH = GRID_HEIGHT = 30;
const ROWS = COLS = 20;
const DEBUG = true;

var foodX;
var foodY;
var hasFood;
var direction;
var snake;
var snakeLength;
var speed; 
var inGame;
var pause;


function setup() {
  createCanvas(COLS * GRID_WIDTH, ROWS * GRID_HEIGHT);
  frameRate(5);  
  // noStroke();
 
  hasFood = false;
  snake = [{x: 0, y: 0}];
  snakeLength = 1;
  speed = 1;
  inGame = true;
  pause = false;
  
  if (DEBUG) {
    // Grid lines
    for(var i = 0; i <= width; i += GRID_WIDTH) {
      line(i, 0, i, height);
      line(0, i, width, i);
    }
  }
}


function draw() {
  if (DEBUG) {

  }

  if (pause) {
    textSize(50);
    textAlign(CENTER);
    text("PAUSE", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT);
  } else if (inGame) {
    // Move
    let {x, y} = snake[0]
    switch(direction) {
      case 'w': y--; break;
      case 's': y++; break;
      case 'a': x--; break;
      case 'd': x++; break;
    }
    snake.unshift({x: x, y: y}); // Add the new head to the front
    
    drawScore();
    checkFood();
    checkCollision();
    drawTrail();
    spawnFood();
  }
  else
    gameOver();
}


function drawScore() {
  textSize(10);
  text("Score: " + (snakeLength - 1).toString(), (COLS) * GRID_WIDTH - 30, (ROWS) * GRID_HEIGHT - 30);
}


function checkFood() {
  if (snake[0].x === foodX && snake[0].y  === foodY) {
    snakeLength += 5;
    hasFood = false;
  }
}


function checkCollision() {

}


function drawTrail() {
  // Fill the old squares
  for (let i = snakeLength; i < snake.length; i++) {
    let pos = snake[i]
    fill(255)
    rect(pos.x * GRID_WIDTH, pos.y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
    fill(0);
  }
  snake = snake.slice(0, snakeLength);  // Enforce the snake's length

  // Fill the new squares
  for (let i = 0; i < snake.length; i++) {
    pos = snake[i]
    fill(255, 0, 0, 100);
    rect(pos.x * GRID_WIDTH, pos.y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
    fill(0);
  }
}


function spawnFood() {
  if (!hasFood) {
    foodX = randomNumber(0, COLS);
    foodY = randomNumber(0, ROWS);
    fill(0, 255, 0, 100);
    rect(foodX * GRID_WIDTH, foodY * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
    fill(0);
    hasFood = true;
  }
}


function keyPressed() {
  switch(key) {
    case 'w': direction = 'w'; break;
    case 's': direction = 's'; break;
    case 'a': direction = 'a'; break;
    case 'd': direction = 'd'; break;
    case 'p': pause = !pause; break;
  }
}


function gameOver() {
  textSize(50);
  textAlign(CENTER);
  text("Game over!", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT);
  textSize(30);
  text("Score: " + (snakeLength - 1).toString(), (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT + 30);
}


// Return int between min and max: min included, max excluded
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
