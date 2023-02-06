var activeTabIndex = 0;
var currentWindowId;

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(() => {
    findCurrentWindow().then(windowId => {
        currentWindowId = windowId;

        chrome.tabs.query({ active: true, windowId: currentWindowId}, function (tabs) {
            activeTabIndex = tabs[0].index;
            chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_browser_action" });
        });
    }).catch(error => {
        console.error(error);
    });
});

// Listens to the message generated from content__script.js
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "displayJSON") {
            chrome.tabs.create({
                url: chrome.runtime.getURL("./JSONViewer.html"),
                index: activeTabIndex + 1,
                windowId: currentWindowId,
                active: false
            }, function(tab) {
                // After the tab has been created, open a window to inject the tab
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    setSelfAsOpener: true
                });
            });
        }
    }
);

const findCurrentWindow = async () => {
    return new Promise((resolve, reject) =>{
        chrome.windows.getCurrent({}, function (currentWindow) {
            chrome.runtime.lastError
            ? reject(Error(chrome.runtime.lastError.message))
            : resolve(currentWindow.id);
        });
    });
}