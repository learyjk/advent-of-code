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
monkeys.forEach((monkey) => {
    console.log(monkey.startingItems);
});
// tracker for number of inspections
let monkeyMap = new Map();
let mod = 1;
monkeys.forEach((monkey) => {
    monkeyMap.set(monkey.id, 0);
    mod *= monkey.testDivisible;
});
console.log({ mod });
for (let round = 0; round < 10000; round++) {
    for (let monkey of monkeys) {
        let items = monkey.startingItems;
        for (let itemUnderInspection of items) {
            //let itemUnderInspection = items.shift();
            monkeyMap.set(monkey.id, monkeyMap.get(monkey.id) + 1);
            if (monkey.operation === "*") {
                if (monkey.operand !== -1) {
                    itemUnderInspection *= monkey.operand;
                }
                else {
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
            // itemUnderInspection = Math.floor(itemUnderInspection / 3);
            //part two mod
            itemUnderInspection %= mod;
            // decide which monkey to throw to
            if (itemUnderInspection % monkey.testDivisible === 0) {
                monkeys[monkey.toMonkeyIfTestTrue].startingItems.push(itemUnderInspection);
            }
            else {
                monkeys[monkey.toMonkeyIfTestFalse].startingItems.push(itemUnderInspection);
            }
        }
        monkey.startingItems = [];
    }
}
monkeys.forEach((monkey) => {
    console.log(monkey.startingItems);
});
console.log([...monkeyMap].sort((a, b) => b[1] - a[1]));
//# sourceMappingURL=day-11.js.map