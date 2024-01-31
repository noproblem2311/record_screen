document.addEventListener("DOMContentLoaded", function () {
    let mediaRecorder;
    let chunks = [];

    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const infoBox = document.getElementById("infoBox"); // Add an info box element for messages

    function handleMediaAccessDenied() {
        infoBox.textContent = "Access to media devices was denied. Please allow access to use the recording feature.";
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    startButton.addEventListener("click", () => {
        navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "video/webm" });
                    const videoUrl = URL.createObjectURL(blob);

                    const downloadLink = document.createElement('a');
                    downloadLink.href = videoUrl;
                    downloadLink.download = 'recorded-video.webm'; // You can name the file here
                    document.body.appendChild(downloadLink);
                    downloadLink.click(); // Simulate click to trigger the download
                    document.body.removeChild(downloadLink);

                    URL.revokeObjectURL(videoUrl); // Clean up
                };

                mediaRecorder.start();
                startButton.disabled = true;
                stopButton.disabled = false;
                infoBox.textContent = ""; // Clear any error messages
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
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




// document.addEventListener("DOMContentLoaded", function () {
//     let mediaRecorder;
//     let chunks = [];

//     const startButton = document.getElementById("startRecording");
//     const stopButton = document.getElementById("stopRecording");
//     const infoBox = document.getElementById("infoBox"); // Add an info box element for messages

//     function handleMediaAccessDenied() {
//         infoBox.textContent = "Access to media devices was denied. Please allow access to use the recording feature.";
//         startButton.disabled = false;
//         stopButton.disabled = true;
//     }

//     function uploadToGoogleCloudStorage(blob) {
//         // Assuming you have an OAuth token and a bucket URL
//         const oauthToken = 'YOUR_OAUTH_TOKEN';
//         const bucketUrl = 'YOUR_BUCKET_URL';

//         const formData = new FormData();
//         formData.append('file', blob, 'recorded-video.webm');

//         fetch(bucketUrl, {
//             method: 'POST',
//             headers: new Headers({ 'Authorization': 'Bearer ' + oauthToken }),
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//             infoBox.textContent = "Video uploaded successfully.";
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             infoBox.textContent = "Failed to upload video.";
//         });
//     }

//     startButton.addEventListener("click", () => {
//         navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
//             .then((stream) => {
//                 mediaRecorder = new MediaRecorder(stream);
//                 mediaRecorder.ondataavailable = (event) => {
//                     if (event.data.size > 0) {
//                         chunks.push(event.data);
//                     }
//                 };

//                 mediaRecorder.onstop = () => {
//                     const blob = new Blob(chunks, { type: "video/webm" });
//                     uploadToGoogleCloudStorage(blob); // Upload the video instead of downloading
//                 };

//                 mediaRecorder.start();
//                 startButton.disabled = true;
//                 stopButton.disabled = false;
//                 infoBox.textContent = ""; // Clear any error messages
//             })
//             .catch((error) => {
//                 console.error("Error accessing media devices:", error);
//                 handleMediaAccessDenied();
//             });
//     });

//     stopButton.addEventListener("click", () => {
//         if (mediaRecorder && mediaRecorder.state === "recording") {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });
// });
