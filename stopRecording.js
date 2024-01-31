if (window.mediaRecorder && window.mediaRecorder.state === "recording") {
    window.mediaRecorder.stop();
    window.mediaRecorder.onstop = () => {
        const blob = new Blob(window.chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = 'recorded-meeting.webm';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(videoUrl);
        window.mediaRecorder = null;
        window.chunks = [];
    };
}
