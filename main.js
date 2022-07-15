const grid = document.querySelector(".grid");
const gridWidth = 660;
const gridHeight = 300;

const scoreElem = document.querySelector(".score");
let score = 0;
let finish = false;

const blockWidth = 120;// same as user
const blockHeight = 30;// --//--

const ballHeight = 25;
const ballWidth = 25;

let timerId;
let moveSpeed = 1;

let xDirection = 2;
let yDirection = 2;

const startUserPosition = [270, 10]
let currentUserPosition = startUserPosition;

const startBallPosition = [315, 60]
let ballCurrentPosition = startBallPosition;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
  }
}

const blocksDefault = [
  new Block(10, 220),
  new Block(140, 220),
  new Block(270, 220),
  new Block(400, 220),
  new Block(530, 220),
  new Block(10, 260),
  new Block(140, 260),
  new Block(270, 260),
  new Block(400, 260),
  new Block(530, 260),
  new Block(10, 180),
  new Block(140, 180),
  new Block(270, 180),
  new Block(400, 180),
  new Block(530, 180),
]


let blocks = [
  new Block(10, 220),
  new Block(140, 220),
  new Block(270, 220),
  new Block(400, 220),
  new Block(530, 220),
  new Block(10, 260),
  new Block(140, 260),
  new Block(270, 260),
  new Block(400, 260),
  new Block(530, 260),
  new Block(10, 180),
  new Block(140, 180),
  new Block(270, 180),
  new Block(400, 180),
  new Block(530, 180),
]

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.className = "block";
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.append(block);
  }
}

addBlocks()

const user = document.createElement("div");
user.className = "user";
drawUserPosition()
grid.append(user);

const ball = document.createElement("div");
ball.className = "ball";
drowBallPosition();
grid.append(ball);

function moveUser(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (currentUserPosition[0] > 10) {
        currentUserPosition[0] -= 10;
        drawUserPosition()
      }
      break;
    case "ArrowRight":
      if (currentUserPosition[0] < gridWidth - 10 - blockWidth) {
        currentUserPosition[0] += 10;
        drawUserPosition()
      }
      break;
  }
}

document.addEventListener("keydown", moveUser)

function drawUserPosition() {
  user.style.left = currentUserPosition[0] + "px";
  user.style.bottom = currentUserPosition[1] + "px";
}

function drowBallPosition() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drowBallPosition();
  checkForCollisions();
}

timerId = setInterval(moveBall, moveSpeed);

function checkForCollisions() {

  for (let item = 0; item < blocks.length; item++) {
    if (
      (ballCurrentPosition[0] > blocks[item].topLeft[0] &&
        ballCurrentPosition[0] < blocks[item].bottomRight[0]) &&
      (ballCurrentPosition[1] < blocks[item].topLeft[1] &&
        ballCurrentPosition[1] > blocks[item].bottomRight[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[item].className = "";
      blocks.splice(item, 1);
      changeDirection()
      score++
      scoreElem.innerHTML = `Score: ` + score;

      if (blocks.length == 0) {
        scoreElem.innerHTML = "U WIN";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
        document.addEventListener("keydown", restartGame)
      }
    }
  }

  if (ballCurrentPosition[1] <= 0) {
    scoreElem.innerHTML = "U LOOOOSER";
    clearInterval(timerId);
    document.removeEventListener("keydown", moveUser)
    document.addEventListener("keydown", restartGame)
  }

  if (
    ballCurrentPosition[0] >= (gridWidth - ballWidth) ||
    ballCurrentPosition[1] >= (gridHeight - ballHeight) ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection()
  }

  if (
    (ballCurrentPosition[0] > currentUserPosition[0] &&
      ballCurrentPosition[0] < currentUserPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] < currentUserPosition[1] + blockHeight &&
      ballCurrentPosition[1] > currentUserPosition[1])
  ) {
    changeDirection()
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
}

//RESTART
// function restartGame(event) {
//   if (event.key === "ArrowDown") {
//     resetGame();
//     drowBallPosition();
//     timerId = setInterval(moveBall, moveSpeed);
//   }
// }

// function placeBallToFuckingCenter() {
//   ball.style.left = startBallPosition[0] + "px"
// }

// function resetGame() {
//   scoreElem.innerHTML = "Score: 0"
//   ballCurrentPosition = startBallPosition;
//   xDirection = 2;
//   yDirection = 2;
//   blocks = JSON.parse(JSON.stringify(blocksDefault));
//   Array.from(grid.querySelectorAll(".block")).map(block => block.remove())
//   addBlocks()

// }











