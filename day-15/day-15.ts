import { readFileSync } from "fs";

// sensor coverage distance is (abs xb - xs) + (abs yb - ys)
// a position is in range of a sensor if (abs xPos - xs) + (abs yPos - ys) <= coverage distance

/*
pos is 1,1
    y: 10 - 11 -> 1
    x: 1 - 0 -> 1

    2 < coverage distance
*/

let file = readFileSync("day-15/input.txt", "utf8");

let lines = file.split("\n");

type Sensor = {
  xSensor: number;
  ySensor: number;
  xBeacon: number;
  yBeacon: number;
  sensorCoverage: number;
};

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
let maxCoverage = -Infinity;

let parseInput = (lines: string[]) => {
  let sensorMap: Map<number, Sensor> = new Map();
  lines.forEach((line, index) => {
    let xSensorStr = line.substring(line.indexOf("=") + 1, line.indexOf(","));
    line = line.substring(line.indexOf("y="));
    let ySensorStr = line.substring(line.indexOf("=") + 1, line.indexOf(":"));
    line = line.substring(line.indexOf("x="));
    let xBeaconStr = line.substring(line.indexOf("=") + 1, line.indexOf(","));
    line = line.substring(line.indexOf("y="));
    let yBeaconStr = line.substring(line.indexOf("=") + 1);
    let xSensor = parseInt(xSensorStr, 10);
    let ySensor = parseInt(ySensorStr, 10);
    let xBeacon = parseInt(xBeaconStr, 10);
    let yBeacon = parseInt(yBeaconStr, 10);

    // update min and max trackers
    minX = Math.min(xSensor, xBeacon, minX);
    maxX = Math.max(xSensor, xBeacon, maxX);
    minY = Math.min(ySensor, yBeacon, minY);
    maxY = Math.max(ySensor, yBeacon, maxY);

    // calculate sensor coverage for this sensor
    const sensorCoverage =
      Math.abs(yBeacon - ySensor) + Math.abs(xBeacon - xSensor);

    maxCoverage = Math.max(sensorCoverage, maxCoverage);

    // store all sensors in a map
    sensorMap.set(index, {
      xSensor,
      ySensor,
      xBeacon,
      yBeacon,
      sensorCoverage,
    });
  });
  return sensorMap;
};

let sensorMap = parseInput(lines);
console.log({ minX, minY, maxX, maxY });
console.log(sensorMap);

// for given position xPos, yPos check if it has coverage from at
// least one sensor in sensorMap
let checkPositionHasCoverage = (xPos: number, yPos: number) => {
  for (let [sIndex, s] of sensorMap) {
    // position falls within sensor coverage range
    if (
      Math.abs(xPos - s.xSensor) + Math.abs(yPos - s.ySensor) <=
      s.sensorCoverage
    ) {
      // console.log(
      //   `${xPos}, ${yPos} has coverage from sensor ${s.xSensor}, ${s.ySensor} which has coverage of ${s.sensorCoverage}`
      // );
      return true;
    }
  }
  return false;
};

let checkPositionHasBeaconOrSensorAlready = (xPos: number, yPos: number) => {
  for (let [sIndex, s] of sensorMap) {
    // no coverage if position contains a beacon
    if (xPos === s.xBeacon && yPos === s.yBeacon) {
      return true;
    }
    // no coverage if position contains a sensor
    if (xPos === s.xSensor && yPos === s.ySensor) {
      return true;
    }
  }
  return false;
};

// for specified row return number of positions that cannot possibly contain a beacon
let getNumPositionsThatCannotContainABeaconInRow = (row: number): number => {
  let numPositions = 0;
  // loop through all possible x values
  for (let xPos = minX - maxCoverage; xPos <= maxX + maxCoverage; xPos++) {
    // console.log({ xPos });
    if (checkPositionHasBeaconOrSensorAlready(xPos, row)) {
      continue;
    } else if (checkPositionHasCoverage(xPos, row)) {
      numPositions++;
    }
  }
  return numPositions;
};

console.log("range: ", maxX + maxCoverage - (minX - maxCoverage));
console.log(getNumPositionsThatCannotContainABeaconInRow(2000000));

const findAdjacentSensors = (
  sensorsMap: Map<number, Sensor>
): [Sensor, Sensor][] => {
  const result: [Sensor, Sensor][] = [];
  for (let i = 0; i < sensorsMap.size - 1; i++) {
    for (let j = i + 1; j < sensorsMap.size; j++) {
      const r1 = sensorsMap.get(i).sensorCoverage;
      const r2 = sensorsMap.get(j).sensorCoverage;
      let s1x = sensorsMap.get(i).xSensor;
      let s2x = sensorsMap.get(j).xSensor;
      let s1y = sensorsMap.get(i).ySensor;
      let s2y = sensorsMap.get(j).ySensor;
      const dist = Math.abs(s1x - s2x) + Math.abs(s1y - s2y);
      if (dist === r1 + r2 + 2) {
        result.push([sensorsMap.get(i), sensorsMap.get(j)]);
      }
    }
  }
  return result;
};
let adjacentSensors = findAdjacentSensors(sensorMap);
adjacentSensors.forEach((s, index) => {
  console.log(`sensor pair ${index}`);
  console.log(s);
});

const getLineDirection = (x1, x2, y1, y2) => {
  if (x2 - x1 > 0 && y2 - y1 > 0) return "upright";
  if (x2 - x1 > 0 && y2 - y1 < 0) return "downright";
  if (x2 - x1 < 0 && y2 - y1 > 0) return "upleft";
  return "downleft";
};

const checkPositionsAlongLineForCoverage = (
  sensor1: Sensor,
  sensor2: Sensor
) => {
  let s1x = sensor1.xSensor;
  let s2x = sensor2.xSensor;
  let s1y = sensor1.ySensor;
  let s2y = sensor2.ySensor;

  console.log({ s1x, s2x, s1y, s2y });

  let direction = getLineDirection(s1x, s2x, s1y, s2y);

  console.log({ direction });
  console.log(sensor1.sensorCoverage);

  if (direction === "upright") {
    for (let x = s1x; x <= s2x; x++) {
      //console.log({ x });
      for (let y = s1y; y <= s2y; y++) {
        let d = Math.abs(x - s1x) + Math.abs(y - s1y);
        //console.log({ d });
        // if (d === sensor1.sensorCoverage + 1) {
        //   console.log({ x, y });
        // }
        let coverage = checkPositionHasCoverage(x, y);
        if (!coverage) {
          console.log({ x, y });
        }
      }
    }
  }
  if (direction === "downright") {
    for (let x = s1x; x <= s2x; x++) {
      //console.log({ x });
      for (let y = s1y; y >= s2y; y--) {
        // let d = Math.abs(x - s1x) + Math.abs(y - s1y);
        // if (d === sensor1.sensorCoverage + 1) {
        //   console.log({ x, y });
        // }
        let coverage = checkPositionHasCoverage(x, y);
        if (!coverage) {
          console.log({ x, y });
        }
      }
    }
  }
};

adjacentSensors.forEach((pair) => {
  checkPositionsAlongLineForCoverage(...pair);
});

// PART TWO
// for (let x = 0; x < 4000000; x++) {
//   console.log(`${x}`);
//   for (let y = 0; y < 4000000; y++) {
//     if (!checkPositionHasCoverage(x, y)) {
//       console.log(`no coverage at ${x} ${y}`);
//     }
//   }

// PART TWO
// look for intersection of sensor boundary lines that have dist of 2

// let positiveLines = [];
// let negativeLines = [];

// const getLines = () => {
//   for (let [sIndex, s] of sensorMap) {
//     let positiveLinePair = [
//       s.xSensor + s.ySensor - s.sensorCoverage,
//       s.xSensor + s.ySensor + s.sensorCoverage,
//     ];
//     let negativeLinePair = [
//       s.xSensor - s.ySensor - s.sensorCoverage,
//       s.xSensor - s.ySensor + s.sensorCoverage,
//     ];
//     positiveLines.push(...positiveLinePair);
//     negativeLines.push(...negativeLinePair);
//   }
// };
// getLines();

// console.log({ positiveLines });
// console.log({ negativeLines });

// let positive;
// let negative;

// for (let i = 0; i < positiveLines.length - 1; i++) {
//   for (let j = i + 1; j < positiveLines.length; j++) {
//     let p = positiveLines[i];
//     let n = negativeLines[j];

//     if (Math.abs(p - n) < 10000) {
//       console.log(Math.abs(p - n));
//     }

//     if (Math.abs(p - n) < 10000) {
//       positive = Math.min(p, n) + 1;
//     }

//     p = positiveLines[j];
//     n = negativeLines[i];

//     if (Math.abs(p - n) < 10000) {
//       console.log(Math.abs(p - n));
//     }

//     if (Math.abs(p - n) < 3000) {
//       negative = Math.min(p, n) + 1;
//     }
//   }
// }

// console.log({ positive, negative });

// let x = Math.floor(positive + negative / 2);
// let y = Math.floor(negative - positive / 2);
// console.log({ x, y });
// let answer = x * 4000000 + y;
// console.log({ answer });
