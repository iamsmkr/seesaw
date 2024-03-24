import { 
    COMMAND,
    TIMER_TYPE,
} from './constants.js';

var Timer = (function () {
    var start = document.getElementById("start");
    var pause = document.getElementById("pause");
    var finish = document.getElementById("finish");
    var timer = document.getElementById("timer");
    var counter = document.getElementById("counter");

    const updateDisplay = (ref, { hours, minutes, seconds }) => {
        var formattedHours = hours < 10 ? "0" + hours : hours;
        var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        ref.textContent = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    };

    var worker = new Worker('js/timerWorker.js');

    worker.onmessage = function ({ data }) {
        switch (data.type) {
            case TIMER_TYPE.TIMER:
                updateDisplay(timer, data.time);
                break;
            case TIMER_TYPE.COUNTER:
                updateDisplay(counter, data.time);
                break;
            default:
                console.log('Timer type is not recognized');
        }
    };

    const startTimer = () => {
        worker.postMessage({ command: COMMAND.START });
    };

    const pauseTimer = () => {
        worker.postMessage({ command: COMMAND.PAUSE });
    };

    const finishTimer = () => {
        worker.postMessage({ command: COMMAND.FINISH });
    };

    start.addEventListener("click", startTimer);
    pause.addEventListener("click", pauseTimer);
    finish.addEventListener("click", finishTimer);

    return {
        startTimer,
        pauseTimer,
        finishTimer
    };
})();
