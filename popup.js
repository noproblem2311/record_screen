document.addEventListener("DOMContentLoaded", function () {
    let mediaRecorder;
    let videoData = new FormData(); // Initialize FormData to accumulate video chunks

    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const infoBox = document.getElementById("infoBox");

    function handleMediaAccessDenied() {
        infoBox.textContent = "Access to display media was denied. Please allow access to use the recording feature.";
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    startButton.addEventListener("click", () => {
        navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        console.log("check");
                        videoData.append("chunks", event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    
                    fetch('http://localhost:8000/handle_video/', { 
                        method: 'POST',
                        body: videoData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Video uploaded:', data);
                    })
                    .catch(error => {
                        console.error('Error uploading video:', error);
                    });

                    videoData = new FormData();
                };

                mediaRecorder.start();
                startButton.disabled = true;
                stopButton.disabled = false;
                infoBox.textContent = "";
            })
            .catch((error) => {
                console.error("Error accessing display media:", error);
                handleMediaAccessDenied();
            });
    });

    stopButton.addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    });
});

