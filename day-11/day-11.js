"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let file = (0, fs_1.readFileSync)("day-11/input.txt", "utf8");
let rows = file.split("\n");
let monkeys = [];
const NUM_MONKEYS = 8;
const NUM_LINES_PER_MONKEY = 7;
// parse file
for (let i = 0; i < NUM_MONKEYS; i++) {
    let id;
    let startingItems;
    let operation;
    let operand;
    let testDivisible;
    let toMonkeyIfTestTrue;
    let toMonkeyIfTestFalse;
    for (let j = 0; j < NUM_LINES_PER_MONKEY; j++) {
        let line = rows[i * NUM_LINES_PER_MONKEY + j];
        if (j === 0) {
            id = parseInt(line[7], 10);
        }
        else if (j === 1) {
            let numbersStr = line.substring(line.indexOf(": ") + 2);
            startingItems = numbersStr
                .split(", ")
                .map((numberStr) => parseInt(numberStr, 10));
        }
        else if (j === 2) {
            let indexOfOperation = line.indexOf("*") !== -1 ? line.indexOf("*") : line.indexOf("+");
            operation = line[indexOfOperation];
            operand = parseInt(line.substring(25), 10);
            if (isNaN(operand)) {
                operand = -1;
            }
        }
        else if (j === 3) {
            testDivisible = parseInt(line.substring(21), 10);
        }
        else if (j === 4) {
            toMonkeyIfTestTrue = parseInt(line.substring(29), 10);
        }
        else if (j === 5) {
            toMonkeyIfTestFalse = parseInt(line.substring(30), 10);
        }
    }
    monkeys[i] = {
        id,
        startingItems,
        operation,
        operand,
        testDivisible,
        toMonkeyIfTestTrue,
        toMonkeyIfTestFalse,
    };
}
console.log({ monkeys });
/*

*/
monkeys.forEach((monkey) => {
    console.log(monkey.startingItems);
});
// tracker for number of inspections
let monkeyMap = new Map();
/*
PART TWO MODULUS MATH
Want to divide by some number such that test condition will still be satisfied.
Without reducing worry levels, we will exceed Javascript Max Safe Integer
Number.MAX_SAFE_INTEGER
9007199254740991

modulo by the product of all test numbers
research: congruence modulus.

Example: monkey 1 and 3, test is divisible by 3 and 11.
3 * 11 = 33

use %33 to determine if a number is divisible by 3.
15 % 33 = 15, 150 % 33 = 18, 300 % 33 = 3 -> all divisible by 3!
200 % 33 = 66.667 -> not divisible by 3!

use %33 to determine if a number is divisible by 11.
44 % 33 = 11, 121 % 33 = 22 -> both disivible by 11.
111 % 33 = 12 -> not divisible by 11. but is by 3 ;)

Therefore -> use the product of all test divisors to modulo the worry level!
*/
let mod = 1; // part 2
monkeys.forEach((monkey) => {
    monkeyMap.set(monkey.id, 0);
    mod *= monkey.testDivisible; // part 2
});
console.log({ mod }); // part 2
for (let round = 0; round < 10000; round++) {
    for (let monkey of monkeys) {
        // get items and loop through them
        let items = monkey.startingItems;
        for (let itemUnderInspection of items) {
            // increment number of inspections for this monkey by 1.
            monkeyMap.set(monkey.id, monkeyMap.get(monkey.id) + 1);
            if (monkey.operation === "*") {
                if (monkey.operand !== -1) {
                    // multiply worry level by amount
                    itemUnderInspection *= monkey.operand;
                }
                else {
                    // multiply worry level by self (itemUnderInspection). i.e. old * old
                    itemUnderInspection *= itemUnderInspection;
                }
            }
            else if (monkey.operation === "+") {
                if (monkey.operand !== -1) {
                    itemUnderInspection += monkey.operand;
                }
                else {
                    itemUnderInspection += itemUnderInspection;
                }
            }
            // divide by three
            //itemUnderInspection = Math.floor(itemUnderInspection / 3);
            // part two mod
            itemUnderInspection %= mod;
            // decide which monkey to throw
            if (itemUnderInspection % monkey.testDivisible === 0) {
                monkeys[monkey.toMonkeyIfTestTrue].startingItems.push(itemUnderInspection);
            }
            else {
                monkeys[monkey.toMonkeyIfTestFalse].startingItems.push(itemUnderInspection);
            }
        }
        // monkey has thrown all items - set their startingItems to empty array.
        monkey.startingItems = [];
    }
}
monkeys.forEach((monkey) => {
    console.log(monkey.startingItems);
});
console.log([...monkeyMap].sort((a, b) => b[1] - a[1]));
//# sourceMappingURL=day-11.js.map