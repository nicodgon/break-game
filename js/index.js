const elements = {
  // Botones
  btnHome: document.getElementById("btn__home"),
  btnPlay: document.getElementById("btn__play"),
  btnMaps: document.getElementById("btn__maps"),
  btnConfig: document.getElementById("btn__config"),
  btnLeft: document.getElementById("btn__left"),
  btnRight: document.getElementById("btn__right"),
  // Mapas
  MapA: document.getElementById("map__a"),
  MapB: document.getElementById("map__b"),
  MapC: document.getElementById("map__c"),
  //Botones de dificultad
  btnEasy: document.getElementById("btn__easy"),
  btnMedium: document.getElementById("btn__medium"),
  btnHard: document.getElementById("btn__hard"),
  // Pantallas
  homeScreen: document.getElementById("home"),
  maps: document.getElementById("maps"),
  config: document.getElementById("config"),
  gameOverScreen: document.getElementById("game__over"),
  gameOverH2: document.getElementById("game__over__h2"),
  canvas: document.getElementById("canvas"),
};

const gameSettings = {
  ballRadius: 8,
  paddleWidth: 70,
  paddleHeight: 15,
  brickRowCount: 5,
  brickColumnCount: 9,
  brickWidth: 45,
  brickHeight: 20,
  brickGap: 2,
  brickOffsetLeft: 12.5,
  brickOffsetTop: 10,
};

//Canvas
const ctx = elements.canvas.getContext("2d");
elements.canvas.width = 448;
elements.canvas.height = 400;

// velocidad inicial(media)
let ballDx;
let ballDy;
let paddleDx;

// Imagen de la pala
const paddleImg = new Image();
paddleImg.src = "../assets/images/objects/rocket.png";

//Botones de movimiento de la pala
let rightPressed = false;
let leftPressed = false;

// variables de los ladrillos
const bricks = [];
const brickStatus = {
  exists: true,
  destroyed: false,
};

//Variables para la finalización del juego
let gameOver = false;
let destroyedBrickCounter = 0;

// Configuración
const selectDifficulty = (a, b, activeEasy, activeMedium, activeHard) => {
  ballDx = a;
  ballDy = b;
  elements.homeScreen.style.display = "flex";
  elements.config.style.display = "none";
  elements.btnEasy.style.background = activeEasy;
  elements.btnMedium.style.background = activeMedium;
  elements.btnHard.style.background = activeHard;
};

elements.btnMedium.style.background = "#f00";
//MediaQuery 768px
const handleMediaQueryChange = (event) => {
  if (event.matches) {
    // escritorio
    ballDx = 2;
    ballDy = -2;
    paddleDx = 3;
    // Dificultad fácil
    elements.btnEasy.addEventListener("click", () =>
      selectDifficulty(1, -1, "#f00", "#000", "#000")
    );
    // Dificultad media
    elements.btnMedium.addEventListener("click", () =>
      selectDifficulty(2, -2, "#000", "#f00", "#000")
    );
    // Dificultad difícil
    elements.btnHard.addEventListener("click", () =>
      selectDifficulty(3, -3, "#000", "#000", "#f00")
    );
  } else {
    // Celular
    ballDx = 4;
    ballDy = -4;
    paddleDx = 6;
    // Dificultad fácil
    elements.btnEasy.addEventListener("click", () =>
      selectDifficulty(3, -3, "#f00", "#000", "#000")
    );
    // Dificultad media
    elements.btnMedium.addEventListener("click", () =>
      selectDifficulty(4, -4, "#000", "#f00", "#000")
    );
    // Dificultad difícil
    elements.btnHard.addEventListener("click", () =>
      selectDifficulty(5, -5, "#000", "#000", "#f00")
    );
  }
};
const mediaQueryMobile = window.matchMedia("(min-width: 1280px)");
mediaQueryMobile.addEventListener("change", handleMediaQueryChange);
handleMediaQueryChange(mediaQueryMobile);

elements.canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// Mapas
const chooseMap = (map, activeA, activeB, activeC) => {
  elements.homeScreen.style.display = "flex";
  elements.maps.style.display = "none";
  elements.MapA.style.background = activeA;
  elements.MapB.style.background = activeB;
  elements.MapC.style.background = activeC;
  elements.canvas.style.backgroundImage = `url("../assets/images/maps/${map}.jfif")`;
  if (map == "galaxia") paddleImg.src = "../assets/images/objects/rocket.png";
  if (map == "desierto") paddleImg.src = "../assets/images/objects/cactus.png";
  if (map == "océano") paddleImg.src = "../assets/images/objects/fish.png";
};

elements.MapA.addEventListener("click", () =>
  chooseMap("galaxia", "#f00", "#000", "#000")
);
elements.MapB.addEventListener("click", () =>
  chooseMap("desierto", "#000", "#f00", "#000")
);
elements.MapC.addEventListener("click", () =>
  chooseMap("océano", "#000", "#000", "#f00")
);

//Funcionalidad de los botones
elements.btnPlay.addEventListener("click", game);

const hiddenButtons=()=>{
  elements.btnLeft.style.display = "none";
  elements.btnRight.style.display = "none";
}
hiddenButtons()

elements.btnHome.addEventListener("click", () => {
  elements.homeScreen.style.display = "flex";
  elements.canvas.style.display = "none";
  elements.maps.style.display = "none";
  elements.config.style.display = "none";
  elements.gameOverScreen.style.display = "none";
  hiddenButtons()
});

elements.btnMaps.addEventListener("click", () => {
  maps.style.display = "flex";
  elements.homeScreen.style.display = "none";
  hiddenButtons()
});

elements.btnConfig.addEventListener("click", () => {
  elements.config.style.display = "flex";
  elements.homeScreen.style.display = "none";
  hiddenButtons()
});

//Funcionalidad al botón de escape
elements.canvas.style.display = "none";
document.onkeydown = function (event) {
  const { key } = event;
  if (elements.canvas.style.display == "none") {
    if (key == "Escape") {
      elements.homeScreen.style.display = "flex";
      maps.style.display = "none";
      elements.config.style.display = "none";
      elements.gameOverScreen.style.display = "none";
    }
  }
};

//Función principal (canvas)
function game() {
  gameOver = false;
  destroyedBrickCounter = 0;
  elements.btnLeft.style.display = "flex";
  elements.btnRight.style.display = "flex";
  elements.homeScreen.style.display = "none";
  elements.canvas.style.display = "flex";

  // Ubicación inicial de la pelota
  let ballX = elements.canvas.width / 2;
  let ballY = elements.canvas.height - (40 + gameSettings.ballRadius);

  // Ubicación inicial de la paleta
  let paddleX = (elements.canvas.width - gameSettings.paddleWidth) / 2;
  let paddleY = elements.canvas.height - gameSettings.paddleHeight * 2;

  for (let col = 0; col < gameSettings.brickColumnCount; col++) {
    bricks[col] = [];
    for (let row = 0; row < gameSettings.brickRowCount; row++) {
      const brickX = col * (gameSettings.brickWidth + gameSettings.brickGap) + gameSettings.brickOffsetLeft;
      const brickY = row * (gameSettings.brickHeight + gameSettings.brickGap) + gameSettings.brickOffsetTop;
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
    elements.gameOverH2.textContent = text;
    elements.gameOverScreen.style.display = "flex";
    hiddenButtons()
    elements.canvas.style.display = "none";
    gameOver = true;
  }

  //Dibujar la pelota
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, gameSettings.ballRadius, 0, Math.PI * 2);
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
      gameSettings.paddleWidth,
      gameSettings.paddleHeight + 20,
      paddleX,
      paddleY,
      gameSettings.paddleWidth,
      gameSettings.paddleHeight + 20
    );
  }

  //Dibujar los ladrillos
  function drawBricks() {
    for (let col = 0; col < gameSettings.brickColumnCount; col++) {
      for (let row = 0; row < gameSettings.brickRowCount; row++) {
        const currentBrick = bricks[col][row];
        if (currentBrick.status == brickStatus.destroyed) continue;
        if (currentBrick.color == 0) ctx.fillStyle = "#000";
        if (currentBrick.color == 1) ctx.fillStyle = "#f00";
        if (currentBrick.color == 2) ctx.fillStyle = "#0f0";
        if (currentBrick.color == 3) ctx.fillStyle = "#00f";
        if (currentBrick.color == 4) ctx.fillStyle = "#FF6F50";
        if (currentBrick.color == 5) ctx.fillStyle = "#C100FF";
        ctx.fillRect(currentBrick.x, currentBrick.y, gameSettings.brickWidth, gameSettings.brickHeight);
      }
    }
  }

  //Crear la colisión de la pelota con los ladrillos
  function collisionDetection() {
    for (let col = 0; col < gameSettings.brickColumnCount; col++) {
      for (let row = 0; row < gameSettings.brickRowCount; row++) {
        const currentBrick = bricks[col][row];
        if (currentBrick.status == brickStatus.destroyed) continue;
        if (
          ballX > currentBrick.x &&
          ballX < currentBrick.x + gameSettings.brickWidth &&
          ballY > currentBrick.y &&
          ballY < currentBrick.y + gameSettings.brickHeight
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
    if (ballX > elements.canvas.width - gameSettings.ballRadius || ballX < gameSettings.ballRadius) {
      ballDx = -ballDx;
    }
    //Si la pelota toca los bordes de "y" rebota
    if (ballY < gameSettings.ballRadius) {
      ballDy = -ballDy;
    }
    if (ballY > paddleY - 3) {
      ballDx = -ballDx;
    }
    //Si la pelota toca la paleta rebota
    if (
      ballY + gameSettings.ballRadius > paddleY &&
      ballY - gameSettings.ballRadius < paddleY + gameSettings.paddleHeight &&
      ballX > paddleX &&
      ballX < paddleX + gameSettings.paddleWidth
    ) {
      ballDx = +ballDx;
      ballDy = -ballDy;
    }
    //Si la pelota se cae se pierde la partida
    if (ballY > elements.canvas.height) {
      endOfTheGame("LO SIENTO, PERDISTE.");
    }
    ballX += ballDx;
    ballY += ballDy;
  }

  //Movimiento de la pala
  function paddleMovement() {
    if (rightPressed && paddleX < elements.canvas.width - gameSettings.paddleWidth) {
      paddleX += paddleDx;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleDx;
    }
  }

  //Limpiar el canvas por cada frame
  function cleanCanvas() {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
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

    elements.btnRight.addEventListener("touchstart", (e) => {
      e.preventDefault();
      rightPressed = true;
    });
    elements.btnLeft.addEventListener("touchstart", (e) => {
      e.preventDefault();
      leftPressed = true;
    });
    elements.btnRight.addEventListener("touchend", (e) => {
      e.preventDefault();
      rightPressed = false;
    });
    elements.btnLeft.addEventListener("touchend", (e) => {
      e.preventDefault();
      leftPressed = false;
    });
    elements.btnRight.addEventListener(
      "mousedown",
      () => (rightPressed = true)
    );
    elements.btnRight.addEventListener("mouseup", () => (rightPressed = false));
    elements.btnLeft.addEventListener("mousedown", () => (leftPressed = true));
    elements.btnLeft.addEventListener("mouseup", () => (leftPressed = false));
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

    if (destroyedBrickCounter == gameSettings.brickColumnCount * gameSettings.brickRowCount) {
      endOfTheGame("FELICIDADES, GANASTE!");
    }

    if (!gameOver && elements.canvas.style.display !== "none") {
      window.requestAnimationFrame(draw);
    }
  }

  initEvents();
  draw();
}
