"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const input = (0, fs_1.readFile)("input.txt", "utf8", (err, data) => {
    if (err)
        throw err;
    // Split the data by newline character to get an array of lines
    const lines = data.split("\n");
    // Do something with the array of lines
    const elfMap = new Map();
    let runnningSum = 0;
    let index = 1;
    for (const line of lines) {
        if (line === "") {
            elfMap.set(index, runnningSum);
            runnningSum = 0;
            index++;
            continue;
        }
        runnningSum += parseInt(line, 10);
    }
    let max = 0;
    let maxIndex = 1;
    for (const [key, value] of elfMap) {
        if (value > max) {
            max = value;
            maxIndex = key;
        }
    }
    console.log({ max });
    const values = elfMap.values();
    const sortedValues = [...values].sort((a, b) => b - a);
    const topThree = sortedValues.slice(0, 3);
    let topThreeSum = 0;
    topThree.forEach((value) => {
        topThreeSum += value;
    });
    console.log({ topThreeSum });
});
//# sourceMappingURL=day-1.js.map