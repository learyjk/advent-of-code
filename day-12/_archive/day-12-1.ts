import { readFileSync } from "fs";

let file = readFileSync("day-12/input.txt", "utf8");

let rows = file.split("\n");
let chars = rows.map((row) => row.split(""));

let START_CHAR = "S";
let END_CHAR = "E";

let numRows = rows.length;
let numCols = rows[0].length;

// keep track of positions visited
let visited = new Array(numRows);
for (var i = 0; i < numRows; i++) {
  visited[i] = new Array(numCols);
  for (var j = 0; j < numCols; j++) {
    visited[i][j] = false;
  }
}

// get start and end points
let startPos = [0, 0];
let endPos = [0, 0];

for (let r = 0; r < numRows; r++) {
  for (let c = 0; c < numCols; c++) {
    if (chars[r][c] === START_CHAR) {
      startPos[0] = r;
      startPos[1] = c;
    }
    if (chars[r][c] === END_CHAR) {
      endPos[0] = r;
      endPos[1] = c;
    }
  }
}

let charsCopy = chars.map((row) => row.slice());
charsCopy.forEach((row) => {
  console.log(row.join(""));
});

// alphabet for checking elevations
let elevationAlphabet = "SabcdefghijklmnopqrstuvwxyzE";

// explores UP, RIGHT, DOWN, LEFT
let exploreNeighbors = (r: number, c: number) => {
  let goodNeighbors = [];
  let moves = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (let move of moves) {
    let rNew = r + move[0];
    let cNew = c + move[1];
    //console.log(`exploring from ${r}, ${c} with char ${chars[r][c]}`);
    if (rNew < 0 || rNew >= numRows || cNew < 0 || cNew >= numCols) {
      continue;
    }
    let currentElevation = elevationAlphabet.indexOf(chars[r][c]);
    let newElevation = elevationAlphabet.indexOf(chars[rNew][cNew]);
    //console.log({ currentElevation, newElevation });
    if (newElevation - currentElevation <= 1) {
      goodNeighbors.push([rNew, cNew]);
    }
  }
  return goodNeighbors;
};

interface QItem {
  steps: number;
  r: number;
  c: number;
}

let Q: QItem[] = [];

Q.push({ steps: 0, r: startPos[0], c: startPos[1] });

while (Q.length) {
  let { steps, r, c } = Q.shift();
  if (visited[r][c]) {
    continue;
  }
  visited[r][c] = true;

  let goodNeighbors = exploreNeighbors(r, c);
  for (let neighbor of goodNeighbors) {
    if (neighbor[0] === endPos[0] && neighbor[1] === endPos[1]) {
      console.log("steps: ", steps - 1);
      break;
    }
    Q.push({ steps: steps + 1, r: neighbor[0], c: neighbor[1] });
  }
}
