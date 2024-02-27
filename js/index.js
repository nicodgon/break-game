// Botones
const btnHome = document.querySelector(".btn__home");
const btnPlay = document.querySelector(".btn__play");
const btnMaps = document.querySelector(".btn__maps");
const btnConfig = document.querySelector(".btn__config");

// Maps
const MapA = document.querySelector(".map__a");
const MapB = document.querySelector(".map__b");
const MapC = document.querySelector(".map__c");

//Botones de dificultad
const btnEasy = document.querySelector(".btn__easy");
const btnMedium = document.querySelector(".btn__medium");
const btnHard = document.querySelector(".btn__hard");

// Pantallas
const homeScreen = document.querySelector("#home__screen");
const maps = document.querySelector("#maps");
const config = document.querySelector("#config");
const gameOverScreen = document.querySelector("#game__over");

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

let gameOver = false;

//Velocidad base(media)
let ballDx = 2;
let ballDy = -2;

//Paddle imagen
const paddleImg = new Image();
paddleImg.src = "../assets/images/objects/rocket.png";

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// Mapas
const chooseMap = (map, activeA, activeB, activeC) => {
  homeScreen.style.display = "flex";
  maps.style.display = "none";
  MapA.style.background = activeA;
  MapB.style.background = activeB;
  MapC.style.background = activeC;
  canvas.style.backgroundImage = `url("../assets/images/maps/${map}.jfif")`;
};

MapA.addEventListener("click", () =>
  chooseMap("galaxia", "#f00", "#000", "#000")
);
MapB.addEventListener("click", () =>
  chooseMap("desierto", "#000", "#f00", "#000")
);
MapC.addEventListener("click", () =>
  chooseMap("océano", "#000", "#000", "#f00")
);

// Configuraciòn
const selectDifficulty = (a, b, activeEasy, activeMedium, activeHard) => {
  ballDx = a;
  ballDy = b;
  homeScreen.style.display = "flex";
  config.style.display = "none";
  btnEasy.style.background = activeEasy;
  btnMedium.style.background = activeMedium;
  btnHard.style.background = activeHard;
};

// Dificultad fácil
btnEasy.addEventListener("click", () =>
  selectDifficulty(1, -1, "#f00", "#000", "#000")
);

// Dificultad media
btnMedium.addEventListener("click", () =>
  selectDifficulty(2, -2, "#000", "#f00", "#000")
);

// Dificultad difícil
btnHard.addEventListener("click", () =>
  selectDifficulty(3, -3, "#000", "#000", "#f00")
);

//Función principal (canvas)
function game() {
  gameOver = false;
  homeScreen.style.display = "none";
  canvas.style.display = "flex";
  canvas.width = 448;
  canvas.height = 400;

  // variables de Ball
  const ballRadius = 8;

  let ballX = canvas.width / 2;
  let ballY = canvas.height - (40 + ballRadius);

  // variables de Paddle
  let paddleWidth = 70;
  let paddleHeight = 15;

  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleY = canvas.height - paddleHeight * 2;

  let paddleDx = 3;

  let rightPressed = false;
  let leftPressed = false;

  // variables de Briks
  const brickRowCount = 5;
  const brickColumnCount = 9;
  const brickWidth = 45;
  const brickHeight = 20;
  const brickGap = 2;
  const brickOffsetLeft = 12.5;
  const brickOffsetTop = 10;
  const bricks = [];
  const brickStatus = {
    exists: 1,
    destroyed: 0,
  };

  for (let col = 0; col < brickColumnCount; col++) {
    bricks[col] = [];
    for (let row = 0; row < brickRowCount; row++) {
      const brickX = col * (brickWidth + brickGap) + brickOffsetLeft;
      const brickY = row * (brickHeight + brickGap) + brickOffsetTop;
      const random = Math.floor(Math.random() * 6);
      bricks[col][row] = {
        x: brickX,
        y: brickY,
        status: true,
        color: random,
      };
    }
  }

  //Dibujar la pelota
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
  }

  //Dibujar la pala
  function drawPaddle() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
    // ctx.drawImage(
    //   paddleImg,
    //   0,
    //   15,
    //   paddleWidth,
    //   paddleHeight,
    //   paddleX,
    //   paddleY,
    //   paddleWidth,
    //   paddleHeight,
    // );
  }

  //Dibujar los ladrillos
  function drawBricks() {
    for (let col = 0; col < brickColumnCount; col++) {
      for (let row = 0; row < brickRowCount; row++) {
        const currentBrick = bricks[col][row];
        if (currentBrick.status == brickStatus.destroyed) continue;
        if (currentBrick.color == 0) ctx.fillStyle = "#000";
        if (currentBrick.color == 1) ctx.fillStyle = "#f00";
        if (currentBrick.color == 2) ctx.fillStyle = "#0f0";
        if (currentBrick.color == 3) ctx.fillStyle = "#00f";
        if (currentBrick.color == 4) ctx.fillStyle = "#FF6F50";
        if (currentBrick.color == 5) ctx.fillStyle = "#C100FF";
        ctx.fillRect(currentBrick.x, currentBrick.y, brickWidth, brickHeight);
      }
    }
  }

  //Crear la colisión de la pelota con los ladrillos
  function collisionDetection() {
    for (let col = 0; col < brickColumnCount; col++) {
      for (let row = 0; row < brickRowCount; row++) {
        const currentBrick = bricks[col][row];
        if (currentBrick.status == brickStatus.destroyed) continue;
        if (
          ballX > currentBrick.x &&
          ballX < currentBrick.x + brickWidth &&
          ballY > currentBrick.y &&
          ballY < currentBrick.y + brickHeight
        ) {
          ballDy = -ballDy;
          currentBrick.status = brickStatus.destroyed;
        }
      }
    }
  }

  //Movimiento de la pelota y sus colisiónes
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
    if (
      ballY > paddleY - ballRadius &&
      ballX > paddleX &&
      ballX < paddleX + paddleWidth
    ) {
      ballDy = -ballDy;
    }
    //Si la pelota se cae se pierde la partida
    if (ballY > canvas.height) {
      gameOverScreen.style.display = "flex";
      canvas.style.display = "none";
      gameOver = true;
    }
    ballX += ballDx;
    ballY += ballDy;
  }

  //Movimiento de la pala
  function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleDx;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleDx;
    }
  }

  //Limpiar el canvas por cada frame
  function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  //Funcionalidad de las teclas
  function initEvents() {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    function keyDownHandler(event) {
      const { key } = event;
      if (key == "Right" || key == "ArrowRight" || key == "d" || key == "D") {
        rightPressed = true;
      } else if (
        key == "Left" ||
        key == "ArrowLeft" ||
        key == "a" ||
        key == "A"
      ) {
        leftPressed = true;
      }
    }
    function keyUpHandler(event) {
      const { key } = event;
      if (key == "Right" || key == "ArrowRight" || key == "d" || key == "D") {
        rightPressed = false;
      } else if (
        key == "Left" ||
        key == "ArrowLeft" ||
        key == "a" ||
        key == "A"
      ) {
        leftPressed = false;
      }
    }
  }

  //Llamar a las funciónes
  function draw() {
    cleanCanvas();
    drawBall();
    drawPaddle();
    drawBricks();

    collisionDetection();
    ballMovement();
    paddleMovement();
    initEvents();

    if (!gameOver && canvas.style.display !== "none") {
      window.requestAnimationFrame(draw);
    }
  }

  draw();
}

btnHome.addEventListener("click", () => {
  homeScreen.style.display = "flex";
  canvas.style.display = "none";
  maps.style.display = "none";
  config.style.display = "none";
  gameOverScreen.style.display = "none";
});

btnMaps.addEventListener("click", () => {
  maps.style.display = "flex";
  homeScreen.style.display = "none";
});

btnConfig.addEventListener("click", () => {
  config.style.display = "flex";
  homeScreen.style.display = "none";
});

document.onkeydown = function (event) {
  const { key } = event;
  if (canvas.style.display == "none") {
    if (key == "Escape") {
      homeScreen.style.display = "flex";
      maps.style.display = "none";
      config.style.display = "none";
    }
  }
};

btnPlay.addEventListener("click", game);
