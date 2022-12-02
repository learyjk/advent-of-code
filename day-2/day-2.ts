import { readFile } from "fs";
/*
ROCK - 1
A
X

PAPER - 2
B
Y

SCISSORS - 3
C
Z

OUTCOME
0 Lose
3 Draw
6 Win

*/

const score = 0;

const gameScore = (opponentChoice: string, playerChoice: string) => {
  //opponenet chooses rock
  if (opponentChoice === "A") {
    if (playerChoice === "X") {
      return 3;
    } else if (playerChoice === "Y") {
      return 6;
    } else {
      return 0;
    }
  }
  //opponenet chooses paper
  if (opponentChoice === "B") {
    if (playerChoice === "X") {
      return 0;
    } else if (playerChoice === "Y") {
      return 3;
    } else {
      return 6;
    }
  }
  //opponenet chooses scissors
  if (opponentChoice === "C") {
    if (playerChoice === "X") {
      return 6;
    } else if (playerChoice === "Y") {
      return 0;
    } else {
      return 3;
    }
  }
};

const getPlayerChoice = (opponentChoice: string, desiredOutcome: string) => {
  // desire a loss
  if (desiredOutcome == "X") {
    if (opponentChoice === "A") {
      return "Z"; // player should choose scissors
    } else if (opponentChoice === "B") {
      return "X"; // playr should choose
    } else {
      return "Y";
    }
  }
  //desire a draw
  if (desiredOutcome == "Y") {
    if (opponentChoice === "A") {
      return "X";
    } else if (opponentChoice === "B") {
      return "Y";
    } else {
      return "Z";
    }
  }
  //desire a win
  if (desiredOutcome == "Z") {
    if (opponentChoice === "A") {
      return "Y";
    } else if (opponentChoice === "B") {
      return "Z";
    } else {
      return "X";
    }
  }
};

const choiceScore = (playerChoice: string) => {
  if (playerChoice === "X") return 1;
  if (playerChoice === "Y") return 2;
  if (playerChoice === "Z") return 3;
  return 0;
};

const playGame = (opponentChoice: string, playerChoice: string) => {
  const scoreFromGame = gameScore(opponentChoice, playerChoice);
  const scoreFromChoice = choiceScore(playerChoice);
  return scoreFromGame + scoreFromChoice;
};

const playGame2 = (opponentChoice: string, desiredOutcome: string) => {
  const playerChoice = getPlayerChoice(opponentChoice, desiredOutcome);
  const scoreFromGame2 = gameScore(opponentChoice, playerChoice);
  const scoreFromChoice = choiceScore(playerChoice);
  return scoreFromGame2 + scoreFromChoice;
};

const runStrat = () => {
  readFile("day-2/input.txt", "utf8", (err, data) => {
    if (err) throw err;
    const games = data.split("\n");
    let score = 0;
    for (const game of games) {
      score += playGame(game[0], game[2]);
    }
    console.log(score);
  });
};

const runStrat2 = () => {
  readFile("day-2/input.txt", "utf8", (err, data) => {
    if (err) throw err;
    const games = data.split("\n");
    let score = 0;
    for (const game of games) {
      score += playGame2(game[0], game[2]);
    }
    console.log(score);
  });
};
runStrat2();
