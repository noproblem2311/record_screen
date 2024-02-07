
// Tạo một container để chứa ô nhập text và nút thu nhỏ

console.log("content.js is running");
  
setInterval(() => {
  chrome.runtime.sendMessage({status: "DATA_HERE", action: noteInput.value});
}, 20000);

const noteContainer = document.createElement("div");
noteContainer.style.position = "fixed";
noteContainer.style.bottom = "20px";
noteContainer.style.right = "20px";

// Cố gắng đặt zIndex cao nhất
const existingZIndexes = [...document.querySelectorAll('*')]
  .map(elem => parseFloat(window.getComputedStyle(elem).zIndex))
  .filter(zIndex => !isNaN(zIndex));
const highestZIndex = existingZIndexes.length > 0 ? Math.max(...existingZIndexes) : 0;
noteContainer.style.zIndex = highestZIndex + 1; // Đảm bảo rằng container nằm trên cùng

// Tạo ô nhập text
const noteInput = document.createElement("textarea");
noteInput.style.width = "20vw";
noteInput.style.height = "90vh";

// Tạo nút thu nhỏ
const minimizeButton = document.createElement("button");
minimizeButton.innerHTML = "-";
minimizeButton.style.position = "absolute";
minimizeButton.style.top = "0";
minimizeButton.style.right = "0";
minimizeButton.style.fontSize = "3em";
minimizeButton.style.marginRight = "10px";

// Tạo nút khôi phục kích thước
const restoreButton = document.createElement("button");
restoreButton.innerHTML = "+";
restoreButton.style.position = "absolute";
restoreButton.style.top = "0";
restoreButton.style.right = "50px";
restoreButton.style.display = "none"; // Ẩn nút khôi phục cho đến khi cần thiết
restoreButton.style.fontSize = "3em";
// restoreButton.style.paddingBottom = "20px";
// Thêm nút thu nhỏ và khôi phục vào container
noteContainer.appendChild(minimizeButton);
noteContainer.appendChild(restoreButton);
noteContainer.appendChild(noteInput);

// Thêm container vào trang web
document.body.appendChild(noteContainer);

// Định nghĩa hành động thu nhỏ
minimizeButton.onclick = function() {
    noteInput.style.width = "5vw";
    noteInput.style.height = "5vh";
    minimizeButton.style.display = "none";
    restoreButton.style.display = "block";
};

// Định nghĩa hành động khôi phục kích thước ban đầu
restoreButton.onclick = function() {
    noteInput.style.width = "20vw";
    noteInput.style.height = "90vh";
    restoreButton.style.display = "none";
    minimizeButton.style.display = "block";
};

