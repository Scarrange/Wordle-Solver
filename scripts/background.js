const handleClick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) {
    alert("This only works on https://wordledeutsch.org/");
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scripts/content.js"],
  });
};

document.getElementById("solveButton").addEventListener("click", handleClick);
