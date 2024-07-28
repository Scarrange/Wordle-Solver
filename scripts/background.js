const switchButton = document.getElementById("flexSwitchCheckDefault");
switchButton.addEventListener("change", () => {
  chrome.action.setBadgeText({ text: switchButton.checked ? "HARD" : "" });
  chrome.action.setBadgeTextColor({
    color: switchButton.checked ? "#FF0000" : "#000000",
  });
});

const handleClick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) {
    alert("This only works on https://wordledeutsch.org/");
    return;
  }

  chrome.tabs.sendMessage(tab.id, { hardMode: switchButton.checked });
};

document.getElementById("solveButton").addEventListener("click", handleClick);

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  switchButton.checked =
    (await chrome.action.getBadgeText({ tabId: tab.id })) === "HARD";
});
