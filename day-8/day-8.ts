import { readFileSync } from "fs";

// Open the file and read its contents
const file = readFileSync("day-8/input.txt", "utf8");

const forest = [];
// Split the data into rows
const lines = file.split("\n");
// Loop over the lines
for (const line of lines) {
  // Split each line into an array of numbers
  const numbers = line.split("").map((n) => parseInt(n, 10));
  // Add the array of numbers to the two-dimensional array
  forest.push(numbers);
}

const numRows = forest.length;
const numCols = forest[0].length;

// initialize sum with all border trees, which are always visible.
let sum = (numRows - 1) * 2 + (numCols - 1) * 2;

// checkTree function returns true if a tree is visible from any direction.
// input: row, col of tree
// output: true/false
const checkTree = (row: number, col: number) => {
  const treeHeight = forest[row][col];
  const left = checkLeft(row, col, treeHeight);
  // if left is true then tree is visible from left, we can stop checking
  if (left) return true;
  const right = checkRight(row, col, treeHeight);
  // if right is true then tree is visible from right, we can stop checking
  if (right) return true;
  const up = checkUp(row, col, treeHeight);
  // if up is true then tree is visible from top, we can stop checking
  if (up) return true;
  const down = checkDown(row, col, treeHeight);
  // if down is true then tree is visible from bottom, we can stop checking
  if (down) return true;

  // if we checked every direction and didn't find visibility in any direction, return false
  return false;
};

const checkLeft = (row: number, col: number, treeHeight: number) => {
  // check cell 1 to left of current cell
  col--;
  while (col >= 0) {
    // if the cell is taller than the tree, then the tree is not visible from the left
    if (forest[row][col] >= treeHeight) {
      return false;
    }
    // check next cell to the left
    col--;
  }
  // if we checked every cell to the left and didn't find a taller cell, then the tree is visible from the left
  return true;
};

const checkRight = (row: number, col: number, treeHeight: number) => {
  col++;
  while (col <= numCols - 1) {
    if (forest[row][col] >= treeHeight) {
      return false;
    }
    col++;
  }
  return true;
};

const checkDown = (row: number, col: number, treeHeight: number) => {
  row++;
  while (row <= numRows - 1) {
    if (forest[row][col] >= treeHeight) {
      return false;
    }
    row++;
  }
  return true;
};

const checkUp = (row: number, col: number, treeHeight: number) => {
  row--;
  while (row >= 0) {
    if (forest[row][col] >= treeHeight) {
      return false;
    }
    row--;
  }
  return true;
};

// loop through entire forst (except border) and check each tree's visibility.
for (let row = 1; row < numRows - 1; row++) {
  for (let col = 1; col < numCols - 1; col++) {
    // if visibile, increment sum.
    if (checkTree(row, col)) sum++;
  }
}

console.log({ sum });

// PART TWO

// initialize max scenic score tracker with value 0.
let maxScenicScore = 0;

// look out from each tree.
// stop if you reach an edge or at the first tree that is
// the same height or taller than the tree under consideration

const checkTreeScore = (row: number, col: number): number => {
  const treeHeight = forest[row][col];

  // check each direction and get scenic score looking out from that direction.
  const left = checkLeftScore(row, col, treeHeight);
  const right = checkRightScore(row, col, treeHeight);
  const up = checkUpScore(row, col, treeHeight);
  const down = checkDownScore(row, col, treeHeight);

  return left * right * up * down;
};

const checkLeftScore = (
  row: number,
  col: number,
  treeHeight: number
): number => {
  // check cell to left of current cell
  let score = 0;
  col--;
  while (col >= 0) {
    score++;
    // if the cell is taller than the tree, then the tree is not visible from the left
    if (forest[row][col] >= treeHeight) {
      return score;
    }
    // check next cell to the left
    col--;
  }
  // if we checked every cell to the left and didn't find a taller cell, then the tree is visible from the left
  return score;
};

const checkRightScore = (
  row: number,
  col: number,
  treeHeight: number
): number => {
  let score = 0;
  col++;
  while (col <= numCols - 1) {
    score++;
    if (forest[row][col] >= treeHeight) {
      return score;
    }
    col++;
  }
  return score;
};

const checkDownScore = (
  row: number,
  col: number,
  treeHeight: number
): number => {
  let score = 0;
  row++;
  while (row <= numRows - 1) {
    score++;
    if (forest[row][col] >= treeHeight) {
      return score;
    }
    row++;
  }
  return score;
};

const checkUpScore = (row: number, col: number, treeHeight: number): number => {
  let score = 0;
  row--;
  while (row >= 0) {
    score++;
    if (forest[row][col] >= treeHeight) {
      return score;
    }
    row--;
  }
  return score;
};

// check scenic score for each tree in the forest.
for (let row = 1; row < numRows - 1; row++) {
  for (let col = 1; col < numCols - 1; col++) {
    let scenicScore = checkTreeScore(row, col);
    maxScenicScore = Math.max(scenicScore, maxScenicScore);
  }
}

console.log({ maxScenicScore });
