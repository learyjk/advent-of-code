"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let file = (0, fs_1.readFileSync)("day-12/input.txt", "utf8");
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
console.log(charsCopy);
// alphabet for checking elevations
let elevationAlphabet = "abcdefghijklmnopqrstuvwxyzE";
// explores UP, RIGHT, DOWN, LEFT
let exploreNeighbours = (r, c) => {
    console.log(`exploring from ${r}, ${c} with char ${chars[r][c]}`);
    // check up
    let rUp = r - 1;
    let cUp = c;
    // check if in bounds and not visited
    if (rUp >= 0 && !visited[rUp][cUp]) {
        let charUp = chars[rUp][cUp];
        let elevationDiff = elevationAlphabet.indexOf(charUp) -
            elevationAlphabet.indexOf(chars[r][c]);
        // check if elevation difference is 0 or 1
        if (elevationDiff < 2) {
            console.log("add UP to queue");
            Q.push([rUp, cUp]);
            visited[rUp][cUp] = true;
            charsCopy[rUp][cUp] = "#";
            nodesInNextLayer++;
        }
    }
    // check right
    let rRight = r;
    let cRight = c + 1;
    if (cRight < numCols && !visited[rRight][cRight]) {
        let charRight = chars[rRight][cRight];
        let elevationDiff = elevationAlphabet.indexOf(charRight) -
            elevationAlphabet.indexOf(chars[r][c]);
        if (elevationDiff < 2) {
            console.log("add RIGHT to queue");
            Q.push([rRight, cRight]);
            visited[rRight][cRight] = true;
            charsCopy[rRight][cRight] = "#";
            nodesInNextLayer++;
        }
    }
    // check down
    let rDown = r + 1;
    let cDown = c;
    if (rDown < numRows && !visited[rDown][cDown]) {
        let charDown = chars[rDown][cDown];
        let elevationDiff = elevationAlphabet.indexOf(charDown) -
            elevationAlphabet.indexOf(chars[r][c]);
        if (elevationDiff < 2) {
            console.log("add DOWN to queue");
            Q.push([rDown, cDown]);
            visited[rDown][cDown] = true;
            charsCopy[rDown][cDown] = "#";
            nodesInNextLayer++;
        }
    }
    // check left
    let rLeft = r;
    let cLeft = c - 1;
    if (cLeft >= 0 && !visited[rLeft][cLeft]) {
        let charLeft = chars[rLeft][cLeft];
        let elevationDiff = elevationAlphabet.indexOf(charLeft) -
            elevationAlphabet.indexOf(chars[r][c]);
        if (elevationDiff < 2) {
            console.log("add LEFT to queue");
            Q.push([rLeft, cLeft]);
            visited[rLeft][cLeft] = true;
            charsCopy[rLeft][cLeft] = "#";
            nodesInNextLayer++;
        }
    }
};
let moveCount = 0;
let nodesLeftInLayer = 1;
let nodesInNextLayer = 0;
let Q = [];
let reachedEnd = false;
let solve = () => {
    Q.push([startPos[0], startPos[1]]);
    visited[startPos[0]][startPos[1]] = true;
    while (Q.length > 0) {
        let pos = Q.shift();
        let r = pos[0];
        let c = pos[1];
        if (chars[r][c] === END_CHAR) {
            reachedEnd = true;
            break;
        }
        exploreNeighbours(r, c);
        nodesLeftInLayer--;
        if (nodesLeftInLayer === 0) {
            moveCount++;
            nodesLeftInLayer = nodesInNextLayer;
            nodesInNextLayer = 0;
            console.log({ moveCount });
        }
    }
    if (reachedEnd) {
        return moveCount - 1;
    }
    return -1;
};
console.log(solve());
//# sourceMappingURL=day-12.js.map