"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lodash_1 = require("lodash");
let file = (0, fs_1.readFileSync)("day-13/input.txt", "utf8");
let rows = file.split("\n");
const comparePackets = (left, right) => {
    // zip both arrays together and iterate over values
    let zipped = lodash_1._.zip(left, right);
    for (let [leftVal, rightVal] of zipped) {
        // both are numbers -> make comparison
        console.log({ leftVal, rightVal });
        if (rightVal === undefined) {
            return false;
        }
        else if (leftVal === undefined) {
            return true;
        }
        if (typeof leftVal === "number" && typeof rightVal === "number") {
            if (leftVal > rightVal) {
                console.log("Right side is smaller, so inputs are not in the right order");
                return false;
            }
            else if (leftVal < rightVal) {
                console.log("Left side is smaller, so inputs are in the right order");
                return true;
            }
            else {
                continue;
            }
        }
        // either left or right is not a number
        else {
            // convert number to array
            if (typeof leftVal === "number") {
                leftVal = [leftVal];
            }
            else if (typeof rightVal === "number") {
                rightVal = [rightVal];
            }
            return comparePackets(leftVal, rightVal);
        }
    }
    if (left.length > right.length) {
        console.log(`Right side ran out of items, so inputs are not in the right order`);
        return false;
    }
    else if (left.length < right.length) {
        console.log(`Left side ran out of items, so inputs are in the right order`);
        return true;
    }
    else {
        return false;
    }
};
let results = [];
for (let i = 0; i < rows.length; i++) {
    // NOTE add newline to bottom of input.txt
    if (rows[i] === "") {
        const left = JSON.parse(rows[i - 2]);
        const right = JSON.parse(rows[i - 1]);
        const pairIndex = (i + 1) / 3;
        // console.log(left);
        // console.log(right);
        let isInOrder = comparePackets(left, right);
        console.log({ isInOrder });
        if (isInOrder) {
            results.push(pairIndex);
        }
    }
}
console.log({ results });
let sumOfIndices = results.reduce((a, b) => a + b, 0);
console.log({ sumOfIndices });
//# sourceMappingURL=day-13.js.map