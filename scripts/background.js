let hardMode = false;

const handleClick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) {
    alert("This only works on https://wordledeutsch.org/");
    return;
  }

  hardMode = document.getElementById("flexSwitchCheckDefault").checked;
  chrome.tabs.sendMessage(tab.id, { hardMode });
};

document.getElementById("solveButton").addEventListener("click", handleClick);
