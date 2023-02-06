// Listens to the message sent by background.js, checks the selected text, validates it.
// asks background.js to open the JSONViewer tab(content.js can't open a new tab)
// background.js can't get to the current document(to get user selected text).

var checkCopiedInsteadOfSelected;
var copiedText;
var selectedText;
var dataToDisplay;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            if (checkTexts()) {
                chrome.runtime.sendMessage({
                    "message": "displayJSON", "data": dataToDisplay
                });
            }
        }
    }
);

const checkTexts = () => {
    selectedText = (window.getSelection().toString() || '').trim();
    checkIfCopiedTextExists();

    var selectionExistsAndValid = checkIfTextSelectionExists();

    if (selectionExistsAndValid) {
        return true;
    }
    else if (checkCopiedInsteadOfSelected) {
        let isValid = checkValidity(copiedText);
        if (isValid) {
            return true;
        }

        let alertMsg = "Copied text isn't a valid JSON.";
        alertMsg += ' The correct format is [{"str": "foo", "int": 1}, {"bool": true, "others": null}]';
        alert(alertMsg);
    }

    return false;
}

const checkIfTextSelectionExists = () => {
    if (!selectedText) {
        if (copiedText) {
            checkCopiedInsteadOfSelected = confirm("Selected text isn't found. Do you want to check the last copied text?");
        }
        return false;
    }
    else {
        var isValid = checkValidity(selectedText);

        if (isValid) {
            return true;
        }
        else {
            if (copiedText) {
                let confirmMsg = "Selected text isn't a valid JSON.";
                confirmMsg += ' The correct format is [{"str": "foo", "int": 1}, {"bool": true, "others": null}]';
                confirmMsg += '\n\nDo you want to check the last copied text?'

                checkCopiedInsteadOfSelected = confirm(confirmMsg);
            }

            return false;
        }
    }
}

const checkIfCopiedTextExists = () => {
    var inputElem = document.createElement("input");
    document.body.appendChild(inputElem);
    inputElem.focus();
    document.execCommand("paste");
    let val = inputElem.value;
    document.body.removeChild(inputElem);
    copiedText = (val || '').trim();
}

const checkValidity = (dataToCheck) => {
    try {
        dataToDisplay = JSON.stringify(JSON.parse(dataToCheck), null, 4);
        return true;
    }
    catch (error) {
        return false;
    }
}