"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let file = (0, fs_1.readFileSync)("day-12/input.txt", "utf8");
let rows = file.split("\n");
// PART 2 swap start and end chars
const START_CHAR = "E";
const END_CHAR = "S";
const chars = [];
const visited = [];
rows.forEach((row) => {
    chars.push(row.split(""));
    var visitRow = [];
    row.split("").map((_) => visitRow.push(false));
    visited.push(visitRow);
});
const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];
var start = [0, 0];
var end = [0, 0];
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
chars[start[0]][start[1]] = "z"; // change start E char to z
chars[end[0]][end[1]] = "a"; // change end S char to a
const Q = [[start[0], start[1], 0]];
while (Q.length > 0) {
    const curr = Q.shift();
    if (!curr)
        break;
    for (let direction of directions) {
        let currRow = curr[0];
        let currCol = curr[1];
        let nextRow = currRow + direction[0];
        let nextCol = currCol + direction[1];
        // check that it's a valid grid location
        if (nextRow < 0 ||
            nextCol < 0 ||
            nextRow >= chars.length ||
            nextCol >= chars[0].length) {
            continue;
        }
        // check that we haven't visited this location
        if (visited[nextRow][nextCol]) {
            continue;
        }
        // check that the next location is a valid elevation change
        let currElevation = elevationAlphabet.indexOf(chars[currRow][currCol]);
        let nextElevation = elevationAlphabet.indexOf(chars[nextRow][nextCol]);
        if (nextElevation - currElevation < -1) {
            // PART 2 changes to < -1 for going down in elevation
            continue;
        }
        // check if we've reached the end
        if (nextRow === end[0] && nextCol === end[1]) {
            console.log("PART 2 : ", curr[2]); // Remove + 1 for PART 2
            break;
        }
        visited[nextRow][nextCol] = true;
        Q.push([nextRow, nextCol, curr[2] + 1]);
    }
}
//# sourceMappingURL=day-12-2.js.map