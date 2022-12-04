"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
// if start < start of other elf and end < end of other elf
(0, fs_1.readFile)("day-4/input.txt", "utf8", (err, data) => {
    if (err)
        throw err;
    // turn input.txt into array of strings (each string is a line)
    const lines = data.split("\n");
    // track number of full overlaps
    let fullOverlapTracker = 0;
    let partialOverlapTracker = 0;
    for (const line of lines) {
        // define indexes we can use to get start and end assignments
        const firstDash = line.indexOf("-");
        const secondDash = line.indexOf("-", firstDash + 1);
        const comma = line.indexOf(",");
        // get start and end assignments by parsing the string
        const start1 = line.substring(0, firstDash);
        const end1 = line.substring(firstDash + 1, comma);
        const start2 = line.substring(comma + 1, secondDash);
        const end2 = line.substring(secondDash + 1);
        // check for full overlap (parse the strings as ints with radix 10)
        let hasFullOverlap = checkFullOverlap(parseInt(start1, 10), parseInt(end1, 10), parseInt(start2, 10), parseInt(end2, 10));
        // if there is a full overlap, increment overlapTracker
        if (hasFullOverlap) {
            fullOverlapTracker += 1;
        }
        let hasPartialOverlap = checkPartialOverlap(parseInt(start1, 10), parseInt(end1, 10), parseInt(start2, 10), parseInt(end2, 10));
        if (hasPartialOverlap) {
            partialOverlapTracker += 1;
        }
    }
    console.log({ fullOverlapTracker });
    console.log({ partialOverlapTracker });
});
const checkFullOverlap = (s1, e1, s2, e2) => {
    // check if first elf's assignment is overlapped by second elf's assignment
    if (s1 >= s2 && e1 <= e2) {
        return true;
    }
    // check if second elf's assignment is overlapped by first elf's assignment
    if (s2 >= s1 && e2 <= e1) {
        return true;
    }
    // no overlap
    return false;
};
const checkPartialOverlap = (s1, e1, s2, e2) => {
    if (e1 >= s2 && s1 <= s2)
        return true;
    if (e2 >= s1 && s2 <= s1)
        return true;
    return false;
};
//# sourceMappingURL=day-4.js.map