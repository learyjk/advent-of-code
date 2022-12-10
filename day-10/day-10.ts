// import readFile
import { readFileSync } from "fs";
import internal = require("stream");

// read the input file
const file = readFileSync("day-10/input.txt", "utf8");

// split the file into rows
const rows = file.split("\n");

let X = 1;
let cycle = 1;
let rowNum = 0;
let isExecuting = false;

const cyclesOfInterest = [20, 60, 100, 140, 180, 220];
let signalSum = 0;

const getSignalStrength = (cycle: number, X: number): number => {
  return X * cycle;
};

while (rowNum < rows.length) {
  let [first, second] = rows[rowNum].split(" ");
  //   console.log(`cycle ${cycle}, X = ${X}, first = ${first}, second = ${second}`);
  if (cyclesOfInterest.includes(cycle)) {
    const signalStrength = getSignalStrength(cycle, X);
    // console.log({ signalStrength });
    signalSum += signalStrength;
    // console.log({ signalSum });
  }

  if (isExecuting) {
    X += parseInt(second, 10);
    isExecuting = false;
    rowNum++;
  } else {
    if (first === "noop") {
      rowNum++;
    }
    if (first === "addx") {
      isExecuting = true;
    }
  }

  cycle++;
}
console.log({ signalSum });
