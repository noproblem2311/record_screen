let mediaRecorder;
let chunks = [];

// Listener cho các tin nhắn từ popup
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "startRecording") {
            console.log("start record")
            startRecording();
            console.log("start record done and send message")

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

            // Gửi tin nhắn xác nhận đã bắt đầu ghi hình
            chrome.runtime.sendMessage({action: "recordingStarted"});
        })
        .catch(error => {
            console.error("Error accessing media devices:", error);
            // Xử lý lỗi hoặc thông báo cho người dùng
            // Bạn có thể gửi một tin nhắn lỗi trở lại popup nếu cần
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        // Bạn cũng có thể gửi tin nhắn "recordingStopped" sau khi ghi hình dừng, nếu cần
    }
}

function exportVideo() {
    const blob = new Blob(chunks, { type: "video/webm" });
    const videoUrl = URL.createObjectURL(blob);

    // Tạo một liên kết để tải xuống video
    const downloadLink = document.createElement('a');
    downloadLink.href = videoUrl;
    downloadLink.download = 'recorded-video.webm'; // Tên file khi tải xuống
    document.body.appendChild(downloadLink);
    downloadLink.click(); // Kích hoạt click để tải xuống
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(videoUrl); // Dọn dẹp URL tạm thời

    chunks = [];
    // Gửi tin nhắn xác nhận đã dừng ghi hình
    chrome.runtime.sendMessage({action: "recordingStopped"});
}

