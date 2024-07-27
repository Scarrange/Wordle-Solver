const fs = require("fs");
const data = fs.readFileSync("../wordle_words.json", "utf-8");
const SOLUTION_LIST = JSON.parse(data).SOLUTION_LIST;
let letterCounts = {};
"abcdefghijklmnopqrstuvwxyz".split("").forEach((l) => (letterCounts[l] = 0));

SOLUTION_LIST.forEach((word) => {
  word.split("").forEach((letter) => letterCounts[letter]++);
});

const sortedObject = Object.fromEntries(
  Object.entries(letterCounts).sort((a, b) => b[1] - a[1])
);
console.log(`There are ${SOLUTION_LIST.length} solution words`);
console.log("Sorted letters:\n", sortedObject);
fs.writeFile(
  "../frequencies.json",
  JSON.stringify(sortedObject),
  "utf-8",
  (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
      return;
    }
    console.log("frequencies.json has been updated!");
  }
);

const tenLetters = Object.keys(sortedObject).slice(0, 10);
console.log("\nThe 10 most common letters are:", tenLetters);
