import { readFileSync } from "fs";

let file = readFileSync("day-21/input.txt", "utf-8");

let rows = file.split("\n");

type Monkey = {
  name: string;
  value?: number;
  operation?: string;
  leftChild?: string | null;
  rightChild?: string | null;
};

let monkeys: Map<string, Monkey> = new Map();

for (let row of rows) {
  let name = row.substring(0, row.indexOf(":"));
  let second = row.substring(row.indexOf(": ") + 2);
  let value = parseInt(second, 10);
  if (!isNaN(value)) {
    let monkey: Monkey = {
      name,
      value,
      leftChild: null,
      rightChild: null,
    };
    monkeys.set(monkey.name, monkey);
  } else {
    let leftChild = second.substring(0, second.indexOf(" "));
    second = second.substring(second.indexOf(" ") + 1);
    let operation = second[0];
    let rightChild = second.substring(second.indexOf(" ") + 1);
    let monkey: Monkey = {
      name,
      operation,
      leftChild,
      rightChild,
    };
    monkeys.set(monkey.name, monkey);
  }
}
console.log({ monkeys });

const computeValue = (monkeyName: string) => {
  // get monkey from map using key of monkeyName
  let monkey = monkeys.get(monkeyName);
  if (!monkey.leftChild && !monkey.rightChild) {
    // monkley is a value, return it.
    return monkey.value;
  } else {
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

// PART TWO

let foundHumn = false;

const searchForHumn = (monkeyName: string) => {
  if (monkeyName === "humn") {
    foundHumn = true;
  }
  let monkey = monkeys.get(monkeyName);
  if (monkey.leftChild) {
    searchForHumn(monkey.leftChild);
  }
  if (monkey.rightChild) {
    searchForHumn(monkey.rightChild);
  }
};

// search left and right of root to find if humn is in left or right subtree
console.log(monkeys.get("root"));
// { name: 'root', operation: '+', leftChild: 'fzvp', rightChild: 'grlb' }

// input
// searchForHumn("fzvp");
// console.log(foundHumn && "humn in left subtree");
// foundHumn = false;
// searchForHumn("grlb");
// console.log(foundHumn && "humn in right subtree");

// humn is in left subtree

// inputExample
// searchForHumn("pppw");
// console.log(foundHumn && "humn in left subtree");
// foundHumn = false;
// searchForHumn("sjmn");
// console.log(foundHumn && "humn in right subtree");

// humn is in left subtree

// get value of right subtree
// sjmn for example
// grlb for input
let valRight = computeValue("grlb");
console.log({ valRight });

const getExpression = (monkeyName: string) => {
  // get monkey from map using key of monkeyName
  let monkey = monkeys.get(monkeyName);
  if (!monkey.leftChild && !monkey.rightChild) {
    // monkley is a value, return it.
    if (monkeyName === "humn") {
      return "x";
    } else {
      return monkey.value;
    }
  } else {
    // recursively perform operation
    let { operation } = monkey;
    if (operation === "+") {
      return `(${getExpression(monkey.leftChild)} + ${getExpression(
        monkey.rightChild
      )})`;
    }
    if (operation === "-") {
      return `(${getExpression(monkey.leftChild)} - ${getExpression(
        monkey.rightChild
      )})`;
    }
    if (operation === "*") {
      return `(${getExpression(monkey.leftChild)} * ${getExpression(
        monkey.rightChild
      )})`;
    }
    if (operation === "/") {
      return `(${getExpression(monkey.leftChild)} / ${getExpression(
        monkey.rightChild
      )})`;
    }
  }
};
// pppw for example
// fzvp for input
console.log(getExpression("fzvp"));

// take the output and plug it in at https://nerdamer.com/demo.html
// 88521161883075 = 9((-256 * x / 81) + (1743876468740059 / 81))
// = 3699945358564
