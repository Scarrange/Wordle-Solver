const shadowRoot = document.querySelector("game-app").shadowRoot;
const board = shadowRoot.getElementById("board");
console.log("Shadow Root", shadowRoot);
console.log("Board", board);
const gameRows = board.querySelectorAll("game-row");
console.log("Game Rows", gameRows);
console.log("End");

const sendKey = (key) => {
  document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const base = ["seoul", "pirat"];

const tryWords = async (words) => {
  for (const word of words) {
    console.log("Word", word);
    word.split("").forEach((letter) => {
      sendKey(letter);
    });
    sendKey("Enter");
    await sleep(2000);
  }
};

tryWords(base);
