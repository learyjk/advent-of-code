// import readFile
import { readFileSync } from "fs";

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

  // calculate signal strength if we are at a cycle of interest.
  if (cyclesOfInterest.includes(cycle)) {
    const signalStrength = getSignalStrength(cycle, X);
    signalSum += signalStrength;
  }

  // If we are in execution mode, add instruction value to X register,
  // reset execution mode toggle, and advance to next instruction
  if (isExecuting) {
    X += parseInt(second, 10);
    isExecuting = false;
    rowNum++;
  } else {
    // advance to next instruction on 'noop'
    if (first === "noop") {
      rowNum++;
    }
    // go into executing mode for 'addx' instruction
    if (first === "addx") {
      isExecuting = true;
    }
  }

  // increment cycle every iteration
  cycle++;
}
console.log({ signalSum });
