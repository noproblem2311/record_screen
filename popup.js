





document.addEventListener("DOMContentLoaded", function () {
    let mediaRecorder;
    let videoData = new FormData();
    let chunkSize = 0; // Kích thước tích lũy của chunks hiện tại
    let noteContent = "";
    
    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const infoBox = document.getElementById("infoBox");
    const MAX_CHUNK_SIZE = 1024*100; // 1MB






      
    function sendVideoData(check="") { // Thêm tham số noteContent với giá trị mặc định là chuỗi rỗng
        // Thêm noteContent vào videoData
        videoData.append("note", noteContent); // Thêm noteContent vào FormData
        
        // Gửi videoData đến server
        console.log("type of videoData: ", typeof videoData);
        fetch('http://localhost:8000/handle_video/', {
            method: 'POST',
            body: videoData
        })
        .then(response => response.json())
        .then(data => {
            console.log("noteContent: ", noteContent);
            console.log('Chunk uploaded:', data);
        })
        .catch(error => {
            console.error('Error uploading chunk:', error);
        });
    
        // Khởi tạo lại FormData và chunkSize sau khi gửi
        videoData = new FormData();
        chunkSize = 0;
    }
    

    startButton.addEventListener("click", () => {

        chrome.runtime.sendMessage({status: "Start record"});

        navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        videoData.append("chunks", event.data);
                        chunkSize += event.data.size;   
                        console.log("siz",chunkSize);
                        // Kiểm tra nếu chunkSize lớn hơn hoặc bằng MAX_CHUNK_SIZE thì gửi dữ liệu
                        if (chunkSize >= MAX_CHUNK_SIZE) {
                            console.log("Sending sub video data...");
                            sendVideoData("o cho day");
                        }
                    }
                };
                mediaRecorder.onstop =()=>{
                    console.log("Sending final video data...");
                    sendVideoData("o hehe");
                } 
                mediaRecorder.start();
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

    setInterval(() => {
       console.log("this is note",noteContent);
    }, 1000);
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.status == "DATA_HERE") {
            noteContent = request.action;
            console.log("this is data",request.action); // request.action chứa giá trị của noteInput.value
          }
        }
      );
});
