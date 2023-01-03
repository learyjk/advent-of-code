import { readFileSync } from "fs";

let file = readFileSync("day-12/input.txt", "utf8");

let rows = file.split("\n");

const START_CHAR = "S";
const END_CHAR = "E";

// chars is 2D array of our input.
const chars: string[][] = [];
// visited is 2D array of input but with booleans.
const visited: boolean[][] = [];

rows.forEach((row) => {
  chars.push(row.split(""));
  var visitRow: boolean[] = [];
  row.split("").map((_) => visitRow.push(false));
  visited.push(visitRow);
});

const directions: number[][] = [
  [1, 0], // go right
  [-1, 0], // go left
  [0, 1], // go down
  [0, -1], // go up
];

var start = [0, 0];
var end = [0, 0];
// get start and end positions.
chars.forEach((row, i) => {
  row.forEach((ele, j) => {
    if (ele === END_CHAR) {
      end = [i, j];
    }
    if (ele === START_CHAR) {
      start = [i, j];
    }
  });
});

const elevationAlphabet = "abcdefghijklmnopqrstuvwxyz";
// set start and end positions to letters in our alphabet so our algorithm
// doesn't have to look for "S" or "E"
chars[start[0]][start[1]] = "a";
chars[end[0]][end[1]] = "z";

// use a queue data structure to track state (paths to explore) and move count.
// BFS.
// First state is position of Start and move count = 0
const Q: number[][] = [[start[0], start[1], 0]];

while (Q.length > 0) {
  const curr = Q.shift();
  if (!curr) break;
  // explore each direction.
  for (let direction of directions) {
    let currRow = curr[0];
    let currCol = curr[1];
    let nextRow = currRow + direction[0];
    let nextCol = currCol + direction[1];

    // check that it's a valid grid location
    if (
      nextRow < 0 ||
      nextCol < 0 ||
      nextRow >= chars.length ||
      nextCol >= chars[0].length
    ) {
      continue;
    }

    // check that we haven't visited this location
    if (visited[nextRow][nextCol]) {
      continue;
    }

    // check that the next location is a valid elevation change
    let currElevation = elevationAlphabet.indexOf(chars[currRow][currCol]);
    let nextElevation = elevationAlphabet.indexOf(chars[nextRow][nextCol]);
    if (nextElevation - currElevation > 1) {
      continue;
    }

    // check if we've reached the end
    if (nextRow === end[0] && nextCol === end[1]) {
      console.log("PART 1 : ", curr[2] + 1);
      break;
    }

    // updated visited tracker with this location to true.
    visited[nextRow][nextCol] = true;

    // nextRow, nextCol is a valid state,
    // push it on to the queue and explore it.
    // increment moves count
    Q.push([nextRow, nextCol, curr[2] + 1]);
  }
}
