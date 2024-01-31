if (!window.mediaRecorder || window.mediaRecorder.state === "inactive") {
    navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
        .then((stream) => {
            window.mediaRecorder = new MediaRecorder(stream);
            window.chunks = [];

            window.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    window.chunks.push(event.data);
                }
            };

            window.mediaRecorder.start();
        })
        .catch((error) => {
            console.error("Error accessing media devices:", error);
            // Xử lý lỗi ở đây
        });
}
