const grid = document.querySelector(".grid");
const scoreElem = document.querySelector(".score");
const btn = document.querySelector(".btn");
const speedSlider = document.querySelector(".slider");
const sliderTextElem = document.querySelector(".slider-text")

const gridWidth = 1268;
const gridHeight = 600;
const blockWidth = 240;
const blockHeight = 60;
const userWidth = 120;
const userHeight = 40;
const ballHeight = 45;
const ballWidth = 45;

let score = 0;
let timerId;
let moveSpeed = 15;

let speedScaleActive = true;
setInterval(checkSpeedSlider, 150);

let xDirection = -2;
let yDirection = 2;

let userCurPos = [580, 10];
let ballCurPos = [620, 60];

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
  }
}

const blocks = [
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
//blocks for current game
let blocksNow = JSON.parse(JSON.stringify(blocks))

//render blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'
    grid.append(block)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  addBlocks();
})

//render user
let user = document.createElement('div')
user.classList.add('user')
grid.append(user)
drawUser()


//render ball
let ball = document.createElement('div')
ball.classList.add('ball')
grid.append(ball)
drawBall()

function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (userCurPos[0] > 10) {
        userCurPos[0] -= 10
        drawUser()
      }
      break
    case 'ArrowRight':
      if (userCurPos[0] < (gridWidth - userWidth - 20)) {
        userCurPos[0] += 10
        drawUser()
      }
      break
  }
}
document.addEventListener('keydown', moveUser)


function drawUser() {
  user.style.left = userCurPos[0] + 'px'
  user.style.bottom = userCurPos[1] + 'px'
}


function drawBall() {
  ball.style.left = ballCurPos[0] + 'px'
  ball.style.bottom = ballCurPos[1] + 'px'
}


function moveBall() {
  ballCurPos[0] += xDirection
  ballCurPos[1] += yDirection
  drawBall()
  checkForCollisions()
}

function checkForCollisions() {

  //block hits
  for (let i = 0; i < blocksNow.length; i++) {
    if
      (
      (ballCurPos[0] > blocksNow[i].bottomLeft[0] && ballCurPos[0] < blocksNow[i].bottomRight[0]) &&
      ((ballCurPos[1] + ballHeight) > blocksNow[i].bottomLeft[1] && ballCurPos[1] < blocksNow[i].topLeft[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocksNow.splice(i, 1)
      changeDirection()
      score++
      scoreElem.innerHTML = `Score: ${score}`
      if (blocksNow.length == 0) {
        scoreElem.innerHTML = 'U ARE THE CHAMPION'
        finishGame()
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
    }
  }
  // grid hits
  if (ballCurPos[0] >= (gridWidth - ballWidth) || ballCurPos[0] <= 0 || ballCurPos[1] >= (gridHeight - ballHeight)) {
    changeDirection()
  }

  //user hits
  if
    (
    (ballCurPos[0] > userCurPos[0] && ballCurPos[0] < userCurPos[0] + userWidth) &&
    (ballCurPos[1] > userCurPos[1] && ballCurPos[1] < userCurPos[1] + userHeight)
  ) changeDirection()

  //lose
  if (ballCurPos[1] <= 0) {
    clearInterval(timerId)
    scoreElem.innerHTML = 'LOOOSER'
    finishGame()
    document.removeEventListener('keydown', moveUser)
  }
}


function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
    return
  }
}


//start game
function startGame() {
  document.addEventListener('keydown', moveUser)
  btn.removeEventListener("click", startGame);
  btn.innerText = "PAUSE"
  btn.addEventListener("click", pauseGame);
  timerId = setInterval(moveBall, moveSpeed);
  scoreElem.innerHTML = `Score: ${score}`;
  speedScaleActive = false;
}

btn.addEventListener("click", startGame);

//pauseGame
function pauseGame() {
  clearInterval(timerId);
  btn.removeEventListener("click", pauseGame);
  btn.addEventListener("click", resumeGame);
  btn.innerText = "RESUME";
  speedScaleActive = true;
}

//resumeGame
function resumeGame() {
  timerId = setInterval(moveBall, moveSpeed);
  btn.removeEventListener("click", resumeGame);
  btn.addEventListener("click", pauseGame);
  btn.innerText = "PAUSE";
  speedScaleActive = false;
}

//finishGame
function finishGame() {
  btn.innerText = "RESET"
  btn.removeEventListener("click", pauseGame);
  btn.addEventListener("click", resetGame);
  speedScaleActive = true;
}

//reset game 
function resetGame() {
  const allOldBlocks = grid.querySelectorAll(".block");
  allOldBlocks.forEach(block => block.remove());
  addBlocks()
  blocksNow = JSON.parse(JSON.stringify(blocks))

  ballCurPos = [620, 60];
  drawBall()

  userCurPos = [580, 10];
  drawUser()

  score = 0;
  timerId = null;
  xDirection = -2;
  yDirection = 2;

  btn.removeEventListener("click", resetGame);
  btn.addEventListener("click", startGame);
  btn.innerText = "START"
}

//ball speed scale checker
function checkSpeedSlider() {
  speedScaleActive ? speedSlider.disabled = false : speedSlider.disabled = true;

  switch (speedSlider.value) {
    case "1":
      sliderTextElem.innerHTML = `Difficulty: CHILL`
      moveSpeed = 30;
      break;
    case "2":
      sliderTextElem.innerHTML = `Difficulty: WITH BEER`
      moveSpeed = 25;
      break;
    case "3":
      sliderTextElem.innerHTML = `Difficulty: FOR FUN`
      moveSpeed = 20;
      break;
    case "4":
      sliderTextElem.innerHTML = `Difficulty: TRYHARD`
      moveSpeed = 15;
      break;
    case "5":
      sliderTextElem.innerHTML = `Difficulty: DANGER`
      moveSpeed = 10;
      break;
  }
}







