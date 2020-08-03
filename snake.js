var posx;
var posy;
var grid;
var hasFood;
var direction;
var numRect;
var speed; 


function setup() {
  createCanvas(600,600);
  //noStroke();
 
  posx = 0;
  posy = 0;
  hasFood = false;
  numRect = 1;
  speed = 1;
  grid = Create2DArray(20);
  frameRate(5);
  console.log(grid)
  
  
  for (var i = 0; i < 20; i++)
    for (var j = 0; j < 20; j++) {
      grid[i][j] = false;
    }
}



function draw() {
  
  for(var i = 0; i < width; i+=30) {
   line(i, 0, i, height);
   line(0, i, width, i);
    
  }
  
  drawRects();
  spawnFood();
  
  switch(direction) {
    case 'w': posy--; break;
    case 's': posy++; break;
    case 'a': posx--; break;
    case 'd': posx++; break;
  }

  grid[posx][posy] = true;
}



function drawRects() {
  for (var i = 0; i < 20; i++)
    for (var j = 0; j < 20; j++) {
      if (grid[i][j]) {
        fill(255, 0, 0, 100);
        rect(i * 30, j * 30, 30, 30);
        fill(0);
      }
    }
}


function spawnFood() {
  
  if (!hasFood) {
    var foodX = randomNumber(0, 20);
    var foodY = randomNumber(0, 20);
    fill(0, 255, 0, 100);
    rect(foodX * 30, foodY * 30, 30, 30);
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
  }
  
}


// Helper Functions

function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}