const shadowRoot = document.querySelector("game-app").shadowRoot;
const board = shadowRoot.getElementById("board");
const gameRows = board.querySelectorAll("game-row");
const gameTiles = [[], [], [], [], []];
for (let i = 0; i < 5; i++) {
  gameTiles[i] = Array.from(
    gameRows[i].shadowRoot.querySelectorAll("game-tile")
  );
}

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

const tryWord = async (word) => {
  console.log("Trying word:", word);
  word.split("").forEach((letter) => {
    sendKey(letter);
  });
  sendKey("Enter");
  await sleep(2000);
};

const removeWord = (wordList, word) => {
  const index = wordList.indexOf(word);
  if (index < 0) {
    return;
  }
  wordList.splice(index, 1);
};

const createRegex = (letter, index) => {
  const dots = Array.from({ length: index }, () => ".").join("");
  return new RegExp(`^${dots}${letter}`);
};

const analyzeWord = (index) => {
  const checks = [];
  gameTiles[index].forEach((tile, index) => {
    if (tile.getAttribute("evaluation") === "correct") {
      checks.push(createRegex(tile.getAttribute("letter"), index));
    }
    if (tile.getAttribute("evaluation") === "present") {
      checks.push(new RegExp(tile.getAttribute("letter")));
      checks.push(createRegex(`[^${tile.getAttribute("letter")}]`, index));
    }
    if (tile.getAttribute("evaluation") === "absent") {
      checks.push(createRegex(`[^${tile.getAttribute("letter")}]`, index));
    }
  });
  return checks;
};

const filterWords = (allWords, checks) => {
  return allWords.filter((word) => {
    return checks.every((check) => {
      return word.match(check);
    });
  });
};

const getWordScore = (frequencies, word) => {
  return word.split("").reduce((acc, letter) => {
    return acc + frequencies[letter];
  }, 0);
};

const main = async (hardMode) => {
  const base = ["seoul", "train"];
  const takenGuesses = [];
  const checks = [];
  let counter = 0;
  let guess = "";
  let solutionWords = await readFile("/util/wordle_words.json");
  let frequencies = await readFile("/util/frequencies.json");

  if (!hardMode) {
    while (counter < 2) {
      guess = base[counter];
      await tryWord(guess);
      takenGuesses.push(guess);
      removeWord(solutionWords, guess);
      checks.push(...analyzeWord(counter));
      solutionWords = filterWords(solutionWords, checks);
      console.log("guesses taken: ", takenGuesses.toString());
      console.log("checks: ", checks.toString());
      console.log("solutionWords: ", solutionWords);
      counter++;
    }
  }

  while (counter < 6) {
    guess = solutionWords
      .sort(
        (a, b) => getWordScore(frequencies, a) - getWordScore(frequencies, b)
      )
      .pop();
    if (!guess) {
      return;
    }

    await tryWord(guess);
    if (counter === 5) {
      break;
    }

    takenGuesses.push(guess);
    checks.push(...analyzeWord(counter));
    solutionWords = filterWords(solutionWords, checks);
    console.log("guesses taken: ", takenGuesses.toString());
    console.log("checks: ", checks.toString());
    console.log("solutionWords: ", solutionWords);
    counter++;
  }
};

chrome.runtime.onMessage.addListener((message) => {
  main(message.hardMode);
});
