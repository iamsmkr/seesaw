var Timer = (function () {
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

    function logActivity() {
        var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        var activity = "Study";
        var inactivity = "Break";

        function formatDate(date) {
            var formattedDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
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

            // console.log('start', start, 'pause', pause, 'duration', duration);
            console.log(formatDate(new Date(start)), '|', formatDate(new Date(pause)), '|', durationStr, '|', !isRunning ? activity : inactivity);
        }
    }

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
            var pause = pauseTimestamps[i - 1] || 0;
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
            // console.log('start: ', 'startTimestamps', startTimestamps, 'pauseTimestamps', pauseTimestamps);
            logActivity();
        }
    }

    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            clearInterval(t);
            pauseTimestamps.push(new Date().getTime());
            // console.log('pause: ', 'startTimestamps', startTimestamps, 'pauseTimestamps', pauseTimestamps);
            logActivity();
        }
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
        } else {
            pauseTimestamps.push(currTime);
        }
        updateCounter();
        // console.log('finish: ', 'startTimestamps', startTimestamps, 'pauseTimestamps', pauseTimestamps);
        logActivity();
        seconds = 0;
        minutes = 0;
        hours = 0;
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
