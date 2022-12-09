import { readFileSync } from "fs";

// Open the file and read its contents
const file = readFileSync("day-9/input.txt", "utf8");

const lines = file.split("\n");

interface Point {
  x: number;
  y: number;
}

let headPositions: Point[] = [];
let tailPositions: Point[] = [];

headPositions.push({ x: 0, y: 0 });
tailPositions.push({ x: 0, y: 0 });

let getNextHeadPosition = (direction: string): Point => {
  let { x, y } = headPositions[headPositions.length - 1];
  if (direction === "R") {
    x++;
  } else if (direction === "L") {
    x--;
  } else if (direction === "U") {
    y++;
  } else if (direction === "D") {
    y--;
  }
  return { x, y };
};

const getNextTailPosition = (headPos: Point): Point => {
  let { x: tailX, y: tailY } = tailPositions[tailPositions.length - 1];
  let { x: headX, y: headY } = headPos;

  let deltaX = headX - tailX;
  let deltaY = headY - tailY;

  // check if head is more than 1 away from tail
  if (Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1) {
    // if not then no need to move tail.
    return { x: tailX, y: tailY };
  }

  // if head is more than 1 away from tail then move tail towards head
  if (deltaX > 1) {
    tailX++;
    // diagonal chance
    if (deltaY > 0) {
      tailY++;
    }
    if (deltaY < 0) {
      tailY--;
    }
  }
  if (deltaX < -1) {
    tailX--;
    if (deltaY > 0) {
      tailY++;
    }
    if (deltaY < 0) {
      tailY--;
    }
  }
  if (deltaY > 1) {
    tailY++;
    if (deltaX > 0) {
      tailX++;
    }
    if (deltaX < 0) {
      tailX--;
    }
  }
  if (deltaY < -1) {
    tailY--;
    if (deltaX > 0) {
      tailX++;
    }
    if (deltaX < 0) {
      tailX--;
    }
  }
  return { x: tailX, y: tailY };
};

for (const line of lines) {
  let direction = line[0];
  let distance = parseInt(line.slice(2), 10);
  for (let i = 0; i < distance; i++) {
    let nextHeadPos = getNextHeadPosition(direction);
    let nextTailPos = getNextTailPosition(nextHeadPos);
    headPositions.push(nextHeadPos);
    tailPositions.push(nextTailPos);
  }
}

const tailSet: Set<string> = new Set();
for (const tailPos of tailPositions) {
  const tailPosStr = JSON.stringify(tailPos);
  tailSet.add(tailPosStr);
}

console.log(tailSet.size);
