const fs = require("fs");
const assert = require("assert");

type Resource = "ore" | "clay" | "obsidian" | "geode";
type BotRequirements = Record<Resource, number>;

const parseBlueprints = (data: string) =>
  data
    .toLowerCase()
    .split("\n")
    .map((line) =>
      line
        .split("each ")
        .slice(1)
        .reduce((bots, text) => {
          const [robot, requirements] = text
            .split(".")[0]
            .split(" robot costs ");
          bots[robot as Resource] = requirements
            .split(" and ")
            .reduce((requirements, text) => {
              const [count, resource] = text.split(" ");
              requirements[resource as Resource] = parseInt(count);
              return requirements;
            }, {} as BotRequirements);
          return bots;
        }, {} as Record<Resource, BotRequirements>)
    );

function bfs(
  oreBotReq: BotRequirements,
  clayBotReq: BotRequirements,
  obsidianBotReq: BotRequirements,
  geodeBotReq: BotRequirements,
  minutesLeft: number
) {
  // best geode count we've seen so far
  let best = -Infinity;
  // cache of states we've seen
  const seen = new Set();

  // stack is array of arrays.
  const stack = [[0, 0, 0, 0, 1, 0, 0, 0, minutesLeft]];

  // while the stack has a state to explore
  while (stack.length) {
    // pop the next state off the stack
    const next = stack.pop()!;
    // destructure the state into its components
    let [
      ore,
      clay,
      obsidian,
      geode,
      oreRobots,
      clayRobots,
      obsidianRobots,
      geodeRobots,
      minutesLeft,
    ] = next;

    // if we have enough time to build a geode, do it
    best = Math.max(best, geode);
    // if we have no time left, go into the stack)
    if (minutesLeft === 0) continue;

    // PRUNING CONDITION
    // do not create robots for an ore if we have as many robots
    // producing that ore as the maximum cost for building new robots using it
    const maxOreCost = Math.max(
      oreBotReq.ore,
      clayBotReq.ore,
      obsidianBotReq.ore,
      geodeBotReq.ore
    );

    // STATE PRUNING STRATEGIES
    // 1.
    // No need to track states with more ore robots than whatever
    // costs the most ore.

    // 2.
    // No need to track states that have more resource than time left to use it.

    // if maxOreCost is less than oreRobots for this state,
    // just set oreRobots to maxOreCost which will be stored in cache
    // so we can skip it.
    // no needed to track states with more ore robots than the max ore cost
    oreRobots = Math.min(oreRobots, maxOreCost);
    // don't worry about states that make more ore if there's not enough time
    // to build another robot that requires maxOreCost.
    ore = Math.min(
      ore,
      // if there's enough time to build an ore bot...
      minutesLeft * maxOreCost - oreRobots * (minutesLeft - 1)
    );

    // we don't care about states with more clay robots than the
    // amount of clay needed to build an obsidian robots.
    // i.e. Clay is expensive! (input)
    clayRobots = Math.min(clayRobots, obsidianBotReq.clay);
    // don't worry states that make more clay if there's not enough time to build an
    // obsidian bot
    clay = Math.min(
      clay,
      minutesLeft * obsidianBotReq.clay - clayRobots * (minutesLeft - 1)
    );

    // only care about states where we have enough obsidian to builid a geode robot
    geodeRobots = Math.min(geodeRobots, geodeBotReq.obsidian);
    // don't worry about states that make more obsidian if there's not enough time
    obsidian = Math.min(
      obsidian,
      minutesLeft * geodeBotReq.obsidian - geodeRobots * (minutesLeft - 1)
    );

    // create cache key.
    const key = [
      ore,
      clay,
      obsidian,
      geode,
      oreRobots,
      clayRobots,
      obsidianRobots,
      geodeRobots,
      minutesLeft,
    ].join(",");

    // go back to loop if we've seen this state before
    if (seen.has(key)) continue;

    // add new state to cache
    seen.add(key);

    // EXPLORE the DO NOTHING STATE every time.
    // required to explore future states where we build robots.
    const newMinutes = minutesLeft - 1;
    const [newOre, newClay, newObsidian, newGeode] = [
      ore + oreRobots,
      clay + clayRobots,
      obsidian + obsidianRobots,
      geode + geodeRobots,
    ];
    stack.push([
      newOre,
      newClay,
      newObsidian,
      newGeode,
      oreRobots,
      clayRobots,
      obsidianRobots,
      geodeRobots,
      newMinutes,
    ]);

    // FUTURE STATES WITH ROBOT BUILDING
    // FIRST PRIORITY to future states that will build geode robots. Don't explore other states
    // if we can build a geode robot.
    if (ore >= geodeBotReq.ore && obsidian >= geodeBotReq.obsidian) {
      // build a geode robot if we have enough obsidian and ore
      // push that stack to state
      stack.push([
        newOre - geodeBotReq.ore,
        newClay,
        newObsidian - geodeBotReq.obsidian,
        newGeode,
        oreRobots,
        clayRobots,
        obsidianRobots,
        geodeRobots + 1,
        newMinutes,
      ]);
    } else if (ore >= obsidianBotReq.ore && clay >= obsidianBotReq.clay) {
      // SECOND PRIORITY: explore states that build an obsidian robot.
      // build an obsidian robot if we have enough ore and clay
      // push that stack to state
      stack.push([
        newOre - obsidianBotReq.ore,
        newClay - obsidianBotReq.clay,
        newObsidian,
        newGeode,
        oreRobots,
        clayRobots,
        obsidianRobots + 1,
        geodeRobots,
        newMinutes,
      ]);
    } else {
      // THIRD PRIORITY: explore both states where we build an ore robot and a clay robot
      // push state with a new ore robot if enough ore
      if (ore >= clayBotReq.ore) {
        stack.push([
          newOre - clayBotReq.ore,
          newClay,
          newObsidian,
          newGeode,
          oreRobots,
          clayRobots + 1,
          obsidianRobots,
          geodeRobots,
          newMinutes,
        ]);
      }
      // push state with a new clay robot if we have enough ore.
      if (ore >= oreBotReq.ore) {
        stack.push([
          newOre - oreBotReq.ore,
          newClay,
          newObsidian,
          newGeode,
          oreRobots + 1,
          clayRobots,
          obsidianRobots,
          geodeRobots,
          newMinutes,
        ]);
      }
    }
  }
  return best;
}

function solveOne(data: string): any {
  return parseBlueprints(data).reduce(
    (sum, blueprint, i) =>
      sum +
      bfs(
        blueprint.ore,
        blueprint.clay,
        blueprint.obsidian,
        blueprint.geode,
        24
      ) *
        (i + 1),
    0
  );
}

(() => {
  const data = fs.readFileSync(__dirname + "/inputExample.txt").toString();
  assert.deepStrictEqual(
    solveOne(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`),
    33
  );
  console.log(solveOne(data));
})();

function solveTwo(data: string): any {
  return parseBlueprints(data)
    .slice(0, 3)
    .reduce(
      (product, blueprint) =>
        product *
        bfs(
          blueprint.ore,
          blueprint.clay,
          blueprint.obsidian,
          blueprint.geode,
          32
        ),
      1
    );
}

(() => {
  const data = fs.readFileSync(__dirname + "/inputExample.txt").toString();
  assert.deepStrictEqual(
    solveTwo(`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
	Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`),
    3162
  );
  console.log(solveTwo(data));
})();
