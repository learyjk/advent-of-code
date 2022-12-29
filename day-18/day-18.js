"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
/*
coord is [x, y, z]
check all three pairs
    check map for y = y* and z=z*
        if match, get x* of matching pair
            if Math.abs(x* - x) !== 1
                skip
            if x is in cache and x* is in cache already
                skip
            else
                increment pairCount
                add x and x* to cache
*/
let file = (0, fs_1.readFileSync)("day-18/input.txt", "utf-8");
let rows = file.split("\n");
let input = [];
for (let row of rows) {
    let splitOnComma = row.split(",");
    let nums = [];
    for (let i = 0; i < splitOnComma.length; i++) {
        nums.push(parseInt(splitOnComma[i]));
    }
    input.push(nums);
}
let cache = new Map();
let numPairs = 0;
for (let i = 0; i < input.length; i++) {
    let numArray = input[i];
    for (let d = 0; d < numArray.length; d++) {
        let x1 = numArray[0];
        let y1 = numArray[1];
        let z1 = numArray[2];
        if (d === 0) {
            // x
            for (let k = 0; k < input.length; k++) {
                if (k === i) {
                    // same coordinate
                    continue;
                }
                let numArray2 = input[k];
                let y2 = numArray2[1];
                let z2 = numArray2[2];
                if (y1 === y2 && z1 === z2) {
                    // match found, compare x values
                    let x2 = numArray2[0];
                    if (Math.abs(x2 - x1) !== 1) {
                        // sides are not shared
                        continue;
                    }
                    let cacheKey = `[x,${y1},${z1}]`;
                    if (cache.get(cacheKey)) {
                        if (cache.get(cacheKey).has(x1) && cache.get(cacheKey).has(x2)) {
                            continue;
                        }
                        else {
                            cache.get(cacheKey).add(x1);
                            cache.get(cacheKey).add(x2);
                        }
                    }
                    else {
                        cache.set(cacheKey, new Set());
                        cache.get(cacheKey).add(x1);
                        cache.get(cacheKey).add(x2);
                    }
                    numPairs++;
                }
            }
        }
        if (d === 1) {
            // y
            for (let k = 0; k < input.length; k++) {
                if (k === i) {
                    // same coordinate
                    continue;
                }
                let numArray2 = input[k];
                let x2 = numArray2[0];
                let z2 = numArray2[2];
                if (x1 === x2 && z1 === z2) {
                    // match found, compare y values
                    let y2 = numArray2[1];
                    if (Math.abs(y2 - y1) !== 1) {
                        // sides are not shared
                        continue;
                    }
                    let cacheKey = `[${x1},y,${z1}]`;
                    if (cache.get(cacheKey)) {
                        if (cache.get(cacheKey).has(y1) && cache.get(cacheKey).has(y2)) {
                            continue;
                        }
                        else {
                            cache.get(cacheKey).add(y1);
                            cache.get(cacheKey).add(y2);
                        }
                    }
                    else {
                        cache.set(cacheKey, new Set());
                        cache.get(cacheKey).add(y1);
                        cache.get(cacheKey).add(y2);
                    }
                    numPairs++;
                }
            }
        }
        if (d === 2) {
            // z
            for (let k = 0; k < input.length; k++) {
                if (k === i) {
                    // same coordinate
                    continue;
                }
                let numArray2 = input[k];
                let x2 = numArray2[0];
                let y2 = numArray2[1];
                if (x1 === x2 && y1 === y2) {
                    // match found, compare y values
                    let z2 = numArray2[2];
                    if (Math.abs(z2 - z1) !== 1) {
                        // sides are not shared
                        continue;
                    }
                    let cacheKey = `[${x1},${y1},z]`;
                    if (cache.get(cacheKey)) {
                        if (cache.get(cacheKey).has(z1) && cache.get(cacheKey).has(z2)) {
                            continue;
                        }
                        else {
                            cache.get(cacheKey).add(z1);
                            cache.get(cacheKey).add(z2);
                        }
                    }
                    else {
                        cache.set(cacheKey, new Set());
                        cache.get(cacheKey).add(z1);
                        cache.get(cacheKey).add(z2);
                    }
                    numPairs++;
                }
            }
        }
    }
}
console.log({ cache });
console.log({ numPairs });
//# sourceMappingURL=day-18.js.map