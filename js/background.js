console.log("background.js is running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background.js");
    console.log(request);
    if (request.status === "Start record") {
        console.log("Start record message received");
        navigator.mediaDevices.
    }

    });