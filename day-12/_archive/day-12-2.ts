import * as fs from "fs/promises";

async function part2() {
  const input = (await fs.readFile("day-12/input.txt")).toString().split("\n");

  const chars: string[][] = [];
  const visited: boolean[][] = [];
  input.forEach((line) => {
    chars.push(line.split(""));
    var visit: boolean[] = [];
    line.split("").map((_) => visit.push(false));
    visited.push(visit);
  });

  const directions: number[][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  var start = [0, 0];
  var end = [0, 0];

  const startCoords: number[][] = [];
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

  const lengths: number[] = [];

  startCoords.forEach((start) => {
    const queue: number[][] = [[start[0], start[1], 0]];
    // console.log(queue);
    while (queue.length) {
      const curr = queue.shift();
      if (curr) {
        for (var i = 0; i < directions.length; i++) {
          if (
            curr[0] + directions[i][0] < 0 ||
            curr[1] + directions[i][1] < 0 ||
            curr[0] + directions[i][0] >= chars.length ||
            curr[1] + directions[i][1] >= chars[0].length
          ) {
            continue;
          }
          if (visited[curr[0] + directions[i][0]][curr[1] + directions[i][1]]) {
            continue;
          }
          if (
            chars[curr[0] + directions[i][0]][
              curr[1] + directions[i][1]
            ].charCodeAt(0) -
              chars[curr[0]][curr[1]].charCodeAt(0) >
            1
          ) {
            continue;
          }
          if (
            curr[0] + directions[i][0] === end[0] &&
            curr[1] + directions[i][1] === end[1]
          ) {
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
    visited.forEach((row, i) =>
      row.forEach((ele, j) => (visited[i][j] = false))
    );
  });
  console.log("PART 2 : ", Math.min(...lengths));
}
part2();
