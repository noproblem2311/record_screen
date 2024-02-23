

// turn on and off control panel
chrome.action.onClicked.addListener((tab) => {
   
    chrome.tabs.sendMessage(tab.id, {toggle: "controlPanel"});
});
  




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
      const url = chrome.runtime.getURL("html/pinnedTab.html");
      chrome.tabs.create({
        url: url,
        pinned: true
    });
    }
    else if (message.action === "stop") {
        console.log("send stop message to new tab");
        chrome.runtime.sendMessage({action: "stopRecording", content: message.content});
    }
    
});





  



