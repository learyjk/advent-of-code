import { readFileSync } from "fs";
import { pieces } from "./pieces.js";
console.log({ pieces });

const jets = readFileSync("day-17/inputExample.txt", "utf-8");

console.log(jets);
const SPAWN_X = 2;

const buildInitialBoard = (width: number, height: number) => {
  return Array.from(Array(height), () => {
    return new Array(width).fill(".");
  });
};

const printBoard = (board: string[][]) => {
  for (let i = board.length - 1; i >= 0; i--) {
    let num = i.toString();
    while (num.length < 4) {
      num += " ";
    }
    console.log(`${num}: ${board[i].join("")}`);
  }
  //   board.forEach((row, index) => {
  //     console.log(`${index}: ${row.join("")}`);
  //   });
};

const getPieceWidth = (piece: string[][]) => {
  return piece[0].length;
};

const getPieceHeight = (piece: string[][]) => {
  return piece.length;
};

const placeNewPiece = (board: string[][], pieces, pieceIndex) => {
  let piece = pieces[pieceIndex];
  let pieceWidth = getPieceWidth(piece);
  let pieceHeight = getPieceHeight(piece);

  for (let i = 0; i < pieceHeight; i++) {
    board.push([".", ".", ".", ".", ".", ".", "."]);
  }
  drawPieceOnBoard(board, pieces, pieceIndex);

  //board.push([".", "@", "@", "@", "@", "@", "@"]);
};

const drawPieceOnBoard = (board, pieces, pieceIndex) => {
  let piece = pieces[pieceIndex];
  console.log(piece);
  let pieceWidth = getPieceWidth(piece);
  let pieceHeight = getPieceHeight(piece);

  for (let i = 0; i < pieceHeight; i++) {
    for (let j = 0; j < pieceWidth; j++) {
      board[board.length - 1 - i][j + SPAWN_X] = piece[i][j];
    }
  }
};

const canMoveRight = (board, pos, pieceWidth, pieceHeight) => {
  if (pos.x + pieceWidth >= board[0].length) {
    return false;
  }
  console.log(pos.y);
  console.log(pos.x);
  for (let i = pos.y; i < pos.y + pieceHeight; i++) {
    if (
      board[i][pos.x + pieceWidth - 1] !== "." &&
      board[i][pos.x + pieceWidth] !== "."
    ) {
      return false;
    }
  }
  return true;
};

const canMoveLeft = (board, pos, pieceWidth, pieceHeight) => {
  if (pos.x === 0) {
    return false;
  }
  for (let i = pos.y; i < pos.y + pieceHeight; i++) {
    if (board[i][pos.x] !== "." && board[i][pos.x - 1] !== ".") {
      return false;
    }
  }
  return true;
};

const applyJet = (board, jetCharacter, pos, pieceHeight, pieceWidth) => {
  console.log({ jetCharacter });
  if (jetCharacter === ">") {
    // push right

    if (canMoveRight(board, pos, pieceWidth, pieceHeight)) {
      for (let i = pos.y; i < pos.y + pieceHeight; i++) {
        for (let j = pos.x + pieceWidth; j >= pos.x; j--) {
          if (j - 1 < 0) {
            board[i][j] = ".";
          } else {
            board[i][j] = board[i][j - 1];
          }
        }
      }
      activePos.x++;
    }
  } else {
    // push left
    if (canMoveLeft(board, pos, pieceWidth, pieceHeight)) {
      for (let i = pos.y; i < pos.y + pieceHeight; i++) {
        for (let j = pos.x - 1; j < pos.x + pieceWidth; j++) {
          if (j + 1 === board[0].length) {
            board[i][j] = ".";
          } else {
            board[i][j] = board[i][j + 1];
          }
        }
        board[i];
      }

      activePos.x--;
    }
  }
};

const applyFall = (board, pos, pieceHeight, pieceWidth) => {
  // check grounded
  if (pos.y === 0) {
    for (let i = pos.y; i < pos.y + pieceHeight; i++) {
      for (let j = pos.x + pieceWidth - 1; j >= pos.x; j--) {
        board[i][j] = "#";
      }
    }
    return true;
  }
  // check collision
  let hasCollided = false;
  for (let i = pos.y; i < pos.y + pieceHeight; i++) {
    for (let j = pos.x + pieceWidth - 1; j >= pos.x; j--) {
      if (board[i][j] === "@") {
        if (board[i - 1][j] === "#") {
          hasCollided = true;
        }
      }
    }
  }
  if (hasCollided) {
    for (let i = pos.y; i < pos.y + pieceHeight; i++) {
      for (let j = pos.x + pieceWidth - 1; j >= pos.x; j--) {
        if (board[i][j] === "@") {
          board[i][j] = "#";
        }
      }
    }
    return true;
  } else {
    for (let i = pos.y; i < pos.y + pieceHeight; i++) {
      for (let j = pos.x + pieceWidth - 1; j >= pos.x; j--) {
        if (board[i - 1][j] !== "#") {
          board[i - 1][j] = board[i][j];
        }
      }
    }
    for (let i = pos.x; i < board[0].length; i++) {
      board[pos.y + pieceHeight - 1][i] = ".";
    }
    activePos.y--;
    return false;
  }
};

const checkPosition = (board, pos) => {
  if (pos.y < 0) {
    console.log("reached bottom");
  }
};

let board = buildInitialBoard(7, 3);
console.log(board);
let activePos = { x: SPAWN_X, y: board.length };
//placeNewPiece(board, pieces, 1);
printBoard(board);
let pieceIndex = 0;
let jetCount = 0;
let i = 0;
let isPlacingPiece = true;

while (i < 30) {
  console.log({ activePos });
  console.log({ pieceIndex });
  console.log({ jetCount });
  // place a new piece on board
  if (isPlacingPiece) {
    placeNewPiece(board, pieces, pieceIndex);
    isPlacingPiece = false;
  }
  printBoard(board);
  let pieceHeight = getPieceHeight(pieces[pieceIndex]);
  let pieceWidth = getPieceWidth(pieces[pieceIndex]);
  let jetCharacter = jets[jetCount];
  // apply the jet
  applyJet(board, jetCharacter, activePos, pieceHeight, pieceWidth);
  console.log("after jet");
  printBoard(board);
  isPlacingPiece = applyFall(board, activePos, pieceHeight, pieceWidth);

  console.log("after fall");
  printBoard(board);
  checkPosition(board, activePos);

  // move the piece down

  // update variables
  if (isPlacingPiece) {
    activePos = { x: SPAWN_X, y: board.length };
    pieceIndex =
      pieceIndex === Object.keys(pieces).length - 1 ? 0 : pieceIndex + 1;
  }
  jetCount = jetCount === jets.length - 1 ? 0 : jetCount + 1;

  i++;
}