// Listens to the message sent by background.js, checks the selected text, validates it.
// asks background.js to open the JSONViewer tab(content.js can't open a new tab)
// background.js can't get to the current document(to get user selected text).

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            var selectedText = window.getSelection().toString();

            if (selectedText) {
                if(checkValidity(selectedText)){
                    try {
                        document.execCommand('copy');
                        chrome.runtime.sendMessage({ "message": "displayJSON" });
                    }
                    catch (e) {
                        console.error('Unable to copy current selection.', e);
                        alert('Unable to copy current selection.');
                    }
                }
                else{
                    let error = 'The selected text is an invalid JSON.';
                    error += ' It must be in the format [{"str": "foo", "int": 1}, {"bool": true, "others": null}]';
                    alert(error);
                }
            }
            else {
                alert('Please select some text first.');
            }
        }
    }
);

const checkValidity = (selectedText) => {
    try{
        JSON.stringify(JSON.parse(selectedText));
        return true;
    }
    catch(error){
        return false;
    }
}