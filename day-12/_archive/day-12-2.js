"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
function part2() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = (yield fs.readFile("day-12/input.txt")).toString().split("\n");
        const chars = [];
        const visited = [];
        input.forEach((line) => {
            chars.push(line.split(""));
            var visit = [];
            line.split("").map((_) => visit.push(false));
            visited.push(visit);
        });
        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        var start = [0, 0];
        var end = [0, 0];
        const startCoords = [];
        chars.forEach((row, i) => {
            row.forEach((ele, j) => {
                if (ele === "a") {
                    startCoords.push([i, j]);
                }
                if (ele === "E") {
                    end = [i, j];
                }
                if (ele === "S") {
                    startCoords.push([i, j]);
                    start = [i, j];
                }
            });
        });
        chars[start[0]][start[1]] = "a";
        chars[end[0]][end[1]] = "z";
        const lengths = [];
        startCoords.forEach((start) => {
            const queue = [[start[0], start[1], 0]];
            // console.log(queue);
            while (queue.length) {
                const curr = queue.shift();
                if (curr) {
                    for (var i = 0; i < directions.length; i++) {
                        if (curr[0] + directions[i][0] < 0 ||
                            curr[1] + directions[i][1] < 0 ||
                            curr[0] + directions[i][0] >= chars.length ||
                            curr[1] + directions[i][1] >= chars[0].length) {
                            continue;
                        }
                        if (visited[curr[0] + directions[i][0]][curr[1] + directions[i][1]]) {
                            continue;
                        }
                        if (chars[curr[0] + directions[i][0]][curr[1] + directions[i][1]].charCodeAt(0) -
                            chars[curr[0]][curr[1]].charCodeAt(0) >
                            1) {
                            continue;
                        }
                        if (curr[0] + directions[i][0] === end[0] &&
                            curr[1] + directions[i][1] === end[1]) {
                            // console.log(curr[2] + 1);
                            lengths.push(curr[2] + 1);
                            // return;
                            break;
                        }
                        visited[curr[0] + directions[i][0]][curr[1] + directions[i][1]] =
                            true;
                        queue.push([
                            curr[0] + directions[i][0],
                            curr[1] + directions[i][1],
                            curr[2] + 1,
                        ]);
                    }
                }
            }
            visited.forEach((row, i) => row.forEach((ele, j) => (visited[i][j] = false)));
        });
        console.log("PART 2 : ", Math.min(...lengths));
    });
}
part2();
//# sourceMappingURL=day-12-2.js.map