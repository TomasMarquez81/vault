//    **** Variables ****

// Recuperamos la etiqueta canvas
const canvas = document.querySelector("canvas");
// le decimos que el contexto es 2d
const ctx = canvas.getContext("2d");
const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#brick");

canvas.width = 448;
canvas.height = 400;

/*  Variables de la pelota  */

const ballRadius = 3;
let x = canvas.width / 2;
let y = canvas.height - 30;
// Velocidad de la pelota
let dx = 2;
let dy = -2;

/*   Variables de la paleta   */
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

/* Variables de los ladrillos */

const brickRowsCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 14;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 17;
const bricks = [];
const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []; // iniciamos con un array vacio
  for (let r = 0; r < brickRowsCount; r++) {
    // calculamos la posicion del ladrillo en la pantalla
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
    // Asignar un color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8);
    // Guardamos la informacion de cada ladrillo
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  // Le indicamos lo que vamos a hacer que es dibujar
  ctx.beginPath(); // Iniciamos el trazado
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath(); // Terminamos el trazado
}
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowsCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      /*ctx.fillStyle = "yellow";
      ctx.rect(currentBrick.x, currentBrick.y, brickWidth, brickHeight);
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.fill();*/

      const clipX = currentBrick.color * 32;
      ctx.drawImage(
        $bricks, // la imagen
        clipX, // clip x donde empieza a coger la imagen en eje x
        0, // clip x donde empieza a coger la imagen en eje y
        brickWidth, // ancho del recorte
        brickHeight, // alto del recorte
        currentBrick.x, // posicion x del dibujo
        currentBrick.y, // posicion y del dibujo
        brickWidth, // ancho del dibujo
        brickHeight // alto del dibujo
      );
    }
  }
}
function drawPaddle() {
  /*ctx.fillStyle = "#09f";
  ctx.fillRect(
    paddleX, // la coordenada X
    paddleY, // la coordenada Y
    paddleWidth, // el ancho del dibujo
    paddleHeight // el alto del dibujo
  );*/

  ctx.drawImage(
    $sprite, // la imagen
    29, // clip x donde empieza a coger la imagen en eje x
    174, // clip x donde empieza a coger la imagen en eje y
    paddleWidth, // ancho del recorte
    paddleHeight, // alto del recorte
    paddleX, // posicion x del dibujo
    paddleY, // posicion y del dibujo
    paddleWidth, // ancho del dibujo
    paddleHeight // alto del dibujo
  );
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowsCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSamXAsBrick =
        x > currentBrick.x && x < currentBrick.x + brickWidth;
      const isBallSamYAsBrick =
        y > currentBrick.y && y < currentBrick.y + brickHeight;

      if (isBallSamXAsBrick && isBallSamYAsBrick) {
        dy = -dy;
        currentBrick.status = BRICK_STATUS.DESTROYED;
      }
    }
  }
}
function ballMovement() {
  // rebotar la pelota en los laterales
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // rebotar la pelota en la parte superior
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
  const isBallTouchingPaddle = y + dy > paddleY;
  // rebota en la pala
  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy; // Cambiamos la direccion de la pelota
  } else if (
    // la pelota toca el suelo
    y + dy >
    canvas.height - ballRadius
  ) {
    //console.log("Game Over");
    document.location.reload();
  }

  // Mover pelota
  x += dx;
  y += dy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

// funcion para limpiar pantalla
function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// funcion para inicio de eventos
function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

// funcion para dibujar elementos
function draw() {
  // Limpiamos la pantalla
  cleanCanvas();
  // Dibujar elementos
  drawBall();
  drawPaddle();
  drawBricks();

  // drawScore

  // Colisiones y movimientos
  collisionDetection();
  ballMovement();
  paddleMovement();

  //usarmos este metodo para hacer el pintado de pantalla
  window.requestAnimationFrame(draw);
}

draw();
initEvents();
