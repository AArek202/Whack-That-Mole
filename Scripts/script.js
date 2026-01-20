// Game Over Screen
const gameOver = document.getElementById("gameover");
const restartBtn = document.getElementById("restart_btn");
const menuBtn = document.getElementById("menu_btn");
const newHigh = document.getElementById("new_high");
const gvrScore = document.getElementById("gvr_score");
// Main Menu
const menuScreen = document.getElementById("menu_screen");
const playButton = document.getElementById("plbtn");
const menuHigh = document.getElementById("menu_highscore");
const bgMusic = document.getElementById("bgMusic");
// Game Screen
const moleContainers = document.querySelectorAll(".mole-container");
const moles = document.querySelectorAll(".mole");
const hammer = document.getElementById("hammer");
const gameScore = document.getElementById("game_score");
const timeElm = document.getElementById("time");
const gameover = document.getElementById("gameover");
const bonkSound = document.getElementById("bonk_sound");
const bonkImg = document.getElementById("bonk_img");
const gameScreen = document.getElementById("game_screen");
let available = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let moleEvent;
let timeEvent;
let bonkEvent;
let current = Math.floor(Math.random() * 9);
let moleImg = Math.floor(Math.random() * 4) + 1;
let score = 0;
let scoreMultiplier = 1;
let timeInSeconds;
let maxTime = 60;
function moleClicked(e) {
  score += 10 * scoreMultiplier;
  // Bonk Sound
  bonkSound.pause();
  bonkSound.currentTime = 0;
  bonkSound.play();
  // Bonk Image
  bonkImg.style.left = e.clientX + "px";
  bonkImg.style.top = e.clientY - 100 + "px";
  bonkImg.style.display = "block";
  clearTimeout(bonkEvent);
  bonkEvent = setTimeout(() => {
    bonkImg.style.display = "none";
  }, 500);
  moles[current].src = "./Assets/Images/Moles/mole_hit.png";
  updateScore();
  updateMole();
}
function updateMole() {
  clearTimeout(moleEvent);
  let random = Math.floor(Math.random() * 8);
  moleImg = Math.floor(Math.random() * 4) + 1;
  let timeoutPeriod;
  let temp;
  temp = available[random];
  moleContainers[current].classList.remove("up");
  moleContainers[current].onclick = function () {};
  moleContainers[temp].classList.add("up");
  moles[temp].src = `./Assets/Images/Moles/mole_${moleImg}.png`;
  available.splice(random, 1);
  available.push(current);
  current = temp;
  moleContainers[current].onclick = moleClicked;
  if (timeInSeconds <= maxTime / 2) {
    timeoutPeriod = 800; // 0.5s + 0.3s transition time.
  } else {
    timeoutPeriod = 1300; // 1s + 0.3s transition time.
  }
  moleEvent = setTimeout(updateMole, timeoutPeriod);
}
function updateTime() {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = (timeInSeconds % 60).toFixed(0);
  timeElm.innerText = `${minutes}:${seconds}`;
}
function updateScore() {
  gameScore.innerText = score;
}
function countDown() {
  timeInSeconds--;
  if (timeInSeconds == 0) {
    clearInterval(timeEvent);
    clearTimeout(moleEvent);
    finishGame();
  }
  updateTime();
}
gameScreen.onmousemove = (e) => {
  hammer.style.left = e.clientX - 50 + "px";
  hammer.style.top = e.clientY - 100 + "px";
};
gameScreen.onclick = () => {
  hammer.style.animation = "none";
  hammer.offsetHeight;
  hammer.style.animation = null;
  hammer.style.animation = "bonk 0.1s";
};

function startGame() {
  menuScreen.style.display = "none";
  gameOver.style.display = "none";
  gameScreen.style.display = "flex";
  bgMusic.play();
  resetGame();
}
function resetGame() {
  available = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  moleContainers[current].classList.remove("up");
  moleContainers[current].onclick = function () {};
  current = Math.floor(Math.random() * 9);
  moleImg = Math.floor(Math.random() * 4) + 1;
  score = 0;
  scoreMultiplier = 1;
  timeInSeconds = maxTime;
  moleContainers[current].onclick = moleClicked;
  moleContainers[current].classList.add("up");
  moles[current].src = `./Assets/Images/Moles/mole_${moleImg}.png`;
  available.splice(current, 1);
  updateScore();
  updateTime();
  moleEvent = setTimeout(updateMole, 1000);
  timeEvent = setInterval(countDown, 1000);
}
function finishGame() {
  gameOver.style.display = "flex";
  const highScore = localStorage.getItem("highScore");
  if (highScore == null || score > highScore) {
    newHigh.style.display = "block";
    localStorage.setItem("highScore", score);
  } else {
    newHigh.style.display = "none";
  }
  gvrScore.innerText = `Score: ${score}`;
}
function mainMenu() {
  let highScore = localStorage.getItem("highScore");
  if (highScore == null) {
    highScore = 0;
  }
  gameOver.style.display = "none";
  gameScreen.style.display = "none";
  menuScreen.style.display = "flex";
  menuHigh.innerText = highScore;
}

playButton.onclick = startGame;
restartBtn.onclick = startGame;
menuBtn.onclick = mainMenu;
mainMenu();
