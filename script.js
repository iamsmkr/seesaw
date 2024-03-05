var startPause = document.getElementById("start-pause");
var reset = document.getElementById("reset");
var timer = document.getElementById("timer");
var isRunning = false;
var t;

function updateTimer() {
  // Your timer update logic here
}

function toggleStartPause() {
  if (!isRunning) {
    isRunning = true;
    startPause.textContent = "Pause";
    t = setInterval(updateTimer, 1000);
  } else {
    isRunning = false;
    startPause.textContent = "Start";
    clearInterval(t);
  }
}

function resetTimer() {
  isRunning = false;
  startPause.textContent = "Start";
  clearInterval(t);
  timer.textContent = "00:00:00";
  // Reset other timer values here
}

startPause.addEventListener("click", toggleStartPause);
reset.addEventListener("click", resetTimer);

// Repeat similar logic for the second timer using startPause2, reset2, and timer2
