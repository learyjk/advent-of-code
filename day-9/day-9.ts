import { readFileSync } from "fs";

// Open the file and read its contents
const file = readFileSync("day-9/input.txt", "utf8");

const lines = file.split("\n");

interface Point {
  x: number;
  y: number;
}

// arrays that track positions for head and tail
let headPositions: Point[] = [];
let tailPositions: Point[] = [];

headPositions.push({ x: 0, y: 0 });
tailPositions.push({ x: 0, y: 0 });

// next head position is found using current positiong and input data
let getNextHeadPosition = (direction: string, positions: Point[]): Point => {
  let { x, y } = positions[positions.length - 1];
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

  // if head is more than 1 away from tail in x dir then move tail towards head
  // right
  if (deltaX > 1) {
    tailX++;
    // diagonal chance if deltaX was > 1 and deltaY is not 0.
    /* e.g. head moves left and tail is one row below.
    ...H..
    ....T.
    ......
    ......
    s.....

    ..HT..
    ......
    ......
    ......
    s.....
    */
    if (deltaY > 0) {
      tailY++;
    }
    if (deltaY < 0) {
      tailY--;
    }
  }
  // left
  if (deltaX < -1) {
    tailX--;
    if (deltaY > 0) {
      tailY++;
    }
    if (deltaY < 0) {
      tailY--;
    }
  }
  // down
  if (deltaY > 1) {
    tailY++;
    if (deltaX > 0) {
      tailX++;
    }
    if (deltaX < 0) {
      tailX--;
    }
  }
  // up
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
    let nextHeadPos = getNextHeadPosition(direction, headPositions);
    let nextTailPos = getNextTailPosition(nextHeadPos);
    headPositions.push(nextHeadPos);
    tailPositions.push(nextTailPos);
  }
}

// to get answer, simply put the tailPositions into a set.
const tailSet: Set<string> = new Set();
// loop through all tail positions
for (const tailPos of tailPositions) {
  // stringify Points and add to set to remove any duplicates
  const tailPosStr = JSON.stringify(tailPos);
  tailSet.add(tailPosStr);
}

// return the size of the set to get the number of unique tail positions
console.log(`tailSet.size: ${tailSet.size}`);

// PART TWO

// rather than 2 knots, we need to track 10 now
// mindset shift: treat current knot as the tail and knot in front as head
const knotMap = new Map<number, Point[]>();
for (let i = 0; i < 10; i++) {
  knotMap.set(i, [{ x: 0, y: 0 }]);
}

// modify the getNextTailPosition to take in arbitrary knots
const getNextKnotPosition = (
  currentKnot: Point[],
  knotInFront: Point[]
): Point => {
  let { x: tailX, y: tailY } = currentKnot[currentKnot.length - 1];
  let { x: headX, y: headY } = knotInFront[knotInFront.length - 1];

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
    return { x: tailX, y: tailY };
  }
  if (deltaX < -1) {
    tailX--;
    if (deltaY > 0) {
      tailY++;
    }
    if (deltaY < 0) {
      tailY--;
    }
    return { x: tailX, y: tailY };
  }
  if (deltaY > 1) {
    tailY++;
    if (deltaX > 0) {
      tailX++;
    }
    if (deltaX < 0) {
      tailX--;
    }
    return { x: tailX, y: tailY };
  }
  if (deltaY < -1) {
    tailY--;
    if (deltaX > 0) {
      tailX++;
    }
    if (deltaX < 0) {
      tailX--;
    }
    return { x: tailX, y: tailY };
  }
};

for (const line of lines) {
  let direction = line[0];
  let distance = parseInt(line.slice(2), 10);
  for (let i = 0; i < distance; i++) {
    // move head ${direction} ${i} ${distance}`);
    for (let k = 0; k < knotMap.size; k++) {
      let currentKnot = knotMap.get(k);
      // first knot can use getNextHeadPosition from part 1.
      if (k === 0) {
        let nextPos = getNextHeadPosition(direction, currentKnot);
        // console.log(`knot ${k} nextPos ${JSON.stringify(nextPos)}`);
        currentKnot.push(nextPos);
      } else {
        let knotInFront = knotMap.get(k - 1);
        let nextPos = getNextKnotPosition(currentKnot, knotInFront);
        // console.log(`knot ${k} nextPos ${JSON.stringify(nextPos)}`);
        currentKnot.push(nextPos);
      }
    }
  }
}

// similarly to part 1, store last knot positions into a set and return its size.
const tailSetTwo: Set<string> = new Set();
// loop through all positions of the last knot
for (const pos of knotMap.get(9)) {
  const posStr = JSON.stringify(pos);
  tailSetTwo.add(posStr);
}
console.log(`tailSetTwo.size: ${tailSetTwo.size}`);
