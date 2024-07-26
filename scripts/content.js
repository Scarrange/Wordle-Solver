const shadowRoot = document.querySelector("game-app").shadowRoot;
const board = shadowRoot.getElementById("board");
console.log("Shadow Root", shadowRoot);
console.log("Board", board);
const gameRows = board.querySelectorAll("game-row");
console.log("Game Rows", gameRows);
console.log("End");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const readFile = async (url) => {
  try {
    const response = await fetch(chrome.runtime.getURL(url));
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to read file:", error);
  }
};

const sendKey = (key) => {
  document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
};

const tryWords = async (words) => {
  for (const word of words) {
    console.log("Word:", word);
    word.split("").forEach((letter) => {
      sendKey(letter);
    });
    sendKey("Enter");
    await sleep(2000);
  }
};

const main = async () => {
  const base = ["seoul", "train"];
  const takenGuesses = [];
  SOLUTION_WORDS = await readFile("/util/wordle_words.json");
  const FREQUENCIES = await readFile("/util/frequencies.json");
  console.log("Solutions", SOLUTION_WORDS);
  console.log("Frequencies", FREQUENCIES);

  await tryWords(base);
  takenGuesses.push(...base);
  console.log(takenGuesses);
};
main();
