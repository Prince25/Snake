const GRID_WIDTH = GRID_HEIGHT = 20;
const ROWS = 20;
const COLS = 20;
const GROW_SIZE = 3;    // The amount snake grows by after eating food
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
  noStroke(); 
 
  hasFood = false;
  direction = '';
  snake = [{x: 0, y: 0}];
  snakeLength = 1;
  speed = 5;
  inGame = true;
  pause = false;

  frameRate(speed); 
}


function draw() {
  background(255);  // Clear screen

  if (DEBUG) {
    drawGrid();
  }
  
  if (pause) {
    textSize(50);
    textAlign(CENTER);
    text("PAUSE", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT);
  }
  else if (inGame) {
    // Move
    let {x, y} = snake[0]
    switch(direction) {
      case 'w': y--; break;
      case 's': y++; break;
      case 'a': x--; break;
      case 'd': x++; break;
    }
    snake.unshift({x: x, y: y}); // Add the new head to the front
    
    drawTrail();
    checkFood();
    checkCollisions();
    spawnFood();
  }
  else
    gameOver();


  drawScore();
  drawBorder(); 
}


// Draws snake trail
function drawTrail() {
  // Fill the old squares (where snake was)
  for (let i = snakeLength; i < snake.length - 1; i++) {
    let pos = snake[i]
    fill(255)
    rect(pos.x * GRID_WIDTH, pos.y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
    fill(0);
  }
  snake = snake.slice(0, snakeLength);  // Enforce the snake's length

  let color = 255;
  // Fill the new squares (where snake is now)
  for (let i = 0; i < snake.length; i++) {
    pos = snake[i]
    fill(color, 0, 0, 100);
    rect(pos.x * GRID_WIDTH, pos.y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
    fill(0);
    color -= 10;
  }
}


// Check if food is eaten
function checkFood() {
  if (snake[0].x === foodX && snake[0].y  === foodY) {
    snakeLength += GROW_SIZE;
    hasFood = false;
  }
}


function checkCollisions() {
  let head = snake[0]

  // Check wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)
    inGame = false;

  // Check trail collision
  if (snake.some((cell, index) => index != 0 && cell.x == head.x && cell.y == head.y))
    inGame = false;
}


function spawnFood() {
  if (!hasFood) {
    do {
      foodX = randomNumber(0, COLS);
      foodY = randomNumber(0, ROWS);
      // Try again if food coords are on the snake trail
    } while (snake.some(cell => cell.x == foodX && cell.y == foodY)) 
    hasFood = true;
  }
  fill(0, 255, 0, 100);
  rect(foodX * GRID_WIDTH, foodY * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
  fill(0);
}


function gameOver() {
  drawTrail();
  textSize(50);
  textAlign(CENTER);
  text("Game over!", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT);
  textSize(30);
  text("Score: " + (snakeLength - 1).toString(), (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT + 30);
}


function keyPressed() {
  switch(key) {
    case 'w': if (direction != 's') direction = 'w'; if (!inGame) setup(); break;
    case 's': if (direction != 'w') direction = 's'; if (!inGame) setup(); break;
    case 'a': if (direction != 'd') direction = 'a'; if (!inGame) setup(); break;
    case 'd': if (direction != 'a') direction = 'd'; if (!inGame) setup(); break;
    case 'p': if (inGame) pause = !pause;  break;
  }
}


function drawScore() {
  textSize(10);
  textAlign(RIGHT, BOTTOM);
  text("Score: " + (snakeLength - 1).toString(), (COLS) * GRID_WIDTH - 10, (ROWS) * GRID_HEIGHT - 10);
}


function drawBorder() {
  stroke(0);
  strokeWeight(2);
  line(0, 0, width, 0);
  line(0, height, width, height);
  line(0, 0, 0, height);
  line(width, 0, width, height);
  noStroke();
}


function drawGrid() {
  stroke(0);
  strokeWeight(1);
  for(var i = 0; i <= width; i += GRID_WIDTH) {
    line(i, 0, i, height);
    line(0, i, width, i);
  }
  noStroke();
}


// Return int between min and max: min included, max excluded
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
