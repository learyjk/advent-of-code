"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let fs = [];
// add the root directory, which is always present
// note I deleted the first line of input.txt
fs.push({ type: "dir", name: "/", children: [], parent: null });
let root = fs[0];
// Open the file and read its contents
const file = (0, fs_1.readFileSync)("day-7/input.txt", "utf8");
// Split the data into rows
const rows = file.split("\n");
const traverse = (dir, inputLineNumber) => {
    if (!rows[inputLineNumber])
        return;
    let [first, second, third] = rows[inputLineNumber].split(" ");
    if (!isNaN(parseInt(first, 10))) {
        // type is file
        dir.children.push({
            type: "file",
            size: parseInt(first, 10),
            name: second,
            children: null,
            parent: dir,
        });
        traverse(dir, inputLineNumber + 1);
    }
    else if (first === "dir") {
        // type is dir
        dir.children.push({ type: "dir", name: second, children: [], parent: dir });
        traverse(dir, inputLineNumber + 1);
    }
    else if (first === "$" && second === "cd" && third !== "..") {
        let newDir = dir.children.find((child) => child.name === third);
        traverse(newDir, inputLineNumber + 1);
    }
    else if (first === "$" && second === "cd" && third === "..") {
        let newDir = dir.parent;
        traverse(newDir, inputLineNumber + 1);
    }
    else {
        traverse(dir, inputLineNumber + 1);
    }
};
traverse(root, 0);
// get size of a single directory
const getDirectorSize = (dir) => {
    let size = 0;
    if (dir.type === "file") {
        return dir.size;
    }
    else {
        for (let child of dir.children) {
            size += getDirectorSize(child);
        }
    }
    return size;
};
// use directory size to get a map of directoires with size < 100000
const getDirectoriesWithSizeLessThan = (size) => {
    let dirs = [];
    // traverse the fs tree
    const traverse = (dir) => {
        if (dir.type === "dir") {
            let dirSize = getDirectorSize(dir);
            if (dirSize < size) {
                dir.size = dirSize;
                dirs.push(dir);
            }
            for (let child of dir.children) {
                traverse(child);
            }
        }
    };
    traverse(root);
    return dirs;
};
// Solve
const dirsLessThan100000 = getDirectoriesWithSizeLessThan(100000);
//sum the sizes of the directories
const sumOfDirsLessThan100000 = dirsLessThan100000.reduce((acc, dir) => acc + dir.size, 0);
console.log({ sumOfDirsLessThan100000 });
// PART TWO
// Define the constants
const DISK_SPACE = 70000000;
const UNUSED_SPACE_NEEDED = 30000000;
const ununsedSpace = DISK_SPACE - getDirectorSize(root);
const delta = UNUSED_SPACE_NEEDED - ununsedSpace;
console.log({ delta });
// generic function to get dirs with size > size
const dirsGreaterThan = (size) => {
    let dirs = [];
    // traverse the fs tree
    const traverse = (dir) => {
        if (dir.type === "dir") {
            let dirSize = getDirectorSize(dir);
            if (dirSize > size) {
                dir.size = dirSize;
                dirs.push(dir);
            }
            for (let child of dir.children) {
                traverse(child);
            }
        }
    };
    traverse(root);
    return dirs;
};
// get all dirs with size > delta
const dirsGreaterThanDelta = dirsGreaterThan(delta);
// find the dir in the dirsGreaterThanDelta with the smallest size
const dirWithSmallestSize = dirsGreaterThanDelta.reduce((acc, dir) => {
    if (dir.size < acc.size) {
        return dir;
    }
    return acc;
}, { size: Infinity });
const sizeOfSmallestDirWithSizeGreaterThanDelta = dirWithSmallestSize.size;
console.log({ sizeOfSmallestDirWithSizeGreaterThanDelta });
//# sourceMappingURL=day-7.js.map