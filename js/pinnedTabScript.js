let mediaRecorder;
let videoData = new FormData(); // Dùng để gửi dữ liệu
let note = ""; // Nội dung ghi chú từ textarea

// Hàm gửi video data đã được chỉnh sửa để phù hợp với logic của bạn
function sendVideoData(message) {
    console.log(message);
    videoData.append("note", note); // Thêm note vào FormData
    if (videoData.has("chunks")) { // Kiểm tra xem có dữ liệu video không
        // Gửi dữ liệu video đến server
        fetch('http://endpoint/', {
            method: 'POST',
            headers: {
                contentType: 'multipart/form-data'
            },
            body: videoData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Chunk uploaded:', data);
        })
        .catch(error => {
            console.error('Error uploading chunk:', error);
        });
        videoData = new FormData(); // Khởi tạo lại FormData sau khi gửi
    } else {
        console.log("No video data available to send");
    }
}

// Bắt đầu ghi khi trang được tải
window.onload = function() {
    let displayStream = null; // Luồng video từ màn hình
    let audioStream = null; // Luồng audio từ microphone

    // Yêu cầu truy cập màn hình
    navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(stream => {
        displayStream = stream;
        // Yêu cầu truy cập microphone
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    })
    .then(aStream => {
        audioStream = aStream;
        const tracks = [...displayStream.getVideoTracks(), ...audioStream.getAudioTracks()];
        const combinedStream = new MediaStream(tracks);
        startRecording(combinedStream);
    })
    .catch(error => {
        console.error("Error accessing media devices:", error);
    });
};

function startRecording(stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            videoData.append("chunks", event.data);
        }
    };
    mediaRecorder.onstop = () => {
        console.log("Recording stopped. Sending final video data...");
        sendVideoData("Final video data sent.");
    };
    mediaRecorder.start();
    console.log("Recording started...");
}

// Lắng nghe message từ background script hoặc popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "stopRecording") {
        note = request.content; // Lấy nội dung ghi chú từ request
        console.log("Stopping recording...");
        mediaRecorder.stop(); // Dừng ghi âm
    }
});
