"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let file = (0, fs_1.readFileSync)("day-14/input.txt", "utf8");
let lines = file.split("\n");
// used to create board where 0 col equals 500 - minX
let minX = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
// parse input
// separate into coords by -> character
// transform '494,6' to {x: 494, y: 6}
const processInput = (lines) => {
    let allLinesAsCoords = [];
    let arrowsRemoved = lines.map((line) => {
        return line.split(" -> ");
    });
    arrowsRemoved.forEach((line) => {
        let lineCoords = [];
        line.forEach((coord) => {
            let splitCoord = coord.split(",");
            let x = parseInt(splitCoord[0], 10);
            let y = parseInt(splitCoord[1], 10);
            minX = Math.min(x, minX);
            maxX = Math.max(x, maxX);
            maxY = Math.max(y, maxY);
            lineCoords.push({ x, y });
        });
        allLinesAsCoords.push(lineCoords);
    });
    return allLinesAsCoords;
};
let parsedInput = processInput(lines);
console.log({ minX, maxX, maxY });
// create 2D array of '.' and '+' at start
const createEmptyBoard = (minX, maxX, maxY) => {
    let board = [];
    let numRows = maxY + 1;
    let numCols = maxX - minX + 1;
    let startCol = 500 - minX;
    for (let r = 0; r < numRows; r++) {
        board.push([]);
        for (let c = 0; c < numCols; c++) {
            board[r].push(".");
        }
    }
    board[0][startCol] = "+";
    return board;
};
const printBoard = (board) => {
    board.forEach((row, index) => {
        let numberAsString = index.toString();
        while (numberAsString.length < 3) {
            numberAsString += " ";
        }
        console.log(`${numberAsString} ${row.join("")}`);
    });
};
let board = createEmptyBoard(minX, maxX, maxY);
const addRocks = (board, parsedInput) => {
    for (let i = 0; i < parsedInput.length; i++) {
        for (let j = 1; j < parsedInput[i].length; j++) {
            let pos1 = parsedInput[i][j - 1];
            let pos2 = parsedInput[i][j];
            if (pos1.x === pos2.x) {
                // Vertical Line
                let x = pos1.x - minX;
                let startY = Math.min(pos1.y, pos2.y);
                let endY = Math.max(pos1.y, pos2.y);
                for (let y = startY; y <= endY; y++) {
                    board[y][x] = "#";
                }
            }
            else if (pos1.y === pos2.y) {
                // Horizontal Line
                let y = pos1.y;
                let startX = Math.min(pos1.x - minX, pos2.x - minX);
                let endX = Math.max(pos1.x - minX, pos2.x - minX);
                for (let x = startX; x <= endX; x++) {
                    board[y][x] = "#";
                }
            }
        }
    }
};
addRocks(board, parsedInput);
printBoard(board);
const getNextMove = (pos) => {
    let nextRow = pos.row + 1;
    if (nextRow === board.length) {
        return null;
    }
    if (board[nextRow][pos.col] === ".") {
        // air below -> next pos is down
        return { row: nextRow, col: pos.col };
    }
    else {
        if (pos.col - 1 < 0 || pos.col + 1 >= board[0].length) {
            return null;
        }
        if (board[nextRow][pos.col - 1] === ".") {
            // air to diagonal left -> next pos is there
            return { row: nextRow, col: pos.col - 1 };
        }
        else if (board[nextRow][pos.col + 1] === ".") {
            // air to diagonal right -> next pos is there
            return { row: nextRow, col: pos.col + 1 };
        }
        else {
            // sand comes to rest, update board and reset to starting pos
            board[pos.row][pos.col] = "o";
            return { row: 0, col: 500 - minX };
        }
    }
};
const partOne = (board) => {
    let unitsOfSand = 0;
    let pos = { row: 0, col: 500 - minX };
    while (true) {
        pos = getNextMove(pos);
        if (!pos) {
            // sand fell off bottom of board
            return unitsOfSand;
        }
        if (pos.row === 0 && pos.col === 500 - minX) {
            // new unit of sand
            unitsOfSand++;
        }
    }
};
// let units = partOne(board);
// printBoard(board);
// console.log({ units });
let lengthToAdd = board.length;
const modifyBaordPartTwo = (board) => {
    for (let row of board) {
        let airToAdd = [];
        for (let i = 0; i < lengthToAdd; i++) {
            airToAdd.push(".");
        }
        row.splice(0, 0, ...airToAdd);
        row.push(...airToAdd);
    }
    let boardLength = board[0].length;
    let airRow = [];
    for (let i = 0; i < boardLength; i++) {
        airRow.push(".");
    }
    board.push(airRow);
    let groundRow = [];
    for (let i = 0; i < boardLength; i++) {
        groundRow.push("#");
    }
    board.push(groundRow);
};
modifyBaordPartTwo(board);
printBoard(board);
let numRows = board.length;
let numCols = board[0].length;
const getNextMoveTwo = (pos) => {
    let nextRow = pos.row + 1;
    if (nextRow === board.length) {
        return null;
    }
    if (board[nextRow][pos.col] === ".") {
        // air below -> next pos is down
        return { row: nextRow, col: pos.col };
    }
    else {
        if (pos.col - 1 < 0 || pos.col + 1 >= board[0].length) {
            console.log("here");
            return null;
        }
        if (board[nextRow][pos.col - 1] === ".") {
            // air to diagonal left -> next pos is there
            return { row: nextRow, col: pos.col - 1 };
        }
        else if (board[nextRow][pos.col + 1] === ".") {
            // air to diagonal right -> next pos is there
            return { row: nextRow, col: pos.col + 1 };
        }
        else {
            // sand comes to rest, update board and reset to starting pos
            board[pos.row][pos.col] = "o";
            return { row: 0, col: 500 - minX + lengthToAdd };
        }
    }
};
const partTwo = (board) => {
    let unitsOfSand = 0;
    let pos = { row: 0, col: 500 - minX + lengthToAdd };
    while (true) {
        pos = getNextMoveTwo(pos);
        if (!pos) {
            // sand fell off bottom of board
            return unitsOfSand;
        }
        if (pos.row === 0 && pos.col === 500 - minX + lengthToAdd) {
            // new unit of sand
            unitsOfSand++;
            if (board[pos.row][pos.col] === "o") {
                return unitsOfSand;
            }
        }
    }
};
let units = partTwo(board);
printBoard(board);
console.log({ units });
//# sourceMappingURL=day-14.js.map