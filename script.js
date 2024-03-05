var startPause = document.getElementById("start-pause");
var reset = document.getElementById("reset");
var timer = document.getElementById("timer");
var counter = document.getElementById("counter");
var isRunning = false;
var t;

var seconds = 0;
var minutes = 0;
var hours = 0;

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
        if (hours >= 24) {
          hours = 0;
        }
      }
    }
    var formattedHours = hours < 10 ? "0" + hours.toString() : hours;
    var formattedMinutes = minutes < 10 ? "0" + minutes.toString() : minutes;
    var formattedSeconds = seconds < 10 ? "0" + seconds.toString() : seconds;
    timer.textContent = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
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
  seconds = 0;
  minutes = 0;
  hours = 0;
}

startPause.addEventListener("click", toggleStartPause);
reset.addEventListener("click", resetTimer);
