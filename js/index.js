// Botones
const btnHome = document.querySelector(".btn__home");
const btnPlay = document.querySelector(".btn__play");
const btnMaps = document.querySelector(".btn__maps");
const btnConfig = document.querySelector(".btn__config");
const btnLeft = document.querySelector("#btn__left");
const btnRight = document.querySelector("#btn__right");

// Maps
const MapA = document.querySelector(".map__a");
const MapB = document.querySelector(".map__b");
const MapC = document.querySelector(".map__c");

//Botones de dificultad desktop
const btnEasyD = document.querySelector(".btn__easy__desktop");
const btnMediumD = document.querySelector(".btn__medium__desktop");
const btnHardD = document.querySelector(".btn__hard__desktop");

//Botones de dificultad mobile
const btnEasyM = document.querySelector(".btn__easy__mobile");
const btnMediumM = document.querySelector(".btn__medium__mobile");
const btnHardM = document.querySelector(".btn__hard__mobile");

// Pantallas
const homeScreen = document.querySelector("#home");
const maps = document.querySelector("#maps");
const config = document.querySelector("#config");
const gameOverScreen = document.querySelector("#game__over");

const gameOverH2 = document.querySelector("#game__over__h2");
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
let destroyedBrickCounter = 0;

//Velocidad base(media)
  let ballDx
  let ballDy
if (
  btnEasyD.style.display == "none"
) {
  ballDx = 2;
  ballDy = -2;
} else {
  ballDx = 4;
  ballDy = -4;
}

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
  exists: true,
  destroyed: false,
};

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
  if (map == "galaxia") paddleImg.src = "../assets/images/objects/rocket.png";
  if (map == "desierto") paddleImg.src = "../assets/images/objects/cactus.png";
  if (map == "océano") paddleImg.src = "../assets/images/objects/fish.png";
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
  if (
    btnEasyD.style.display == "none"
  ) {
    btnEasyM.style.background = activeEasy;
    btnMediumM.style.background = activeMedium;
    btnHardM.style.background = activeHard;
  } else {
    btnEasyD.style.background = activeEasy;
    btnMediumD.style.background = activeMedium;
    btnHardD.style.background = activeHard;
  }
};

// Desktop
// Dificultad fácil desktop
btnEasyD.addEventListener("click", () =>
  selectDifficulty(1, -1, "#f00", "#000", "#000")
);

// Dificultad media desktop
btnMediumD.addEventListener("click", () =>
  selectDifficulty(2, -2, "#000", "#f00", "#000")
);

// Dificultad difícil desktop
btnHardD.addEventListener("click", () =>
  selectDifficulty(3, -3, "#000", "#000", "#f00")
);

// Mobile
// Dificultad fácil mobile
btnEasyM.addEventListener("click", () =>
  selectDifficulty(3, -3, "#f00", "#000", "#000")
);

// Dificultad media mobile
btnMediumM.addEventListener("click", () =>
  selectDifficulty(4, -4, "#000", "#f00", "#000")
);

// Dificultad difícil mobile
btnHardM.addEventListener("click", () =>
  selectDifficulty(5, -5, "#000", "#000", "#f00")
);

//Función principal (canvas)
function game() {
  gameOver = false;
  destroyedBrickCounter = 0;
  btnLeft.style.display = "flex";
  btnRight.style.display = "flex";
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

  function endOfTheGame(text) {
    gameOverH2.textContent = text;
    gameOverScreen.style.display = "flex";
    btnLeft.style.display = "none";
    btnRight.style.display = "none";
    canvas.style.display = "none";
    gameOver = true;
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
    ctx.drawImage(
      paddleImg,
      0,
      0,
      paddleWidth,
      paddleHeight + 20,
      paddleX,
      paddleY,
      paddleWidth,
      paddleHeight + 20
    );
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
          destroyedBrickCounter++;
        }
      }
    }
  }

  //Movimiento de la pelota y sus colisiónes
  function ballMovement() {
    //Si la pelota toca los bordes de "x" rebota
    if (ballX > canvas.width - ballRadius || ballX < ballRadius) {
      ballDx = -ballDx;
    }
    //Si la pelota toca los bordes de "y" rebota
    if (ballY < ballRadius) {
      ballDy = -ballDy;
    }
    if (ballY > paddleY - 3) {
      ballDx = -ballDx;
    }
    //Si la pelota toca la paleta rebota
    if (
      ballY + ballRadius > paddleY &&
      ballY - ballRadius < paddleY + paddleHeight &&
      ballX > paddleX &&
      ballX < paddleX + paddleWidth
    ) {
      ballDx = +ballDx;
      ballDy = -ballDy;
    }
    //Si la pelota se cae se pierde la partida
    if (ballY > canvas.height) {
      endOfTheGame("LO SIENTO, PERDISTE.");
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

    btnRight.addEventListener("touchstart", (e) => {
      e.preventDefault();
      rightPressed = true;
    });
    btnLeft.addEventListener("touchstart", (e) => {
      e.preventDefault();
      leftPressed = true;
    });
    btnRight.addEventListener("touchend", (e) => {
      e.preventDefault();
      rightPressed = false;
    });
    btnLeft.addEventListener("touchend", (e) => {
      e.preventDefault();
      leftPressed = false;
    });
    btnRight.addEventListener("mousedown", () => (rightPressed = true));
    btnRight.addEventListener("mouseup", () => (rightPressed = false));
    btnLeft.addEventListener("mousedown", () => (leftPressed = true));
    btnLeft.addEventListener("mouseup", () => (leftPressed = false));
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

    if (destroyedBrickCounter == brickColumnCount * brickRowCount) {
      endOfTheGame("FELICIDADES, GANASTE!");
    }

    if (!gameOver && canvas.style.display !== "none") {
      window.requestAnimationFrame(draw);
    }
  }

  initEvents();
  draw();
}

//Funcionalidad de los botones
btnPlay.addEventListener("click", game);

btnHome.addEventListener("click", () => {
  homeScreen.style.display = "flex";
  canvas.style.display = "none";
  maps.style.display = "none";
  config.style.display = "none";
  gameOverScreen.style.display = "none";
  btnLeft.style.display = "none";
  btnRight.style.display = "none";
});

btnMaps.addEventListener("click", () => {
  maps.style.display = "flex";
  homeScreen.style.display = "none";
  btnLeft.style.display = "none";
  btnRight.style.display = "none";
});

btnConfig.addEventListener("click", () => {
  config.style.display = "flex";
  homeScreen.style.display = "none";
  btnLeft.style.display = "none";
  btnRight.style.display = "none";
});

btnLeft.style.display = "none";
btnRight.style.display = "none";

//Funcionalidad al botón de escape
canvas.style.display = "none";
document.onkeydown = function (event) {
  const { key } = event;
  if (canvas.style.display == "none") {
    if (key == "Escape") {
      homeScreen.style.display = "flex";
      maps.style.display = "none";
      config.style.display = "none";
      gameOverScreen.style.display = "none";
    }
  }
};
