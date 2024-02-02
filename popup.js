





document.addEventListener("DOMContentLoaded", function () {
    let mediaRecorder;
    let videoData = new FormData();
    let chunkSize = 0; // Kích thước tích lũy của chunks hiện tại

    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const infoBox = document.getElementById("infoBox");
    const MAX_CHUNK_SIZE = 1024*100; // 1MB

    function sendVideoData() {
        // Gửi videoData đến server
        console.log("type of videoData: ", typeof videoData);
        fetch('http://localhost:8000/handle_video/', { 
            method: 'POST',
            body: videoData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Chunk uploaded:', data);
        })
        .catch(error => {
            console.error('Error uploading chunk:', error);
        });
        // Khởi tạo lại FormData và chunkSize
        videoData = new FormData();
        chunkSize = 0;
    }

    startButton.addEventListener("click", () => {
        navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        videoData.append("chunks", event.data);
                        chunkSize += event.data.size;

                        // Kiểm tra nếu chunkSize lớn hơn hoặc bằng MAX_CHUNK_SIZE thì gửi dữ liệu
                        if (chunkSize >= MAX_CHUNK_SIZE) {
                            console.log("Sending sub video data...");
                            sendVideoData();
                        }
                    }
                };

                mediaRecorder.onstop = sendVideoData; // Gửi dữ liệu còn lại khi dừng ghi

                mediaRecorder.start(1000); // Chia video thành chunks sau mỗi 1000ms
                startButton.disabled = true;
                stopButton.disabled = false;
                infoBox.textContent = "Recording...";
            })
            .catch((error) => {
                console.error("Error accessing display media:", error);
                infoBox.textContent = "Error: Access to display media was denied.";
                startButton.disabled = false;
                stopButton.disabled = true;
            });
    });

    stopButton.addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
            infoBox.textContent = "Stopped recording.";
        }
    });
});
