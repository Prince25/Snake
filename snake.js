const GRID_WIDTH = GRID_HEIGHT = 30;
const ROWS = 20;
const COLS = 20;
const DEBUG = false;

var onMenu;       // Whether we are on menu (boolean)
var difficulty;   // Difficulty of the game (string)
var foodX;        // Food's x position (int)
var foodY;        // Food's y position (int)
var hasFood;      // Whether food is spawned (boolean)
var direction;    // Direction snake is going (string)
var snake;        // Snake's trail positions (array[{x: int, y: int}])
var snakeLength;  // Length of snake (int)
var growSize;     // The amount snake grows by after eating food
var speed;        // Speed of the game (int)
var maxSpeed;     // Maximum speed of game based on difficulty (int)
var alive;        // Whether snake is alive (boolean)
var paused;       // Whether game is paused (boolean)


function setup() {
  createCanvas(COLS * GRID_WIDTH, ROWS * GRID_HEIGHT);
  noStroke(); 
 
  onMenu = true;
  hasFood = false;
  direction = '';
  snake = [{x: 0, y: 0}];
  snakeLength = 1;
  speed = 3;
  alive = false;
  paused = false;

  frameRate(speed); 
}


function draw() {
  background(255);  // Clear screen

  if (DEBUG && !onMenu) {
    drawGrid();
  }
  
  if (onMenu) drawMenu();
  else if (paused) drawPause();
  else if (alive) {
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
    drawGameOver();

  if (!onMenu) drawScore();
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
    snakeLength += growSize;
    if (speed < maxSpeed) { speed += randomNumber(1, 11) / 10; frameRate(speed); }
    hasFood = false;
  }
}


function checkCollisions() {
  let head = snake[0]

  // Check wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)
    alive = false;

  // Check trail collision
  if (snake.some((cell, index) => index != 0 && cell.x == head.x && cell.y == head.y))
    alive = false;

  if (!alive)
    setTimeout(() => setup(), 3000)
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


function keyPressed() {
  switch(key) {
    case '1': if (onMenu) { difficulty = 'easy';    growSize = 1; maxSpeed = 5; alive = true; onMenu = false; } break;
    case '2': if (onMenu) { difficulty = 'medium';  growSize = 2; maxSpeed = 10; alive = true; onMenu = false; } break;
    case '3': if (onMenu) { difficulty = 'hard';    growSize = 3; maxSpeed = 15; alive = true; onMenu = false; } break;

    case 'w': case 'W':
      if (!onMenu && !paused && alive && direction != 's') direction = 'w'; 
      break;

    case 's': case 'S':
      if (!onMenu && !paused && alive && direction != 'w') direction = 's'; 
      break;

    case 'a': case 'A':
      if (!onMenu && !paused && alive && direction != 'd') direction = 'a'; 
      break;

    case 'd': case 'D':
      if (!onMenu && !paused && alive && direction != 'a') direction = 'd'; 
      break;

    case 'p': case 'P': if (alive && !onMenu) paused = !paused;  break;
  }
}


function drawMenu() {
  fill(0);
  textSize(30);
  textAlign(CENTER);
  text("Choose Difficulty", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT - 15);
  textSize(15);
  text("Easy: Press 1", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT + 5);
  text("Medium: Press 2", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT + 25);
  text("Hard: Press 3", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT + 45);
}


function drawPause() {
  textSize(50);
  textAlign(CENTER);
  text("PAUSE", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT);
}


function drawGameOver() {
  drawTrail();
  textSize(50);
  textAlign(CENTER);
  text("Game over!", (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT);
  textSize(30);
  text("Score: " + (snakeLength - 1).toString(), (COLS / 2) * GRID_WIDTH, (ROWS / 2) * GRID_HEIGHT + 30);
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
