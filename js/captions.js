var Captions = (function () {
    var timerCaption = document.getElementById("timerCaption");
    var counterCaption = document.getElementById("counterCaption");

    function saveCaption(id) {
        var caption = document.getElementById(id).innerText;
        localStorage.setItem(id, caption);
    }

    function loadCaption(id) {
        var savedCaption = localStorage.getItem(id);
        if (savedCaption) {
            document.getElementById(id).innerText = savedCaption;
        }
    }

    timerCaption.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
    
    counterCaption.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    timerCaption.addEventListener('blur', function () {
        saveCaption('timerCaption');
    });

    counterCaption.addEventListener('blur', function () {
        saveCaption('counterCaption');
    });

    return {
        saveCaption: saveCaption,
        loadCaption: loadCaption
    };
})();
