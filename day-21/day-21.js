"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let file = (0, fs_1.readFileSync)("day-21/input.txt", "utf-8");
let rows = file.split("\n");
let monkeys = new Map();
for (let row of rows) {
    let name = row.substring(0, row.indexOf(":"));
    let second = row.substring(row.indexOf(": ") + 2);
    let value = parseInt(second, 10);
    if (!isNaN(value)) {
        let monkey = {
            name,
            value,
            leftChild: null,
            rightChild: null,
        };
        monkeys.set(monkey.name, monkey);
    }
    else {
        let leftChild = second.substring(0, second.indexOf(" "));
        second = second.substring(second.indexOf(" ") + 1);
        let operation = second[0];
        let rightChild = second.substring(second.indexOf(" ") + 1);
        let monkey = {
            name,
            operation,
            leftChild,
            rightChild,
        };
        monkeys.set(monkey.name, monkey);
    }
}
console.log({ monkeys });
const computeValue = (monkeyName) => {
    // get monkey from map using key of monkeyName
    let monkey = monkeys.get(monkeyName);
    if (!monkey.leftChild && !monkey.rightChild) {
        // monkley is a value, return it.
        return monkey.value;
    }
    else {
        // recursively perform operation
        let { operation } = monkey;
        if (operation === "+") {
            return computeValue(monkey.leftChild) + computeValue(monkey.rightChild);
        }
        if (operation === "-") {
            return computeValue(monkey.leftChild) - computeValue(monkey.rightChild);
        }
        if (operation === "*") {
            return computeValue(monkey.leftChild) * computeValue(monkey.rightChild);
        }
        if (operation === "/") {
            return computeValue(monkey.leftChild) / computeValue(monkey.rightChild);
        }
    }
};
let val = computeValue("root");
console.log({ val });
// 282285213953670
//# sourceMappingURL=day-21.js.map