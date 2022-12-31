"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let file = (0, fs_1.readFileSync)("day-13/input.txt", "utf-8");
let pairs = file.trim().split("\n\n");
// takes in list, value, or packet and return
// return 1 if a < b, 0 if a = b, -1 if a > b
const comparePackets = (a, b) => {
    // handle type mismatches
    if (Array.isArray(a) && typeof b === "number") {
        b = [b];
    }
    if (typeof a === "number" && Array.isArray(b)) {
        a = [a];
    }
    // base case
    // compare integers
    if (typeof a === "number" && typeof b === "number") {
        if (a < b) {
            return 1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return -1;
        }
    }
    // recursive case
    // compare arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        let i = 0;
        while (i < a.length && i < b.length) {
            let result = comparePackets(a[i], b[i]);
            if (result === 1) {
                return 1;
            }
            else if (result === -1) {
                return -1;
            }
            i++;
        }
        if (i === a.length) {
            if (a.length === b.length) {
                return 0;
            }
            else {
                // left side packet (a) was smaller
                return 1;
            }
        }
        if (i === b.length) {
            // right side packet (b) was smaller
            return -1;
        }
    }
};
let result = 0;
pairs.forEach((pair, index) => {
    let splitPair = pair.split("\n");
    // use eval() and map each packet from string to javascript syntax
    let [packetA, packetB] = splitPair.map(eval, splitPair);
    if (comparePackets(packetA, packetB) === 1) {
        // packet pairs are 1-indexed
        result += index + 1;
    }
});
console.log({ result });
// PART TWO
// array to put packets into which we will sort later.
let arr = [];
pairs.forEach((pair, index) => {
    let splitPair = pair.split("\n");
    // use eval() and map each packet from string to javascript syntax
    let [packetA, packetB] = splitPair.map(eval, splitPair);
    // rather than compare packets, push them into arr this time.
    arr.push(packetA);
    arr.push(packetB);
});
// also push the indexing elements asked for in the problem statement.
arr.push([[2]]);
arr.push([[6]]);
// sort using our compare function
arr.sort(comparePackets);
// reverse it... because.
arr.reverse();
let indexOf2, indexOf6;
// get 1-indexed values for [[2]] and [[6]]
arr.forEach((packet, index) => {
    if (packet.toString() === "2") {
        indexOf2 = index + 1;
    }
    if (packet.toString() === "6") {
        indexOf6 = index + 1;
    }
});
console.log({ indexOf2 });
console.log({ indexOf6 });
console.log(indexOf2 * indexOf6);
//# sourceMappingURL=day-13.js.map