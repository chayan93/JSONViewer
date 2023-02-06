var activeTabIndex = 0;
var currentWindowId;

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(() => {
    findCurrentWindow().then(windowId => {
        currentWindowId = windowId;

        chrome.tabs.query({ active: true, windowId: currentWindowId }, function (tabs) {
            activeTabIndex = tabs[0].index;
            chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_browser_action" });
        });
    }).catch(error => {
        console.error(error);
    });
});

// Listens to the message generated from content__script.js
chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.message === "displayJSON") {
            const tab = await chrome.tabs.create({
                url: chrome.runtime.getURL("./JSONViewer.html"),
                index: activeTabIndex + 1,
                windowId: currentWindowId,
                active: false
            });

            await onTabLoaded(tab.id);
            await chrome.tabs.sendMessage(tab.id, { "message": "loadJSONData", "data": request.data });

            await chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                setSelfAsOpener: true
            });
        }
    }
);

const findCurrentWindow = async () => {
    return new Promise((resolve, reject) => {
        chrome.windows.getCurrent({}, function (currentWindow) {
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(currentWindow.id);
        });
    });
}

const onTabLoaded = (tabId) => {
    return new Promise(resolve => {
        chrome.tabs.onUpdated.addListener(function onUpdated(id, change) {
            if (id === tabId && change.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(onUpdated);
                resolve();
            }
        });
    });
}