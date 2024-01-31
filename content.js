let mediaRecorder;
let chunks = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "startRecording") {
            startRecording();
        } else if (request.action === "stopRecording") {
            stopRecording();
        }
    }
);

function startRecording() {
    navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            mediaRecorder.onstop = exportVideo;
            mediaRecorder.start();
        })
        .catch(error => {
            console.error("Error accessing media devices:", error);
            // Handle error
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
}

function exportVideo() {
    const blob = new Blob(chunks, { type: "video/webm" });
    const videoUrl = URL.createObjectURL(blob);
    // You might want to do something with the video file here
    chunks = [];
    URL.revokeObjectURL(videoUrl);
}
