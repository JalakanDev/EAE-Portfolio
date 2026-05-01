var redSquare;
var height = 350;
var width = 1200;
var speed = 5;
var Text;
var score;
var scoreText;
var scoreText2;
var startText;

var obstacles = [];
const key = {
  Up : 38,
  Left : 37,
  Down: 40,
  Right: 39,
  Space: 32,
  R: 82,
  Enter: 13
};

var gameStarted = false;

// init game and gameObjects
function startGame() {
  score = 0;
  myGameArea.start();
  redSquare = new component(30,30, 'red', 10, 120,);
  obstacle = new component(30, 100, 'green', 300, 120);
  obstacles = [];
  
  Text = new component("50px", "Arial", "red", myGameArea.canvas.width/2, myGameArea.canvas.height/2, "text");
  Text.text = "";
  
  scoreText = new component("30px", "Arial", "black", 65, 20, "text");
  scoreText.text = "";

  scoreText2 = new component('20px', "Arial", "black", 
  myGameArea.canvas.width/2, 
  (myGameArea.canvas.height/2) + 40, "text");
  scoreText2.text = '';
}

// main game area
var myGameArea = {
  canvas: document.createElement('canvas'),
  keys: [],
  interval : null,
  start: function () {
    if (!this.canvasAdded) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.context = this.canvas.getContext('2d');
      this.canvas.style.border = "2px solid black";
      document.getElementById("gameContainer").appendChild(this.canvas);
      this.canvasAdded = true;
    }
    this.frameNo = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function (e) {
      myGameArea.keys[e.keyCode] = true;
      if (e.keyCode === key.Space) {
        e.preventDefault();
      }
    })
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = false;
    })

    window.addEventListener('keydown', function (e){
      if (e.keyCode === key.Enter && !gameStarted) {
        gameStarted = true;
      }
    });
  },
  clear: function () {
    let ctx = this.context;

    // Create vertical gradient from grass → sky → clouds
    let gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0.4, "#87CEEB");    // Blue sky at top
    gradient.addColorStop(0, "#ffffff");  // White clouds in the middle

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};

function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 === 0){
    return true;
  }
  return false;
}

// create component (duh)
function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  
  if (type === "image") {
    this.image = new Image();
    this.image.src = color;
  }

  // player variables
  this.velocityY = 0;
  this.gravity = 0.2;
  this.flapStr = -3.1;
  
  this.counted = false;
  this.update = function () {
    ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.text, this.x, this.y);
    } else if (this.type === "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
  };
  // collision check func
  this.colCheck = function(collidedObj) {
    var myLeft = this.x;
    var myRight = this.x + (this.width);
    var myTop = this.y;
    var myBottom = this.y + (this.height);
    var collidedLeft = collidedObj.x;
    var collidedRight = collidedObj.x + collidedObj.width;
    var collidedTop = collidedObj.y;
    var collidedBottom = collidedObj.y + collidedObj.height;
    var collide = true;
    
    if (myBottom < collidedTop ||
    (myTop > collidedBottom) ||
    (myRight < collidedLeft) ||
    (myLeft > collidedRight)) {
      collide = false;
    }
    return collide;
  }
}

// add gravity
function applyGravity(player) {
  player.velocityY += player.gravity;
  player.y += player.velocityY;
  
  // fall check
  var bottom = myGameArea.canvas.height - player.height;
  if (player.y > bottom) {
    dideText();
    myGameArea.stop();
  }
  
  if (player.y < 0) { // prevent going above screen
    player.y = 0;
    player.velocityY = 0;
  }
}

function flap(playe) {
  playe.velocityY = playe.flapStr;
}

var pressed = false;
function controls(player) {
  
  if (myGameArea.keys[key.Space]) {
    if (!pressed) {
      flap(player);
      pressed = true;
    }
  } else {
    pressed = false;
  } 
}

function dideText() {
  Text.text = "You dide :(";
  scoreText2.text = "Your score: " + score;
  
  Text.update();
  scoreText2.update();
}

// Game Loop
function updateGameArea() {
  myGameArea.clear();
  redSquare.update();
  startText = new component("50px", "Arial", "black", myGameArea.canvas.width/2, myGameArea.canvas.height/2, "text");
  
  if (!gameStarted) {
    startText.text = "Press Enter to Play!";
    startText.update();
    return;
  }

  


  var x, y;
  
  for (i = 0; i < obstacles.length; i+=1) {
    if (redSquare.colCheck(obstacles[i])) {
      dideText();
      myGameArea.stop();
      return;
    }
  }
  
  myGameArea.clear();
  myGameArea.frameNo += 1;
  var obstacleSpacing = 60;
  if (myGameArea.frameNo === 1 || everyInterval(obstacleSpacing)) {
    x = myGameArea.canvas.width;
    minHeight = 30;
    maxHeight = 200;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    minGap = 50;
    maxGap = 190;  
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    obstacles.push(new component(10, height, "green", x, 0));
    obstacles.push(new component(10, x - height - gap, "green", x, height + gap));
  }
  
  var obstacleSpeed = -3;
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += obstacleSpeed;
    obstacles[i].update();
    
    if (i % 2 === 0 && !obstacles[i].counted && obstacles[i].x + obstacles[i].width < redSquare.x) {
      score++;
      obstacles[i].counted = true; // prevent double counting
    }
  }
  
  scoreText.text = "Score: " + score;
  // call update functions here
  scoreText.update();
  applyGravity(redSquare);
  controls(redSquare);
  redSquare.update();
}

function resetGame() {
  startGame();
}

// Make sure the DOM is fully loaded
window.onload = function() {
  startGame(); // start the game initially

  // Attach reset button handler
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.onclick = function() {
    resetGame();
  };
};

window.addEventListener('keydown', function (e) {
  if (e.key === 'r' || e.key === "R") {
    resetGame();
  }
});

document.getElementById("flapBtn").onclick = function () {
    if (!pressed) {
        flap(redSquare);
        pressed = true;
        // simulate space key being pressed for one frame
        setTimeout(() => { pressed = false; }, 50);
    }
};
