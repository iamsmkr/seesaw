var seesaw = (function() {
    document.addEventListener('DOMContentLoaded', function () {
        Settings.loadPreferences();
        Captions.loadCaption('timerCaption');
        Captions.loadCaption('counterCaption');
    });
})();
