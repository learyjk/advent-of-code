"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
// sensor coverage distance is (abs xb - xs) + (abs yb - ys)
// a position is in range of a sensor if (abs xPos - xs) + (abs yPos - ys) <= coverage distance
/*
pos is 1,1
    y: 10 - 11 -> 1
    x: 1 - 0 -> 1

    2 < coverage distance
*/
let file = (0, fs_1.readFileSync)("day-15/input.txt", "utf8");
let lines = file.split("\n");
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
let maxCoverage = -Infinity;
let parseInput = (lines) => {
    let sensorMap = new Map();
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
        const sensorCoverage = Math.abs(yBeacon - ySensor) + Math.abs(xBeacon - xSensor);
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
let checkPositionHasCoverage = (xPos, yPos) => {
    for (let [sIndex, s] of sensorMap) {
        // position falls within sensor coverage range
        if (Math.abs(xPos - s.xSensor) + Math.abs(yPos - s.ySensor) <=
            s.sensorCoverage) {
            // console.log(
            //   `${xPos}, ${yPos} has coverage from sensor ${s.xSensor}, ${s.ySensor} which has coverage of ${s.sensorCoverage}`
            // );
            return true;
        }
    }
    return false;
};
let checkPositionHasBeaconOrSensorAlready = (xPos, yPos) => {
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
let getNumPositionsThatCannotContainABeaconInRow = (row) => {
    let numPositions = 0;
    // loop through all possible x values
    for (let xPos = minX - maxCoverage; xPos <= maxX + maxCoverage; xPos++) {
        // console.log({ xPos });
        if (checkPositionHasBeaconOrSensorAlready(xPos, row)) {
            continue;
        }
        else if (checkPositionHasCoverage(xPos, row)) {
            numPositions++;
        }
    }
    return numPositions;
};
console.log("range: ", maxX + maxCoverage - (minX - maxCoverage));
console.log(getNumPositionsThatCannotContainABeaconInRow(2000000));
const findAdjacentSensors = (sensorsMap) => {
    const result = [];
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
// returns line between adjacent sensors
const findLineBetween = (s1, s2) => {
    const pos = { x: 0, y: 0 };
    let direction;
    let left;
    let right;
    if (s1.xSensor > s2.xSensor) {
        //
        left = s1;
        right = s2;
    }
    else {
        left = s2;
        right = s1;
    }
    if (left.ySensor > right.ySensor) {
        // upright line
        pos.x = left.xSensor;
        pos.y = left.ySensor - left.sensorCoverage - 1;
        direction = "upright";
    }
    else {
        // downright line
        pos.x = left.xSensor;
        pos.y = left.ySensor + left.sensorCoverage + 1;
        direction = "downright";
    }
    return {
        pos,
        direction,
    };
};
const getLineIntersection = (line1, line2) => {
    const downRight = line1.direction === "downright" ? line1 : line2;
    const upRight = line1.direction === "upright" ? line1 : line2;
    // don't fully understand this...
    const projectedUpRight = Object.assign(Object.assign({}, upRight), { pos: {
            x: downRight.pos.x,
            y: upRight.pos.y + (upRight.pos.x - downRight.pos.x),
        } });
    const halfDistance = (downRight.pos.y - projectedUpRight.pos.y) / 2;
    const x = downRight.pos.x - halfDistance;
    const y = downRight.pos.y - halfDistance;
    return { x, y };
};
const linesFromAdjacentSensors = adjacentSensors.map((pair) => findLineBetween(...pair));
linesFromAdjacentSensors.forEach((line) => {
    console.log(JSON.stringify(line));
});
const point = getLineIntersection(linesFromAdjacentSensors[0], linesFromAdjacentSensors[1]);
console.log({ point });
console.log(point.x * 4000000 + point.y);
//# sourceMappingURL=day-15.js.map