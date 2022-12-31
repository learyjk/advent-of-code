"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import readFile
const fs_1 = require("fs");
// read the input file
const file = (0, fs_1.readFileSync)("day-10/input.txt", "utf8");
// split the file into rows
const rows = file.split("\n");
let X = 1;
let cycle = 1;
let rowNum = 0;
let isExecuting = false;
let CRT = [];
while (rowNum < rows.length) {
    // first is instruction, second is value.
    let [first, second] = rows[rowNum].split(" ");
    if (isExecuting) {
        X += parseInt(second, 10);
        isExecuting = false;
        rowNum++;
    }
    else {
        if (first === "noop") {
            rowNum++;
        }
        if (first === "addx") {
            isExecuting = true;
        }
    }
    // PART TWO
    // define pixel positions of register.
    let registerRange = [X - 1, X, X + 1];
    // console.log({ registerRange });
    // console.log({ cycle });
    // use cycle % 40 because register assume one line.
    if (registerRange.includes(cycle % 40)) {
        CRT.push("#");
    }
    else {
        CRT.push(".");
    }
    cycle++;
}
// render CRT screen as a string
let strCRT = "";
const writeScreen = () => {
    for (let i = 0; i < cycle; i++) {
        if (i % 40 === 0) {
            strCRT += `\n${CRT[i]}`;
        }
        else {
            strCRT += `${CRT[i]}`;
        }
    }
};
writeScreen();
console.log(strCRT);
//# sourceMappingURL=day-10-2.js.map