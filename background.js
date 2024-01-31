var isrecord = false;
var currenturl = "";

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes("https://meet.google.com/")) {
        console.log("start record")
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['startRecording.js']
        });
        isrecord = true;
        currenturl = tab.url;
    } 

    if (isrecord && tab.url && tab.url != currenturl) {
        console.log("stop record")

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['stopRecording.js']
        });
        isrecord = false;
    }
});
