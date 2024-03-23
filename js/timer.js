var Timer = (function () {
    var start = document.getElementById("start");
    var pause = document.getElementById("pause");
    var finish = document.getElementById("finish");
    var timer = document.getElementById("timer");
    var counter = document.getElementById("counter");

    var isRunning = false;
    var startTimestamps = [];
    var pauseTimestamps = [];

    function logActivity() {
        var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        var activity = "Study";
        var inactivity = "Break";

        function formatDate(date) {
            var formattedDate =
                weekdays[date.getDay()] + ', ' +
                date.getDate() + ' ' +
                months[date.getMonth()] + ' ' +
                date.getFullYear() + ' ' +
                date.getHours().toString().padStart(2, '0') + ':' +
                date.getMinutes().toString().padStart(2, '0') + ':' +
                date.getSeconds().toString().padStart(2, '0');
            return formattedDate;
        }

        var start = startTimestamps[startTimestamps.length - 1] || 0;
        var pause = pauseTimestamps[pauseTimestamps.length - 1] || 0;
        if (startTimestamps.length !== 0 && pauseTimestamps.length !== 0) {
            var duration = Math.abs(pause - start);
            var hours = Math.floor(duration / (1000 * 60 * 60));
            var minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((duration % (1000 * 60)) / 1000);

            var durationStr =
                (hours < 10 ? "0" : "") + hours + ":" +
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (seconds < 10 ? "0" : "") + seconds;

            console.log(
                isRunning
                    ? formatDate(new Date(pause)) + ' | ' + formatDate(new Date(start)) + ' | ' + durationStr + ' | ' + inactivity
                    : formatDate(new Date(start)) + ' | ' + formatDate(new Date(pause)) + ' | ' + durationStr + ' | ' + activity
            );
        }
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
            var pause = pauseTimestamps[i - 1] || 0;
            var duration = Math.floor((start - pause) / 1000);

            totalBreak += duration;
        }

        counter.textContent = formatDuration(totalBreak);
    }

    var worker = new Worker('js/timerWorker.js');

    worker.onmessage = function (event) {
        var data = event.data;
        updateDisplay(data);
    };

    function updateDisplay(data) {
        var formattedHours = data.hours < 10 ? "0" + data.hours : data.hours;
        var formattedMinutes = data.minutes < 10 ? "0" + data.minutes : data.minutes;
        var formattedSeconds = data.seconds < 10 ? "0" + data.seconds : data.seconds;
        timer.textContent = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startTimestamps.push(new Date().getTime());
            worker.postMessage({ command: 'start' });
            updateCounter();
            logActivity();
        }
    }

    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            pauseTimestamps.push(new Date().getTime());
            worker.postMessage({ command: 'pause' });
            logActivity();
        }
    }

    function finishTimer() {
        isRunning = false;
        currTime = new Date().getTime();
        if (startTimestamps.length === pauseTimestamps.length) {
            startTimestamps.push(currTime);
        } else if (startTimestamps.length < pauseTimestamps.length) {
            startTimestamps.push(currTime);
            pauseTimestamps.push(currTime);
        } else {
            pauseTimestamps.push(currTime);
        }
        updateCounter();
        logActivity();
        worker.postMessage({ command: 'finish' });
        startTimestamps = [];
        pauseTimestamps = [];
    }

    start.addEventListener("click", startTimer);
    pause.addEventListener("click", pauseTimer);
    finish.addEventListener("click", finishTimer);

    return {
        startTimer: startTimer,
        pauseTimer: pauseTimer,
        finishTimer: finishTimer
    };
})();
