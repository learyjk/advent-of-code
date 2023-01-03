"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const file = (0, fs_1.readFileSync)("day-16/input.txt", "utf-8");
let rows = file.split("\n");
// map where key is valve name, value is flow rate
let valveFlowData = new Map();
// map where key is valve name, value is array of valve names (tunnels)
let valveGraph = new Map();
// parse data to populate valveFlowData and valveGraph
for (let row of rows) {
    let valve = row.substring(row.indexOf(" ") + 1, row.indexOf(" ") + 3);
    let flowRate = parseInt(row.substring(row.indexOf("=") + 1, row.indexOf(";")), 10);
    let tunnelsStr = row.substring(row.indexOf("to") + 3);
    tunnelsStr = tunnelsStr.substring(tunnelsStr.indexOf(" ") + 1);
    let tunnels = tunnelsStr.split(", ");
    valveFlowData.set(valve, flowRate);
    valveGraph.set(valve, tunnels);
}
console.log({ valveFlowData });
console.log({ valveGraph });
// define our cache
let cache = new Map();
const getMaxFlow = (currentValve, openedValves, timeRemaining) => {
    // base case timeRemaining = 0
    if (timeRemaining <= 0) {
        return 0;
    }
    let cacheKey = `${currentValve}-${openedValves}-${timeRemaining}`;
    // if we've vistied this comination before, just return the value now.
    if (cache.get(cacheKey))
        return cache.get(cacheKey);
    let maxFlow = 0;
    // for valves with non-zero flow rate, try that valves.
    if (valveFlowData.get(currentValve) !== 0 &&
        !openedValves.includes(currentValve)) {
        // new opened valves array
        let newOpenedValves = [currentValve, ...openedValves];
        // calculate pressure
        let pressure = valveFlowData.get(currentValve) * (timeRemaining - 1);
        if (pressure !== 0) {
            // explore flow for states with this valve open.
            // calculate the max flow.
            // sort newOpenedValves to improve our cache.
            maxFlow = Math.max(maxFlow, pressure +
                getMaxFlow(currentValve, newOpenedValves.sort(), timeRemaining - 1));
        }
    }
    // regardless of whether we open the valve or not,
    // we want to check all neighboring valves too.
    // loop through all neightbors in the graph
    for (let nextValve of valveGraph.get(currentValve)) {
        // calculate max flow recursively and save max.
        maxFlow = Math.max(maxFlow, getMaxFlow(nextValve, openedValves, timeRemaining - 1));
    }
    // store max flow in cache
    cache.set(cacheKey, maxFlow);
    return maxFlow;
};
console.log(getMaxFlow("AA", [], 30));
//# sourceMappingURL=16.js.map