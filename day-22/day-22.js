"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let dirsFile = (0, fs_1.readFileSync)(__dirname + "/inputDir.txt", "utf-8");
let mazeFile = (0, fs_1.readFileSync)(__dirname + "/inputMaze.txt", "utf-8");
let rows = mazeFile.split("\n");
let maxX = 0;
let startPos;
let facing = "R";
let grid = [];
for (let row of rows) {
    maxX = Math.max(maxX, row.length);
}
// populate grid and get start Pos (first .)
for (let row of rows) {
    let newRow = new Array(maxX).fill("0");
    for (let i = 0; i < row.length; i++) {
        if (row[i] === ".") {
            newRow[i] = ".";
            if (!startPos) {
                startPos = [0, i];
            }
        }
        if (row[i] === "#") {
            newRow[i] = "#";
        }
    }
    grid.push(newRow);
}
// print grid nicely in console.
const printGrid = () => {
    grid.forEach((row) => {
        console.log(row.join(""));
    });
};
printGrid();
console.log({ startPos });
// helped fn to update facing dir based instruction input.
const updateFacing = (turnDir) => {
    if (facing === "R") {
        facing = turnDir === "R" ? "D" : "U";
    }
    else if (facing === "D") {
        facing = turnDir === "R" ? "L" : "R";
    }
    else if (facing === "L") {
        facing = turnDir === "R" ? "U" : "D";
    }
    else {
        facing = turnDir === "R" ? "R" : "L";
    }
};
const getNextInstruction = () => {
    if (dirsFile.length === 0)
        return { numMoves: null };
    let indexOfL = dirsFile.indexOf("L");
    let indexOfR = dirsFile.indexOf("R");
    if (indexOfL === -1)
        indexOfL = Infinity;
    if (indexOfR === -1)
        indexOfR = Infinity;
    let i = Math.min(indexOfL, indexOfR);
    let numMoves = parseInt(dirsFile.substring(0, i), 10);
    let turnDir = dirsFile.substring(i, i + 1);
    dirsFile = dirsFile.substring(i + 1);
    return { numMoves, turnDir };
};
// return length of row by counting '.' and '#' characters
const getValidRowLength = (rowIndex) => {
    let count = 0;
    let row = grid[rowIndex];
    for (let char of row) {
        if (char === "." || char === "#") {
            count++;
        }
    }
    return count;
};
// return valid length of a column by counting '.' and '#' characters
const getValidColumnLength = (colIndex) => {
    let count = 0;
    for (let row of grid) {
        let char = row[colIndex];
        if (char === "." || char === "#") {
            count++;
        }
    }
    return count;
};
// wrap when -> next pos is OOB or next pos is '0'
const getNextPosRight = (pos) => {
    let r = pos[0];
    let c = pos[1];
    // wrap condition
    if (c + 1 === grid[r].length || grid[r][c + 1] === "0") {
        let rowLength = getValidRowLength(r);
        let wrapCol = c + 1 - rowLength; // wrapCol refers to first column in that row.
        // make sure first column in that row is not a rock.
        if (grid[r][wrapCol] !== "#") {
            c = wrapCol;
        }
        return [r, c];
    }
    // blocked by rock
    if (grid[r][c + 1] === "#") {
        return [r, c];
    }
    // free to move right normally
    return [r, c + 1];
};
const getNextPosLeft = (pos) => {
    let r = pos[0];
    let c = pos[1];
    // wrap condition
    if (c - 1 === -1 || grid[r][c - 1] === "0") {
        let rowLength = getValidRowLength(r);
        let wrapCol = c - 1 + rowLength; // wrapCol refers to first column in that row.
        // make sure first column in that row is not a rock.
        if (grid[r][wrapCol] !== "#") {
            c = wrapCol;
        }
        return [r, c];
    }
    // blocked by rock
    if (grid[r][c - 1] === "#") {
        return [r, c];
    }
    // free to move left normally
    return [r, c - 1];
};
const getNextPosDown = (pos) => {
    let r = pos[0];
    let c = pos[1];
    // wrap condition
    if (r + 1 === grid.length || grid[r + 1][c] === "0") {
        let colLength = getValidColumnLength(c);
        let wrapRow = r + 1 - colLength; // wrapRow refers to first available row for that col.
        // make sure not a rock
        if (grid[wrapRow][c] !== "#") {
            r = wrapRow;
        }
        return [r, c];
    }
    // blocked by rock
    if (grid[r + 1][c] === "#") {
        return [r, c];
    }
    // free to move down normally
    return [r + 1, c];
};
const getNextPosUp = (pos) => {
    let r = pos[0];
    let c = pos[1];
    // wrap condition
    if (r - 1 === -1 || grid[r - 1][c] === "0") {
        let colLength = getValidColumnLength(c);
        let wrapRow = r - 1 + colLength; // wrapRow refers to last available row for that col.
        // make sure not a rock
        if (grid[wrapRow][c] !== "#") {
            r = wrapRow;
        }
        return [r, c];
    }
    // blocked by rock
    if (grid[r - 1][c] === "#") {
        return [r, c];
    }
    // free to move up normally
    return [r - 1, c];
};
let pos = startPos;
let i = 5;
while (true) {
    let { numMoves, turnDir } = getNextInstruction();
    console.log({ numMoves, facing, turnDir });
    if (numMoves === null)
        break;
    if (facing === "R") {
        while (numMoves > 0) {
            pos = getNextPosRight(pos);
            console.log({ pos });
            numMoves--;
        }
    }
    else if (facing === "L") {
        while (numMoves > 0) {
            pos = getNextPosLeft(pos);
            console.log({ pos });
            numMoves--;
        }
    }
    else if (facing === "D") {
        while (numMoves > 0) {
            pos = getNextPosDown(pos);
            console.log({ pos });
            numMoves--;
        }
    }
    else if (facing === "U") {
        while (numMoves > 0) {
            pos = getNextPosUp(pos);
            console.log({ pos });
            numMoves--;
        }
    }
    if (turnDir !== "") {
        updateFacing(turnDir);
    }
}
const getFacingValue = (facing) => {
    if (facing === "R")
        return 0;
    if (facing === "D")
        return 1;
    if (facing === "L")
        return 2;
    if (facing === "U")
        return 3;
};
console.log({ pos });
console.log({ facing });
let rResult = pos[0] + 1;
let cResult = pos[1] + 1;
let fResult = getFacingValue(facing);
console.log(1000 * rResult + 4 * cResult + fResult);
//# sourceMappingURL=day-22.js.map