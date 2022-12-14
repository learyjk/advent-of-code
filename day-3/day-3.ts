import { readFile } from "fs";

const partOne = () => {
  readFile("day-3/input.txt", "utf8", (err, data) => {
    if (err) throw err;

    // Split the data by newline character to get an array of lines
    const lines = data.split("\n");

    let sumOfPriorities = 0;

    for (const line of lines) {
      // Split each ruckasck in to first and second compartments
      const firstCompartment = getFirstHalf(line);
      const secondCompartment = getSecondHald(line);
      // Find the shared character between the compartments
      const sharedChar = findMatch(firstCompartment, secondCompartment);
      // Get the priority of the shared character
      const priority = lookupPriority(sharedChar);
      // Add the priority to the sum of priorities
      sumOfPriorities += priority;
    }
    console.log({ sumOfPriorities });
  });
};
//partOne();

const getFirstHalf = (rucksack: string): string => {
  //get first half of characters of string rucksack
  return rucksack.slice(0, rucksack.length / 2);
};

const getSecondHald = (rucksack: string): string => {
  //get second half of characters of string rucksack
  return rucksack.slice(rucksack.length / 2);
};

const findMatch = (
  firstCompartment: string,
  secondCompartment: string
): string => {
  //compare firstCompartment and secondCompartment
  //return character that they have in common
  //if no match, return "No match"
  for (const charToCheck of firstCompartment) {
    if (secondCompartment.includes(charToCheck)) {
      return charToCheck;
    }
  }
  return "No match";
};

const lookupPriority = (char: string): number => {
  // return the priority of a character
  // priority is determined by the order of the alphabet
  // a = 1, b = 2, c = 3, etc.
  // A=27, B=28, C=29, etc.
  // if char is not a letter, return 0
  let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (alphabet.includes(char)) {
    return alphabet.indexOf(char) + 1;
  }
  return 0;
};

const partTwo = () => {
  readFile("day-3/input.txt", "utf8", (err, data) => {
    if (err) throw err;

    // Split the data by newline character to get an array of lines
    const lines = data.split("\n");

    let sumOfPriorities = 0;

    for (let i = 2; i < lines.length; i += 3) {
      // get every three lines

      const firstLine = lines[i - 2];
      const secondLine = lines[i - 1];
      const thirdLine = lines[i];

      // Find match between three rucksacks
      const matchChar = findMatchThree(firstLine, secondLine, thirdLine);
      // Get the priority of the shared character
      const priority = lookupPriority(matchChar);
      // Add the priority to the sum of priorities
      sumOfPriorities += priority;
    }
    console.log({ sumOfPriorities });
  });
};
partTwo();

const findMatchThree = (
  firstSack: string,
  secondSack: string,
  thirdSack: string
): string => {
  //compare firstCompartment and secondCompartment
  //return character that they have in common
  //if no match, return "No match"
  for (const charToCheck of firstSack) {
    if (secondSack.includes(charToCheck) && thirdSack.includes(charToCheck)) {
      return charToCheck;
    }
  }
  return "No match";
};
