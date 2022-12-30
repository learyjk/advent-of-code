import { readFileSync } from "fs";

let file = readFileSync("day-20/input.txt", "utf-8");

let rows = file.split("\n");

type Num = [number, boolean];
let nums: Num[] = [];

for (let row of rows) {
  nums.push([parseInt(row, 10), false]);
}

console.log({ nums });

let i = 0;
while (i < nums.length) {
  if (nums[i][1] === true) {
    // already moved this value so increment i and continue with loop
    i++;
    continue;
  } else {
    // value to move
    let amtToMove = nums[i][0];
    let [removedEl] = nums.splice(i, 1);
    // change movement tracker to true
    removedEl[1] = true;
    // get new pos to insert
    let pos = (i + amtToMove) % nums.length;
    if (pos === 0) {
      // edge case send 0 pos to end of array, not front
      nums.splice(nums.length, 0, removedEl);
    } else {
      // splice back in at pos
      nums.splice(pos, 0, removedEl);
    }

    // console.log({ i });
    // console.log({ nums });
  }
}

let zeroPos = -1;
// get position of element with value = 0
nums.forEach((num, index) => {
  if (num[0] === 0) {
    zeroPos = index;
  }
});

// get 1000th, 2000th, 3000th pos digits from 0
let i1000 = (zeroPos + 1000) % nums.length;
let i2000 = (zeroPos + 2000) % nums.length;
let i3000 = (zeroPos + 3000) % nums.length;

// add numbers at positions together for solution
console.log(`solution: ${nums[i1000][0] + nums[i2000][0] + nums[i3000][0]}`);

// 13289
