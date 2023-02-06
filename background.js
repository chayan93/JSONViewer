var activeTabIndex = 0;

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        activeTabIndex = tabs[0].index;
        chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_browser_action" });
    });
});

// Listens to the message generated from content__script.js
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "displayJSON") {
            chrome.tabs.create({
                url: chrome.runtime.getURL("./JSONViewer.html"),
                index: ++activeTabIndex
            });
        }
    }
);