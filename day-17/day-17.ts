import { readFileSync } from "fs";

// for using spacebar to step through
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// array of rock positions that will map to grid positions
const rocks = [
  // hLine
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  // plus
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
  ],
  // J
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  //vLine
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  //square
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
];

// constants
const SPAWN_HEIGHT = 3;
const SPAWN_COL = 2;

class Rock {
  row: number;
  col: number;
  width: number;
  height: number;
  positions: number[][];
  constructor(startRow: number, startCol: number, positions: number[][]) {
    this.row = startRow;
    this.col = startCol;

    // use to set piece width and height
    let maxHeight = 0;
    let maxWidth = 0;

    // adjust position accounting for start position.
    this.positions = positions.map((pos) => {
      let [r, c] = pos;
      maxHeight = Math.max(maxHeight, r);
      maxWidth = Math.max(maxWidth, c);
      return [r + startRow, c + startCol];
    });

    // set width and height
    this.width = maxWidth + 1;
    this.height = maxHeight + 1;
  }

  // return true is piece is at bottom.
  checkBottomed = () => {
    return this.row === 0;
  };

  checkBottomCollision = (lockedPieces: number[][]) => {
    // loop through each piece position and check the cell
    // directly below if it exists in lockedPieces
    // i.e. lockedPiece row === piece row - 1 && same col.
    for (let piecePos of this.positions) {
      let row = piecePos[0];
      let col = piecePos[1];

      for (let lockedPiece of lockedPieces) {
        if (lockedPiece[0] === row - 1 && lockedPiece[1] === col) {
          return true;
        }
      }
    }
  };

  moveDown = () => {
    // don't move down if on bottom.
    if (this.checkBottomed()) return;

    // decrement row
    this.row--;

    // map each position to one row down.
    this.positions = this.positions.map((pos) => {
      let [r, c] = pos;
      return [r - 1, c];
    });
  };

  canMoveRight = (board: Board) => {
    // check in bounds of the grid
    if (this.col + this.width >= board.grid[0].length) {
      return false;
    }

    // check each piece position for a locked board piece immediately to its right.
    for (let pos of this.positions) {
      let row = pos[0];
      let col = pos[1];

      for (let lockedPos of board.lockedPieces) {
        if (row === lockedPos[0] && col + 1 === lockedPos[1]) {
          return false;
        }
      }
    }

    // pass all test, resturn true
    return true;
  };

  moveRight = (board: Board) => {
    // do nothing if it cannot move right
    if (!this.canMoveRight(board)) return;

    // can more right, map positions one to the right
    this.positions = this.positions.map((pos) => [pos[0], pos[1] + 1]);

    //increment the column
    this.col++;
  };

  canMoveLeft = (board: Board) => {
    if (this.col <= 0) {
      return false;
    }
    for (let pos of this.positions) {
      let row = pos[0];
      let col = pos[1];

      for (let lockedPos of board.lockedPieces) {
        if (row === lockedPos[0] && col - 1 === lockedPos[1]) {
          return false;
        }
      }
    }
    return true;
  };

  moveLeft = (board: Board) => {
    if (!this.canMoveLeft(board)) return;
    this.positions = this.positions.map((pos) => [pos[0], pos[1] - 1]);
    this.col--;
  };

  applyJet = (jet: string, board: Board) => {
    if (jet === ">") this.moveRight(board);
    else if (jet === "<") this.moveLeft(board);
  };
}

class Board {
  grid: string[][];
  activeRock: Rock;
  lockedPieces: number[][];
  rockNumber: number;
  constructor(numRows: number, numCols: number) {
    // initialize empty board with '.' character based on constructor parameters.
    this.grid = Array.from(Array(numRows), () => {
      return new Array(numCols).fill(".");
    });
    this.lockedPieces = [];
    this.activeRock = null;
    this.rockNumber = 0;
  }

  public spawnRock = () => {
    // spawn new rock at top row, column 2, with shape from rocks array.
    this.rockNumber++;

    // get highest row of locked piece so we can spawn new piece SPAWN_HEIGHT above.
    let highestRow = this.getHighestLockedPieceRow();

    // create a new rock.
    let newRock = new Rock(
      highestRow + SPAWN_HEIGHT + 1,
      SPAWN_COL,
      rocks[(this.rockNumber - 1) % rocks.length] // rotates through available pieces.
    );

    // add board grid rows equal to rock height
    // note this keeps getting larger over time and could be improved.
    for (let i = 0; i < newRock.height; i++) {
      this.grid.push(new Array(this.grid[0].length).fill("."));
    }

    // set activeRock
    this.activeRock = newRock;
  };

  public lockPiece = () => {
    this.lockedPieces.push(...this.activeRock.positions);
    this.activeRock = null;
  };

  public getHighestLockedPieceRow = () => {
    // start from -1 to account for first piece.
    let maxRow = -1;
    for (let lockedPos of this.lockedPieces) {
      maxRow = Math.max(maxRow, lockedPos[0]);
    }
    return maxRow;
  };

  public update = (jetChar: string) => {
    // place piece if there is no active rock.
    if (!this.activeRock) {
      this.spawnRock();
      //this.print();
    }

    // apply jet
    this.activeRock.applyJet(jetChar, this);
    //this.print();

    // check for bottoming conditions
    if (this.activeRock.checkBottomed()) {
      this.lockPiece();
    } else if (this.activeRock.checkBottomCollision(this.lockedPieces)) {
      this.lockPiece();
    } else {
      // move down if no bottoming conditions met.
      this.activeRock.moveDown();
    }

    if (this.checkFinished()) {
      console.log(this.getHighestLockedPieceRow() + 1); // add one due to zero indexing of rows.
      throw new Error("finished!");
    }

    // print board
    board.print();
  };

  checkFinished = () => {
    if (this.rockNumber === 2023) {
      return true;
    }
  };

  public print = () => {
    console.log(""); // empty top row
    for (let r = this.grid.length - 1; r >= 0; r--) {
      let row = "|";
      for (let c = 0; c < this.grid[0].length; c++) {
        if (
          this.activeRock &&
          this.activeRock.positions.some((pos) => {
            return pos[0] === r && pos[1] === c;
          })
        ) {
          row += "@";
        } else if (
          this.lockedPieces.some((pos) => {
            return pos[0] === r && pos[1] === c;
          })
        ) {
          row += "#";
        } else {
          row += ".";
        }
      }
      console.log(row + "|");
    }
    console.log("+-------+");
  };
}

let board = new Board(3, 7);
let step = 0;
let jetindex = 0;
let jets: string = readFileSync("day-17/input.txt", "utf-8");
board.print();
process.stdin.on("keypress", (str, key) => {
  if (key.name === "space") {
    let jetChar = jets[jetindex];
    board.update(jetChar);
    step++;
    jetindex = jetindex === jets.length - 1 ? 0 : jetindex + 1;
  }
});

// while (true) {
//   let jetChar = jets[jetindex];
//   board.update(jetChar);
//   step++;
//   jetindex = jetindex === jets.length - 1 ? 0 : jetindex + 1;
// }
