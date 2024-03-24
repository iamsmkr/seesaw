(async () => {
    try {
        const { 
            COMMAND,
            TIMER_TYPE,
            WEEKDAYS, 
            MONTHS, 
            ACTIVE, 
            INACTIVE 
        } = await import('./constants.js');
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let timerInterval;

        var isRunning = false;
        var startTimestamps = [];
        var pauseTimestamps = [];

        var lastActivity = ACTIVE;
        const toggleLastActivity = () => {
            lastActivity = lastActivity === ACTIVE ? INACTIVE : ACTIVE;
        };

        const logActivity = () => {
            const formatDate = (date) => {
                return WEEKDAYS[date.getDay()] + ', ' +
                    date.getDate() + ' ' +
                    MONTHS[date.getMonth()] + ' ' +
                    date.getFullYear() + ' ' +
                    date.getHours().toString().padStart(2, '0') + ':' +
                    date.getMinutes().toString().padStart(2, '0') + ':' +
                    date.getSeconds().toString().padStart(2, '0');
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
                        ? formatDate(new Date(pause)) + ' | ' + formatDate(new Date(start)) + ' | ' + durationStr + ' | ' + lastActivity
                        : formatDate(new Date(start)) + ' | ' + formatDate(new Date(pause)) + ' | ' + durationStr + ' | ' + lastActivity
                );
            }
        }

        const updateTimer = () => {
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

            postMessage({
                type: TIMER_TYPE.TIMER,
                time: { hours, minutes, seconds }
            });
        }

        const updateCounter = () => {
            var totalBreak = 0;
            for (var i = 1; i < startTimestamps.length; i++) {
                var start = startTimestamps[i];
                var pause = pauseTimestamps[i - 1] || 0;
                var duration = Math.floor((start - pause) / 1000);
                totalBreak += duration;
            }

            const hours = Math.floor(totalBreak / 3600);
            const minutes = Math.floor((totalBreak % 3600) / 60);
            const seconds = totalBreak % 60;

            postMessage({
                type: TIMER_TYPE.COUNTER,
                time: { hours, minutes, seconds }
            });
        }

        const isTimerDirty = () => {
            return seconds !== 0 || minutes !== 0 || hours !== 0;
        };

        const clearAll = () => {
            isRunning = false;
            lastActivity = ACTIVE;  // Reset lastActivity
            clearInterval(timerInterval);
            seconds = 0;
            minutes = 0;
            hours = 0;
            startTimestamps = [];
            pauseTimestamps = [];
        };

        /* eslint-disable-next-line no-restricted-globals */
        self.onmessage = function ({ data }) {
            const { command } = data;
            if (command === COMMAND.START) {
                if (!isRunning) {
                    isRunning = true;
                    toggleLastActivity();
                    clearInterval(timerInterval);
                    if (seconds === 0 && minutes === 0 && hours === 0) {
                        postMessage({
                            type: TIMER_TYPE.TIMER,
                            time: { hours, minutes, seconds }
                        });
                    }
                    startTimestamps.push(new Date().getTime());
                    timerInterval = setInterval(updateTimer, 1000);
                    updateCounter();
                    logActivity();
                }
            } else if (command === COMMAND.PAUSE) {
                if (isRunning) {
                    isRunning = false;
                    toggleLastActivity();
                    clearInterval(timerInterval);
                    pauseTimestamps.push(new Date().getTime());
                    logActivity();
                }
            } else if (command === COMMAND.FINISH) {
                if (isTimerDirty()) {
                    isRunning = false;
                    var currTime = new Date().getTime();
                    if (startTimestamps.length === pauseTimestamps.length) {
                        startTimestamps.push(currTime);
                    } else if (startTimestamps.length < pauseTimestamps.length) {
                        startTimestamps.push(currTime);
                        pauseTimestamps.push(currTime);
                    } else {
                        pauseTimestamps.push(currTime);
                    }
                    toggleLastActivity();
                    updateCounter();
                    logActivity();
                    clearAll();
                }
            }
        };
    } catch (error) {
        console.error("Failed to load constants.js module:", error);
    }
})();

