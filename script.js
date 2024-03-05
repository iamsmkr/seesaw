var startPause = document.getElementById("start-pause");
var reset = document.getElementById("reset");
var timer = document.getElementById("timer");
var counter = document.getElementById("counter");
var isRunning = false;
var t;

var startTimestamps = [];
var pauseTimestamps = [];

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

function updateCounter() {
    var totalBreak = 0;

    for (var i = 1; i < startTimestamps.length; i++) {
        var start = startTimestamps[i];
        var pause = pauseTimestamps[i - 1];
        var duration = Math.floor((start - pause) / 1000);

        console.log('start', start, 'pause', pause, 'duration', duration);

        totalBreak += duration;
    }

    counter.textContent = formatDuration(totalBreak);
}

function formatDuration(seconds) {
    var formattedHours = Math.floor(seconds / 3600);
    var formattedMinutes = Math.floor((seconds % 3600) / 60);
    var formattedSeconds = seconds % 60;

    formattedHours = formattedHours < 10 ? "0" + formattedHours : formattedHours;
    formattedMinutes = formattedMinutes < 10 ? "0" + formattedMinutes : formattedMinutes;
    formattedSeconds = formattedSeconds < 10 ? "0" + formattedSeconds : formattedSeconds;

    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}

function toggleStartPause() {
    if (!isRunning) {
        isRunning = true;
        startPause.textContent = "Pause";
        startTimestamps.push(new Date().getTime());
        t = setInterval(updateTimer, 1000);
        updateCounter();
    } else {
        isRunning = false;
        startPause.textContent = "Start";
        clearInterval(t);
        pauseTimestamps.push(new Date().getTime());
    }
}

function resetTimer() {
    isRunning = false;
    startPause.textContent = "Start";
    clearInterval(t);
    timer.textContent = "00:00:00";
    counter.textContent = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
    startTimestamps = [];
    pauseTimestamps = [];
}

startPause.addEventListener("click", toggleStartPause);
reset.addEventListener("click", resetTimer);
