import { readFileSync } from "fs";

// Open the file and read its contents
const file = readFileSync("day-6/input.txt", "utf8");

const checkForUniqueCharacters = (vals: string[]) => {
  const m = new Map();
  for (let val of vals) {
    if (m.has(val)) {
      // found a duplicate, return false
      return false;
    }
    m.set(val, true);
  }
  return true;
};

const parseInput = (input: string) => {
  for (let i = 3; i < input.length; i++) {
    let first = file[i - 3];
    let second = file[i - 2];
    let third = file[i - 1];
    let fourth = file[i];

    // if first, second, third, and fourth are all different characters return true
    let isUnique = checkForUniqueCharacters([first, second, third, fourth]);
    if (isUnique) {
      console.log("indexPart1: ", i + 1);
      return;
    }
  }
};
parseInput(file);

const parseInput2 = (input: string) => {
  for (let i = 13; i < input.length; i++) {
    // could have used a loop to create a map that works similar to checkForUniqueCharacters but Github copilot did this for me lol.
    let first = file[i - 13];
    let second = file[i - 12];
    let third = file[i - 11];
    let fourth = file[i - 10];
    let fifth = file[i - 9];
    let sixth = file[i - 8];
    let seventh = file[i - 7];
    let eighth = file[i - 6];
    let ninth = file[i - 5];
    let tenth = file[i - 4];
    let eleventh = file[i - 3];
    let twelfth = file[i - 2];
    let thirteenth = file[i - 1];
    let fourteenth = file[i];

    // if first, second, third, and fourth are all different characters return true
    let isUnique = checkForUniqueCharacters([
      first,
      second,
      third,
      fourth,
      fifth,
      sixth,
      seventh,
      eighth,
      ninth,
      tenth,
      eleventh,
      twelfth,
      thirteenth,
      fourteenth,
    ]);
    if (isUnique) {
      console.log("indexPart2: ", i + 1);
      return;
    }
  }
};
parseInput2(file);
