"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
(0, fs_1.readFile)("day-1/input.txt", "utf8", (err, data) => {
    if (err)
        throw err;
    // Split the data by newline character to get an array of lines
    const lines = data.split("\n");
    // Create a map of elf number to its total calories
    const elfMap = new Map();
    let runnningSum = 0;
    let index = 1;
    for (const line of lines) {
        // If the line is empty, we've reached the end of the elf's calories
        if (line === "") {
            elfMap.set(index, runnningSum);
            runnningSum = 0;
            index++;
            continue;
        }
        // Otherwise, add the calories to the running sum
        runnningSum += parseInt(line, 10);
    }
    // Find max calories
    let max = 0;
    let maxIndex = 1;
    for (const [key, value] of elfMap) {
        if (value > max) {
            max = value;
            maxIndex = key;
        }
    }
    console.log({ max });
    // PART TWO
    // Find top three elves by calories
    const values = elfMap.values();
    const sortedValues = [...values].sort((a, b) => b - a);
    const topThree = sortedValues.slice(0, 3);
    // Sum the calories of the top three elves
    let topThreeSum = 0;
    topThree.forEach((value) => {
        topThreeSum += value;
    });
    console.log({ topThreeSum });
});
//# sourceMappingURL=day-1.js.map