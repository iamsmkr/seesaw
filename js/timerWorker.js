let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;

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
    postMessage({ hours, minutes, seconds });
}

self.onmessage = function (event) {
    const { command } = event.data;
    if (command === 'start') {
        clearInterval(timerInterval);
        if (seconds === 0 && minutes === 0 && hours === 0) {
            postMessage({ hours, minutes, seconds });
        }
        timerInterval = setInterval(updateTimer, 1000);
    } else if (command === 'pause') {
        clearInterval(timerInterval);
    } else if (command === 'finish') {
        clearInterval(timerInterval);
        seconds = 0;
        minutes = 0;
        hours = 0;
    }
};
