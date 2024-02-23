let isRecording = false; // Trạng thái ghi âm

// Tạo khung điều khiển UI cho ghi âm
const controlPanel = document.createElement('div');
controlPanel.style.cssText = 'position: fixed; bottom: 10px; left: 10px; background: lightgray; padding: 10px; z-index: 2147483647; display: none;';
controlPanel.innerHTML = `
  <button id="toggleRecording">Start Recording</button>
  <div id="status">
    <p>Microphone & Camera status: <span id="permissionStatus">Unknown</span></p>
  </div>
`;
document.body.appendChild(controlPanel);

// Tạo container để chứa ô nhập text và nút thu nhỏ
const noteContainer = document.createElement("div");
noteContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 2147483648;';

// Tạo ô nhập text
const noteInput = document.createElement("textarea");
noteInput.style.cssText = 'width: 20vw; height: 90vh;';

// Tạo nút thu nhỏ và khôi phục
const minimizeButton = document.createElement("button");
minimizeButton.textContent = "-";
minimizeButton.style.cssText = 'position: absolute; top: 0; right: 0; font-size: 3em;';

const restoreButton = document.createElement("button");
restoreButton.textContent = "+";
restoreButton.style.cssText = 'position: absolute; top: 0; right: 50px; display: none; font-size: 3em;';

noteContainer.appendChild(minimizeButton);
noteContainer.appendChild(restoreButton);
noteContainer.appendChild(noteInput);
document.body.appendChild(noteContainer);

// Logic thu nhỏ và khôi phục
minimizeButton.onclick = () => {
  noteInput.style.width = "5vw";
  noteInput.style.height = "5vh";
  minimizeButton.style.display = "none";
  restoreButton.style.display = "block";
};

restoreButton.onclick = () => {
  noteInput.style.width = "20vw";
  noteInput.style.height = "90vh";
  restoreButton.style.display = "none";
  minimizeButton.style.display = "block";
};

const toggleRecordingBtn = document.getElementById('toggleRecording');

toggleRecordingBtn.addEventListener('click', () => {
  let messageData = { action: isRecording ? "stop" : "start" };
  
  // Điều chỉnh ở đây để gửi nội dung của textarea khi dừng ghi âm
  if (!isRecording) {
    chrome.runtime.sendMessage(messageData);
  } else {
    // Bao gồm nội dung của textarea trong tin nhắn khi dừng ghi âm
    messageData.content = noteInput.value;
    chrome.runtime.sendMessage(messageData);
  }

  isRecording = !isRecording; // Đảo trạng thái ghi âm
  updateButtonState(); // Cập nhật trạng thái nút
});

function updateButtonState() {
  if (isRecording) {
    toggleRecordingBtn.textContent = 'Stop Recording';
  } else {
    toggleRecordingBtn.textContent = 'Start Recording';
  }
}

// Lắng nghe tin nhắn từ background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.toggle === "controlPanel") {
    const display = controlPanel.style.display === 'none' ? 'block' : 'none';
    controlPanel.style.display = display;
    if (display === 'block') {
      updateButtonState(); // Cập nhật trạng thái nút dựa trên trạng thái ghi âm hiện tại
    }
  }
});

// Mặc định hiển thị khung điều khiển
controlPanel.style.display = 'block';
