const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 448;
canvas.height = 400;

// Ball
const ballRadius = 10;

let ballX = canvas.width / 2;
let ballY = canvas.height - (40 + ballRadius);

let ballDx = 2;
let ballDy = -2;

// Paddle
let paddleWidth = 70;
let paddleHeight = 20;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight * 2;

let paddleDx = 2;

let rightPressed = false;
let leftPressed = false;

// Briks
let briksWidth = 43.72;
let briksHeight = 10;

let briksX = 0;
let briksY = 0;

function drawBall() {
  //Indicamos que empezamos a dibujar
  ctx.beginPath();
  //Dibujamos un circulo
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.fillStyle = "#000";
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBricks() {
  for (let i = 0; i < 44.92 * 10; i += 44.92) {
    ctx.fillStyle = "#00f";
    ctx.fillRect(briksX + i, briksY, briksWidth, briksHeight);
  }
}

function collisionDetection() {}
function ballMovement() {
  //Si la pelota toca los bordes de x rebota
  if (ballX > canvas.width - ballRadius || ballX < ballRadius) {
    ballDx = -ballDx;
  }
  //Si la pelota toca los bordes de y rebota
  if (ballY < ballRadius) {
    ballDy = -ballDy;
  }
  //Si la pelota toca la paleta rebota
  if (ballY > paddleY - ballRadius && ballX > paddleX && ballX < paddleX + paddleWidth) {
    ballDy = -ballDy;
  }
  //Si la pelota se cae se pierde la partida
  if (ballY > canvas.height) {
    document.location.reload();
  }
  ballX += ballDx;
  ballY += ballDy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleDx;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleDx;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  function keyDownHandler(event) {
    const { key } = event;
    if (key == "Right" || key == "ArrowRight") {
      rightPressed = true;
    } else if (key == "Left" || key == "ArrowLeft") {
      leftPressed = true;
    }
  }
  function keyUpHandler(event) {
    const { key } = event;
    if (key == "Right" || key == "ArrowRight") {
      rightPressed = false;
    } else if (key == "Left" || key == "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  cleanCanvas();
  drawBall();
  drawPaddle();
  drawBricks();

  collisionDetection();
  ballMovement();
  paddleMovement();
  initEvents();

  window.requestAnimationFrame(draw);
}

draw();
