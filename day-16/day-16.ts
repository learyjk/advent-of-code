import { readFileSync } from "fs";

const file = readFileSync("day-16/inputExample.txt", "utf-8");

let rows = file.split("\n");
// console.log(rows);

type ValveInfo = {
  index: number;
  flowRate: number;
  tunnels: string[];
  open: boolean;
};

// create a map with key valve string and value of ValveInfo
let parseInput = (input: string[]): Map<string, ValveInfo> => {
  let valves = new Map();
  let index = 0;
  for (let line of input) {
    let valve = line.substring(line.indexOf(" ") + 1, line.indexOf(" ") + 3);
    let flowRate = parseInt(
      line.substring(line.indexOf("=") + 1, line.indexOf(";")),
      10
    );
    let tunnelsStr = line.substring(line.indexOf("to") + 3);
    tunnelsStr = tunnelsStr.substring(tunnelsStr.indexOf(" ") + 1);
    let tunnels = tunnelsStr.split(", ");

    valves.set(valve, { index, flowRate, tunnels, open: false });
    index++;
  }
  return valves;
};

// create a M x M matrix with each cell equal to Infinity
// Infinity represents travel not possible betweent two valves
const createEmpty2DMatrix = (numValves: number): number[][] => {
  const M = Array.from(Array(numValves), () => {
    return new Array(numValves).fill(Infinity);
  });
  return M;
};

const populatePossiblePaths = (
  pathMatrix: number[][],
  valveMap: Map<string, ValveInfo>
) => {
  valveMap.forEach((valveInfo, valve) => {
    let fromIndex = valveInfo.index;
    // assign zero to self
    pathMatrix[fromIndex][fromIndex] = 0;
    // if tunnel exists to valve, set that matrix cell to 1
    for (let tunnel of valveInfo.tunnels) {
      let toIndex = valveMap.get(tunnel).index;
      pathMatrix[fromIndex][toIndex] = 1;
    }
  });
};

// All Pairs Shortest Path Algo - Floyd Warshall
const getShortestPathsMatrix = (M: number[][]) => {
  for (let k = 0; k < M.length; k++) {
    for (let i = 0; i < M.length; i++) {
      for (let j = 0; j < M.length; j++) {
        if (M[i][k] + M[k][j] < M[i][j]) {
          M[i][j] = M[i][k] + M[k][j];
        }
      }
    }
  }
};

const printPathMatrix = (
  pathMatrix: number[][],
  valveMap: Map<string, ValveInfo>
) => {
  let firstStr = "   ";
  let secondStr = "   ";
  valveMap.forEach((valveInfo, valve) => {
    firstStr += valve[0] + "  ";
    secondStr += valve[1] + "  ";
  });
  console.log(firstStr);
  console.log(secondStr);
  valveMap.forEach((valveInfo, valve) => {
    let lineStr = valve + " ";
    let valveIndex = valveInfo.index;
    let row: string[] = [];
    for (let i = 0; i < pathMatrix[valveIndex].length; i++) {
      if (pathMatrix[valveIndex][i] === Infinity) {
        row.push("in");
      } else {
        row.push(pathMatrix[valveIndex][i].toString() + " ");
      }
    }
    lineStr += row.join(" ");
    console.log(lineStr);
  });
};

const openValve = (valve: string): void => {
  const valveInfo = valves.get(valve);
  valveInfo.open = true;
  valves.set(valve, valveInfo);
};

let cache = {};

const findMaxFlow = (
  time: number,
  valve: string,
  valveMap: Map<string, ValveInfo>,
  shortestPaths: number[][]
) => {
  let maxVal = 0;
  for (let i = 0; i < shortestPaths.length; i++) {
    for (let j = 0; j < shortestPaths[0].length; j++) {
      let dist = shortestPaths[i][j];
      if (dist === 0) {
        continue;
      }
      let valveStr;
      for (let [k, v] of valveMap) {
        if (v.index !== j) {
          continue;
        } else {
          valveStr = k;
          if (v.flowRate === 0 || v.open === true) {
            continue;
          }
        }
      }
      let remainingTime = time - shortestPaths[i][j] - 1;
      if (remainingTime <= 0) {
        continue;
      }
      maxVal = Math.max(
        maxVal,
        findMaxFlow(remainingTime, valveStr, valveMap, shortestPaths) +
          valveMap.get(valve).flowRate * remainingTime
      );
    }
  }
  return maxVal;
};

const valves = parseInput(rows);
console.log(valves);

const M = createEmpty2DMatrix(valves.size);
populatePossiblePaths(M, valves);
printPathMatrix(M, valves);
getShortestPathsMatrix(M);
printPathMatrix(M, valves);
let val = findMaxFlow(30, "AA", valves, M);
console.log(val);

/*

sort valves
valve value

// BB, CC, DD, EE, HH, JJ

AA val is zero

BB {minMovesTo: 1, flowRate: 13} -> 13 * (30 - 1) = 377
CC {minMovesTo: 2, flowRate: 2}  -> 2  * (30 - 2) = 56
DD {minMovesTo: 1, flowRate: 20} -> 20 * (30 - 1) = 580
EE {minMovesTo: 2, flowRate: 3}  -> 3  * (30 - 2) = 84
HH {minMovesTo: 5, flowRate: 22} -> 22 * (30 - 5) = 550
JJ {minMovesTo: 2, flowRate: 21} -> 21 * (30 - 2) = 588


valveVal = numMovesLeft - 1 * flowrateNextValve > numMovesLeft * flowrateThisValve

if current valve is greatest val open it, otherwise go to valve with greatest

at a valve

open if?
move if?

got through tunnel valves
    numMovesLeft - 1 * flowrateNextValve > numMovesLeft * flowrateThisValve
    also need to check if open or closed
        if true, move to next valve.

        */
