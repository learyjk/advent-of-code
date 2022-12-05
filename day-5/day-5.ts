import { readFileSync } from "fs";

// Open the file and read its contents
const file = readFileSync("day-5/stacks.txt", "utf8");

// Split the data into rows
const rows = file.split("\n");

//Create an empty object for the columns
const columns = {
  "1": [],
  "2": [],
  "3": [],
  "4": [],
  "5": [],
  "6": [],
  "7": [],
  "8": [],
  "9": [],
};

// Maps column vals 1, 2, 3, 4, 5, 6, 7, 8, 9 to string positions 1, 5, 9, 13, 17, 21, 25, 29, 33
const getStringIndexForColumn = (column: number): number => {
  return column * 4 - 3;
};

// Build the columns object
for (const row of rows) {
  for (let i = 1; i < 10; i++) {
    const stringindex = getStringIndexForColumn(i);
    if (row[stringindex] !== " ") {
      columns[i].unshift(row[stringindex]);
    }
  }
}

// read in the moves
const moves = readFileSync("day-5/moves.txt", "utf8").split("\n");

for (let move of moves) {
  // convert 'move 2 from 2 to 7' to [2, 2, 7]
  // isNan with Number type cast? https://stackoverflow.com/a/63751153/12653768
  const moveArray = move
    .split(" ")
    .filter((element) => !isNaN(Number(element)))
    .map(Number);
  // Get move values
  const numMoves = moveArray[0];
  const fromColumn = moveArray[1];
  const toColumn = moveArray[2];
  // Perform the moves --- PART ONE ----
  //   for (let i = 0; i < numMoves; i++) {
  //     let item = columns[fromColumn].pop();
  //     columns[toColumn].push(item);
  //   }

  // Perform the moves --- PART TWO ----
  let stack = columns[fromColumn];
  console.log({ stack });
  let removedCrates = stack.splice(stack.length - numMoves, numMoves);
  columns[toColumn].push(...removedCrates);
}

// Get top crate from each column and store it in result string
let result = "";
for (let column in columns) {
  let stack = columns[column];
  const topCrate = stack[stack.length - 1];
  result += topCrate;
}
console.log({ result });
