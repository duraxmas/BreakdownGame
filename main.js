const grid = document.querySelector(".grid");
const gridWidth = 1268;
const gridHeight = 600;

const scoreElem = document.querySelector(".score");
let score = 0;
let finish = false;

const btn = document.querySelector(".btn")

const blockWidth = 240;
const blockHeight = 60;

const userWidth = 120;
const userHeight = 40;

const ballHeight = 45;
const ballWidth = 45;

let timerId;
let moveSpeed = 15;

let xDirection = 2;
let yDirection = 2;

const startUserPosition = [580, 10]
let currentUserPosition = startUserPosition;

const startBallPosition = [615, 60]
let ballCurrentPosition = startBallPosition;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
  }
}

let blocks = [
  new Block(10, 530),
  new Block(260, 530),
  new Block(510, 530),
  new Block(760, 530),
  new Block(1010, 530),
  new Block(10, 460),
  new Block(260, 460),
  new Block(510, 460),
  new Block(760, 460),
  new Block(1010, 460),
  new Block(10, 390),
  new Block(260, 390),
  new Block(510, 390),
  new Block(760, 390),
  new Block(1010, 390),
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
        currentUserPosition[0] -= 15;
        drawUserPosition()
      }
      break;
    case "ArrowRight":
      if (currentUserPosition[0] < gridWidth - 10 - userWidth) {
        currentUserPosition[0] += 15;
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

btn.addEventListener("click", startGame)

function startGame() {
  btn.disabled = true;
  timerId = setInterval(moveBall, moveSpeed);
}

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
      allBlocks.splice(item, 1);
      changeDirection()
      score++
      scoreElem.innerHTML = `Score: ` + score;

      if (allBlocks.length == 0) {
        scoreElem.innerHTML = "U WIN";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  if (ballCurrentPosition[1] <= 0) {
    scoreElem.innerHTML = "U LOOOOSER";
    clearInterval(timerId);
    document.removeEventListener("keydown", moveUser)
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
      ballCurrentPosition[0] < currentUserPosition[0] + userWidth) &&
    (ballCurrentPosition[1] < currentUserPosition[1] + userHeight &&
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












