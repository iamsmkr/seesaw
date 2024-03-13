var Settings = (function () {
    var settingsBtn = document.getElementById("settings-btn");
    var settingsModal = document.getElementById("settings-modal");
    var saveSettingsBtn = document.getElementById("save-settings");
    var cancelSettingsBtn = document.getElementById("cancel-settings");

    function showSettingsButton() {
        settingsBtn.style.display = "block";
    }

    function hideSettingsButton() {
        settingsBtn.style.display = "none";
    }

    function showSettingsModal() {
        settingsModal.style.display = "block";
    }

    function hideSettingsModal() {
        settingsModal.style.display = "none";
    }

    function applyButtonStyles(fontColor, bgColor) {
        var buttons = document.querySelectorAll("button");
        buttons.forEach(function (button) {
            button.style.color = fontColor;
            button.style.backgroundColor = bgColor;
            button.style.borderColor = fontColor;
            button.addEventListener("mouseenter", function () {
                button.style.color = bgColor;
                button.style.backgroundColor = fontColor;
                button.style.borderColor = fontColor;
            });
            button.addEventListener("mouseleave", function () {
                button.style.color = fontColor;
                button.style.backgroundColor = bgColor;
                button.style.borderColor = fontColor;
            });
        });
    }

    function savePreferences(bgColor, fontColor) {
        localStorage.setItem('background-color', bgColor);
        localStorage.setItem('font-color', fontColor);
    }

    function loadPreferences() {
        var savedBgColor = localStorage.getItem('background-color');
        var savedFontColor = localStorage.getItem('font-color');

        if (savedBgColor && savedFontColor) {
            document.body.style.backgroundColor = savedBgColor;
            document.body.style.color = savedFontColor;
            applyButtonStyles(savedFontColor, savedBgColor);
            settingsBtn.style.color = savedFontColor;
            settingsBtn.style.backgroundColor = savedBgColor;
        }
    }

    settingsBtn.addEventListener("click", showSettingsModal);
    saveSettingsBtn.addEventListener("click", function () {
        var selectedBgColor = document.getElementById("background-color").value;
        var selectedFontColor = document.getElementById("font-color").value;

        document.body.style.backgroundColor = selectedBgColor;
        document.body.style.color = selectedFontColor;
        applyButtonStyles(selectedFontColor, selectedBgColor);
        settingsBtn.style.color = selectedFontColor;
        settingsBtn.style.backgroundColor = selectedBgColor;

        savePreferences(selectedBgColor, selectedFontColor);
        hideSettingsModal();
    });

    cancelSettingsBtn.addEventListener("click", hideSettingsModal);

    // Show and hide settings button on mouse activity
    var timeout;
    document.addEventListener("mousemove", function () {
        clearTimeout(timeout);
        showSettingsButton();
        timeout = setTimeout(hideSettingsButton, 2000);
    });

    return {
        savePreferences: savePreferences,
        loadPreferences: loadPreferences,
    };
})();
