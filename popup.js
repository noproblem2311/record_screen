document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const infoBox = document.getElementById("infoBox");

    // Lắng nghe tin nhắn từ content script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === "recordingStarted") {
            startButton.disabled = true;
            stopButton.disabled = false;
            infoBox.textContent = "Recording started...";
        } else if (message.action === "recordingStopped") {
            startButton.disabled = false;
            stopButton.disabled = true;
            infoBox.textContent = "Recording stopped.";
        }
    });

    startButton.addEventListener("click", () => {
        // Gửi tin nhắn để bắt đầu ghi hình
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "startRecording"});
        });
    });

    stopButton.addEventListener("click", () => {
        // Gửi tin nhắn để dừng ghi hình
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "stopRecording"});
        });
    });
});
