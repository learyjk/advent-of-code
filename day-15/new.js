"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineIntersection = exports.findLineBetween = exports.findAdjacentSensors = exports.getScannedPositionsOnLine = exports.getIntersection = exports.getSensorRadius = exports.getDistance = exports.parseSensors = void 0;
const fs_1 = require("fs");
const input = (0, fs_1.readFileSync)("day-15/input.txt", "utf8").replace(/\r/g, "");
/*
REGEX EXPLANATION
The \d+ matches one or more digits.
The -? indicates that the preceding character is optional.
The - character represents a negative sign, so the -? allows for the
possibility of a negative x or y coordinate.
The + after the \d indicates that the preceding character,
a digit, can be matched one or more times.
*/
function parseSensors(str) {
    return str.split("\n").map((line) => {
        const [, sx, sy, bx, by] = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
        return {
            pos: { x: Number(sx), y: Number(sy) },
            closest: { x: Number(bx), y: Number(by) },
        };
    });
}
exports.parseSensors = parseSensors;
function getDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
exports.getDistance = getDistance;
function getSensorRadius(sensor) {
    return getDistance(sensor.pos, sensor.closest);
}
exports.getSensorRadius = getSensorRadius;
function getIntersection(sensor, lineNum) {
    const yDist = Math.abs(lineNum - sensor.pos.y);
    const sensorRadius = getSensorRadius(sensor);
    if (yDist > sensorRadius) {
        // no intersection
        return null;
    }
    const span = sensorRadius - yDist;
    // inclusive
    const from = sensor.pos.x - span;
    const to = sensor.pos.x + span;
    const result = new Set();
    for (let i = from; i <= to; i++) {
        result.add(i);
    }
    return result;
}
exports.getIntersection = getIntersection;
function getScannedPositionsOnLine(lineNum, sensors) {
    const result = new Set();
    // add intersections
    for (let sensor of sensors) {
        const intersection = getIntersection(sensor, lineNum);
        if (intersection) {
            intersection.forEach((inter) => result.add(inter));
        }
    }
    // remove sensors & beacons
    for (let sensor of sensors) {
        if (sensor.pos.y === lineNum) {
            result.delete(sensor.pos.x);
        }
        if (sensor.closest.y === lineNum) {
            result.delete(sensor.closest.x);
        }
    }
    return result;
}
exports.getScannedPositionsOnLine = getScannedPositionsOnLine;
/**
 * @returns array of sensor pairs that have exactly 1 pixel space between
 */
function findAdjacentSensors(sensors) {
    const result = [];
    for (let i = 0; i < sensors.length - 1; i++) {
        for (let j = i + 1; j < sensors.length; j++) {
            const r1 = getSensorRadius(sensors[i]);
            const r2 = getSensorRadius(sensors[j]);
            const dist = getDistance(sensors[i].pos, sensors[j].pos);
            if (dist === r1 + r2 + 2) {
                result.push([sensors[i], sensors[j]]);
            }
        }
    }
    return result;
}
exports.findAdjacentSensors = findAdjacentSensors;
/**
 * @returns line between 2 adjacent sensors
 */
function findLineBetween(s1, s2) {
    const pos = { x: 0, y: 0 };
    let direction;
    let left;
    let right;
    // TODO: this probably could be implemented more elegantly
    if (s1.pos.x > s2.pos.x) {
        left = s1;
        right = s2;
    }
    else {
        left = s2;
        right = s1;
    }
    if (left.pos.y > right.pos.y) {
        // line goes to up right -> //
        pos.x = left.pos.x;
        pos.y = left.pos.y - getSensorRadius(left) - 1;
        direction = "upright";
    }
    else {
        // line goes to down right -> \\
        pos.x = left.pos.x;
        pos.y = left.pos.y + getSensorRadius(left) + 1;
        direction = "downright";
    }
    return {
        pos,
        direction,
    };
}
exports.findLineBetween = findLineBetween;
/**
 * @returns intersection point between 2 crossing lines
 */
function getLineIntersection(line1, line2) {
    if (line1.direction === line2.direction)
        throw new Error("lines are parallel");
    const downRight = line1.direction === "downright" ? line1 : line2;
    const upRight = line1.direction === "upright" ? line1 : line2;
    // TODO: this could be implemented more elegantly too
    // e.g. by offsetting x or y line positions to 0
    const projectedUpRight = Object.assign(Object.assign({}, upRight), { pos: {
            x: downRight.pos.x,
            y: upRight.pos.y + upRight.pos.x - downRight.pos.x,
        } });
    const halfDistance = (downRight.pos.y - projectedUpRight.pos.y) / 2;
    const x = downRight.pos.x - halfDistance;
    const y = downRight.pos.y - halfDistance;
    return { x, y };
}
exports.getLineIntersection = getLineIntersection;
// part 1
console.log(getScannedPositionsOnLine(2000000, parseSensors(input)).size);
// part 2
const adjacent = findAdjacentSensors(parseSensors(input));
const lines = adjacent.map((pair) => findLineBetween(...pair));
// TODO
// I think we also need to find all possible intersection points of all
// combinations of adjacent sensors, and then check them against all
// sensors to filter the ones that are inside some other sensor.
// But there is only one combination of adjacent pairs in the input and I'm
// really tired of this puzzle, so I'll leave this comment instead.
const point = getLineIntersection(lines[0], lines[1]);
console.log(point.x * 4000000 + point.y);
//# sourceMappingURL=new.js.map