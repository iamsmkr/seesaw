var start = document.getElementById("start");
var pause = document.getElementById("pause");
var finish = document.getElementById("finish");
var timer = document.getElementById("timer");
var counter = document.getElementById("counter");
var t;
var isRunning = false;
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
    function formatDuration(seconds) {
        var formattedHours = Math.floor(seconds / 3600);
        var formattedMinutes = Math.floor((seconds % 3600) / 60);
        var formattedSeconds = seconds % 60;

        formattedHours = formattedHours < 10 ? "0" + formattedHours : formattedHours;
        formattedMinutes = formattedMinutes < 10 ? "0" + formattedMinutes : formattedMinutes;
        formattedSeconds = formattedSeconds < 10 ? "0" + formattedSeconds : formattedSeconds;

        return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    }

    var totalBreak = 0;

    for (var i = 1; i < startTimestamps.length; i++) {
        var start = startTimestamps[i];
        var pause = pauseTimestamps[i - 1];
        var duration = Math.floor((start - pause) / 1000);

        totalBreak += duration;
    }

    counter.textContent = formatDuration(totalBreak);
}

function startTimer() {
    if (!isRunning) {
        if (seconds === 0 && minutes === 0 && hours === 0) {
            timer.textContent = "00:00:00"
            counter.textContent = "00:00:00"
        }
        isRunning = true;
        clearInterval(t);
        startTimestamps.push(new Date().getTime());
        t = setInterval(updateTimer, 1000);
        updateCounter();
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(t);
    pauseTimestamps.push(new Date().getTime());
}

function finishTimer() {
    isRunning = false;
    clearInterval(t);
    currTime = new Date().getTime();
    if (startTimestamps.length === pauseTimestamps.length) {
        startTimestamps.push(currTime);
    } else if (startTimestamps.length < pauseTimestamps.length) {
        startTimestamps.push(currTime);
        pauseTimestamps.push(currTime);
    }
    updateCounter();
    seconds = 0;
    minutes = 0;
    hours = 0;
    startTimestamps = [];
    pauseTimestamps = [];
}

start.addEventListener("click", startTimer);
pause.addEventListener("click", pauseTimer);
finish.addEventListener("click", finishTimer);
