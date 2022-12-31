import { readFileSync } from "fs";

// Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore.
// Each obsidian robot costs 3 ore and 14 clay.
// Each geode robot costs 2 ore and 7 obsidian.

//  (\d+) ore (\d+) clay (\d+) ore (\d+) clay (\d+) ore (\d+) obsidian

const file = readFileSync("day-19/inputExample.txt", "utf-8");

let rows = file.split("\n");

console.log({ rows });

type BluePrintCosts = {
  oreRobotOreCost: number;
  clayRobotOreCost: number;
  obsidianRobotOreCost: number;
  obsidianRobotClayCost: number;
  geodeRobotOreCost: number;
  geodeRobotObsidianCost: number;
};

type Bots = {
  oreRobot: number;
  clayRobot: number;
  obsidianRobot: number;
  geodeRobot: number;
};

type Resources = {
  ore: number;
  clay: number;
  obsidian: number;
  geodes: number;
};

type RobotOptions = {
  oreRobot: boolean;
  clayRobot: boolean;
  obsidianRobot: boolean;
  geodeRobot: boolean;
};

let blueprints: Map<number, BluePrintCosts> = new Map();

// parse the input
for (let row of rows) {
  let [
    ,
    blueprintNumber,
    oreRobotOreCost,
    clayRobotOreCost,
    obsidianRobotOreCost,
    obsidianRobotClayCost,
    geodeRobotOreCost,
    geodeRobotObsidianCost,
  ] = row.match(
    /(\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
  );
  blueprints.set(parseInt(blueprintNumber, 10), {
    oreRobotOreCost: parseInt(oreRobotOreCost, 10),
    clayRobotOreCost: parseInt(clayRobotOreCost, 10),
    obsidianRobotOreCost: parseInt(obsidianRobotOreCost, 10),
    obsidianRobotClayCost: parseInt(obsidianRobotClayCost, 10),
    geodeRobotOreCost: parseInt(geodeRobotOreCost, 10),
    geodeRobotObsidianCost: parseInt(geodeRobotObsidianCost, 10),
  });
}

let findMaxGeodeNumber = (costs: BluePrintCosts, timeRemaining: number) => {
  let {
    oreRobotOreCost,
    clayRobotOreCost,
    obsidianRobotOreCost,
    obsidianRobotClayCost,
    geodeRobotOreCost,
    geodeRobotObsidianCost,
  } = costs;

  // variables outside scope of the loop.
  // track maxGeodes and cache
  let maxGeodes = -Infinity;
  const cache = new Set();

  // initial bots
  let bots: Bots = {
    oreRobot: 1,
    clayRobot: 0,
    obsidianRobot: 0,
    geodeRobot: 0,
  };

  // initial resources
  let resources: Resources = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geodes: 0,
  };

  // initial state
  let stack = [{ bots, resources, timeRemaining }];

  while (stack.length) {
    const state = stack.pop();
    const { bots, resources, timeRemaining } = state;

    maxGeodes = Math.max(maxGeodes, resources.geodes);
    if (timeRemaining === 0) continue;

    // get max ore cost for any robot
    let maxOreCost = Math.max(
      oreRobotOreCost,
      clayRobotOreCost,
      obsidianRobotOreCost,
      geodeRobotOreCost
    );

    let newBots = { ...bots };
    let newResources = { ...resources };

    newBots.oreRobot = Math.min(newBots.oreRobot, maxOreCost);
    newResources.ore = Math.min(
      newResources.ore,
      timeRemaining * maxOreCost - newBots.oreRobot * (timeRemaining - 1)
    );

    newBots.clayRobot = Math.min(newBots.clayRobot, obsidianRobotClayCost);
    newResources.clay = Math.min(
      newResources.clay,
      timeRemaining * obsidianRobotClayCost -
        newBots.clayRobot * (timeRemaining - 1)
    );

    newBots.geodeRobot = Math.min(newBots.geodeRobot, geodeRobotObsidianCost);
    newResources.obsidian = Math.min(
      newResources.obsidian,
      timeRemaining * geodeRobotObsidianCost -
        newBots.geodeRobot * (timeRemaining - 1)
    );

    // check cache
    const cacheKey = `${JSON.stringify(newBots)}-${JSON.stringify(
      newResources
    )}-${timeRemaining}`;
    //console.log({ cacheKey });
    if (cache.has(cacheKey)) continue;
    cache.add(cacheKey);

    // Explore States

    // Do nothing state
    // required and allows resource accumulation
    const newTimeRemaining = timeRemaining - 1;
    const updatedResources = {
      ore: newResources.ore + newBots.oreRobot,
      clay: newResources.clay + newBots.clayRobot,
      obsidian: newResources.obsidian + newBots.obsidianRobot,
      geodes: newResources.geodes + newBots.geodeRobot,
    };

    stack.push({
      bots: { ...newBots },
      resources: { ...updatedResources },
      timeRemaining: newTimeRemaining,
    });

    // Robot build states

    // First prioritiy given to building geode robots.
    // Don't explore other build states if we are able to build a geode robot
    if (
      updatedResources.ore >= geodeRobotOreCost &&
      updatedResources.obsidian >= geodeRobotObsidianCost
    ) {
      stack.push({
        bots: { ...newBots, geodeRobot: newBots.geodeRobot + 1 },
        resources: {
          ...updatedResources,
          ore: updatedResources.ore - geodeRobotOreCost,
          obsidian: updatedResources.obsidian - geodeRobotObsidianCost,
        },
        timeRemaining: newTimeRemaining,
      });
    } else if (
      // SECOND PRIORITY: explore states that build an obsidian robot.
      // build an obsidian robot if we have enough ore and clay
      // push that stack to state
      updatedResources.ore >= obsidianRobotOreCost &&
      updatedResources.clay >= obsidianRobotClayCost
    ) {
      stack.push({
        bots: { ...newBots, obsidianRobot: newBots.obsidianRobot + 1 },
        resources: {
          ...updatedResources,
          ore: updatedResources.ore - obsidianRobotOreCost,
          clay: updatedResources.clay - obsidianRobotClayCost,
        },
        timeRemaining: newTimeRemaining,
      });
    } else {
      // THIRD PRIORITY: explore both states where we build
      // an ore robot and a clay robot.
      // push state with a new ore robot if enough ore
      if (updatedResources.ore >= oreRobotOreCost) {
        stack.push({
          bots: { ...newBots, oreRobot: newBots.oreRobot + 1 },
          resources: {
            ...updatedResources,
            ore: updatedResources.ore - oreRobotOreCost,
          },
          timeRemaining: newTimeRemaining,
        });
      }
      // clay robot
      if (updatedResources.ore >= clayRobotOreCost) {
        stack.push({
          bots: { ...newBots, clayRobot: newBots.clayRobot + 1 },
          resources: {
            ...updatedResources,
            ore: updatedResources.ore - clayRobotOreCost,
          },
          timeRemaining: newTimeRemaining,
        });
      }
    }
  }
  return maxGeodes;
};

for (let [bluePrintIndex, bluePrintCosts] of blueprints) {
  let value = findMaxGeodeNumber(bluePrintCosts, 24);
  console.log({ value });
}

// const canBuild = (
//   blueprintNumber: number,
//   robotType: string,
//   resources: Resources
// ) => {
//   let {
//     oreRobotOreCost,
//     clayRobotOreCost,
//     obsidianRobotOreCost,
//     obsidianRobotClayCost,
//     geodeRobotOreCost,
//     geodeRobotObsidianCost,
//   } = blueprints.get(blueprintNumber);

//   switch (robotType) {
//     case "oreRobot":
//       return resources.ore >= oreRobotOreCost;
//     case "clayRobot":
//       return resources.ore >= clayRobotOreCost;
//     case "obsidianRobot":
//       return (
//         resources.ore >= obsidianRobotOreCost &&
//         resources.clay >= obsidianRobotClayCost
//       );
//     case "geodeRobot":
//       return (
//         resources.ore >= geodeRobotOreCost &&
//         resources.obsidian >= geodeRobotObsidianCost
//       );
//   }
// };

// const subtractResourcesDueToBuildingRobot = (
//   blueprintNumber: number,
//   robotType: string,
//   resources: Resources
// ) => {
//   let {
//     oreRobotOreCost,
//     clayRobotOreCost,
//     obsidianRobotOreCost,
//     obsidianRobotClayCost,
//     geodeRobotOreCost,
//     geodeRobotObsidianCost,
//   } = blueprints.get(blueprintNumber);

//   switch (robotType) {
//     case "oreRobot":
//       resources.ore -= oreRobotOreCost;
//       break;
//     case "clayRobot":
//       resources.ore -= clayRobotOreCost;
//       break;
//     case "obsidianRobot":
//       resources.ore -= obsidianRobotOreCost;
//       resources.clay -= obsidianRobotClayCost;
//       break;
//     case "geodeRobot":
//       resources.ore -= geodeRobotOreCost;
//       resources.obsidian -= geodeRobotObsidianCost;
//       break;
//   }
//   return resources;
// };

// const dfs = (blueprintNumber, cache, timeRemaining, bots, resources) => {
//   console.log({ blueprintNumber, cache, timeRemaining, bots, resources });
//   if (timeRemaining === 0) {
//     return resources.geodes;
//   }

//   // check cache first
//   let cacheKey = JSON.stringify({
//     blueprintNumber,
//     timeRemaining,
//     bots,
//     resources,
//   });

//   if (cache[cacheKey]) {
//     return cache[cacheKey];
//   }

//   // do nothing state
//   let maxGeodes = resources.geodes + bots.geodeRobot * timeRemaining;

//   // try to build each type of robot
//   for (let robotType of Object.keys(bots)) {
//     // check if we can build the robot with resource available
//     let newResources = { ...resources };
//     let newBots = { ...bots };
//     if (canBuild(blueprintNumber, robotType, resources)) {
//       // build the robot
//       // subtract the cost from the resources object
//       newResources = subtractResourcesDueToBuildingRobot(
//         blueprintNumber,
//         robotType,
//         { ...resources }
//       );
//       // add the robot to our bots object
//       newBots[robotType] += 1;
//     }

//     // add resources based on current bot state
//     for (let [robotType, numRobots] of Object.entries(bots)) {
//       switch (robotType) {
//         case "oreRobot":
//           newResources.ore += numRobots;
//           break;
//         case "clayRobot":
//           newResources.clay += numRobots;
//           break;
//         case "obsidianRobot":
//           newResources.obsidian += numRobots;
//           break;
//         case "geodeRobot":
//           newResources.geodes += numRobots;
//           break;
//       }
//     }

//     // call dfs with the new bots and resources
//     maxGeodes = Math.max(
//       maxGeodes,
//       dfs(blueprintNumber, cache, timeRemaining - 1, newBots, newResources)
//     );
//   }

//   cache[cacheKey] = maxGeodes;
// };
