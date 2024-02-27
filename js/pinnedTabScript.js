let mediaRecorder;
let note = ""; // Note content from textarea
let chunkIndex = 0; // Index of the current chunk
let recordUUID = ""; // UUID for the record
// Function to generate a UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to convert a blob to base64 using Promises
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const base64String = reader.result.replace(/^data:.+;base64,/, '');
            resolve(base64String);
        };
        

        reader.onerror = () => {
            reject(new Error('Error reading blob as base64'));
        };

        reader.readAsDataURL(blob);
    });
}

function sendVideoData(chunk) {
    // Convert the chunk to Base64 using the blobToBase64 function
    blobToBase64(chunk)
        .then(base64Data => {
            // Create headers with the note content
            const headers = new Headers();
            headers.append('Note', note);
            headers.append('recordUUID', recordUUID);
            headers.append('chunkIndex', chunkIndex.toString());
            headers.append('Content-Type', 'text/plain');
            const currentdate = new Date();
            headers.append('filename', currentdate.toISOString());
            console.log("headers", headers);
            console.log("base64Data", base64Data);
            // Send the Base64 data to the server using a POST request
            fetch('https://2e5d751xi4.execute-api.ap-southeast-2.amazonaws.com/Prod/', {
                method: 'POST',
                headers: headers,
                body: base64Data
            })
            .then(response => response.json())
            .then(data => {
                console.log('Video data uploaded:', data);
            })
            .catch(error => {
                console.error('Error uploading video data:', error);
            });

            // Increment the chunk index
            chunkIndex++;
        })
        .catch(error => {
            console.error('Error converting chunk to base64:', error);
        });
}

function startRecording(stream) {
    // Generate a UUID for the record at the start of recording
     recordUUID = generateUUID();

    mediaRecorder = new MediaRecorder(stream);

    // When data is available, convert it to Base64 and send it
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            console.log("Data available...");
            sendVideoData(event.data);
        }
    };
    
    // Start recording
    mediaRecorder.start(60000);

    console.log("Recording started...");
}

window.onload = function() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(stream => {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(aStream => {
            const tracks = [...stream.getVideoTracks(), ...aStream.getAudioTracks()];
            const combinedStream = new MediaStream(tracks);
            startRecording(combinedStream);
        });
    })
    .catch(error => {
        console.error("Error accessing media devices:", error);
    });
};

// Listen for stopRecording command
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "stopRecording") {
        note = request.content; // Update note content from request
        mediaRecorder.stop(); // Stop recording
        console.log("Stopping recording...");
    }
});
