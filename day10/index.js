#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const start = 'S';
const ground = '.';
const pipes = {
  h: '-',
  v: '|',
  tl: 'F',
  tr: '7',
  br: 'J',
  bl: 'L',
};

function getPipeLength(
  /** @type {Array<string>} */ lines,
  /** @type {Number} */ x,
  /** @type {Number} */ y
) {
  let currX = x;
  let currY = y;
  let current = lines[currY][currX];
  let prevX = currX;
  let prevY = currY;
  let pipeLength = 0;

  const isLoop = [];
  function setIsLoop(/** @type {Number} */ x, /** @type {Number} */ y) {
    if (!isLoop[y]) isLoop[y] = [];
    isLoop[y][x] = true;
  }

  setIsLoop(currX, currY);

  const setX = (/** @type {Number} */ x) => {
    prevX = currX;
    prevY = currY;
    currX = x;

    setIsLoop(currX, currY);
  };

  const setY = (/** @type {Number} */ y) => {
    prevX = currX;
    prevY = currY;
    currY = y;

    setIsLoop(currX, currY);
  };

  do {
    if (current === start) {
      if ([pipes.h, pipes.br, pipes.tr].includes(lines[currY][currX + 1])) setX(currX + 1);
      else if ([pipes.h, pipes.bl, pipes.tl].includes(lines[currY][currX - 1])) setX(currX - 1);
      else if ([pipes.v, pipes.tr, pipes.tl].includes(lines[currY + 1][currX])) setY(currY + 1);
      else if ([pipes.v, pipes.br, pipes.bl].includes(lines[currY - 1][currX])) setY(currY - 1);
    } else {
      if (current === pipes.h) setX(prevX < currX ? currX + 1 : currX - 1);
      else if (current === pipes.v) setY(prevY < currY ? currY + 1 : currY - 1);
      else if (current === pipes.tl && prevX === currX) setX(currX + 1);
      else if (current === pipes.tl && prevY === currY) setY(currY + 1);
      else if (current === pipes.tr && prevX === currX) setX(currX - 1);
      else if (current === pipes.tr && prevY === currY) setY(currY + 1);
      else if (current === pipes.br && prevX === currX) setX(currX - 1);
      else if (current === pipes.br && prevY === currY) setY(currY - 1);
      else if (current === pipes.bl && prevX === currX) setX(currX + 1);
      else if (current === pipes.bl && prevY === currY) setY(currY - 1);
    }
    pipeLength++;
    current = lines[currY][currX];
  } while (current !== start);

  return [pipeLength, isLoop];
}

function solve(/** @type {Array<string>} */ lines) {
  let y = lines.findIndex((line) => line.includes(start));
  let x = lines[y].indexOf(start);

  const [pipeLength, isLoopMap] = getPipeLength(lines, x, y);

  let innerDots = 0;
  for (let i = 0; i < isLoopMap.length; i++) {
    if (!isLoopMap[i]) continue;

    let isInside = false;
    let stack = [];
    for (let j = 0; j < isLoopMap[i].length; j++) {
      if (!isLoopMap[i][j] && isInside) {
        innerDots++;
        continue;
      }

      let curr = lines[i].at(j);
      if (curr === start) {
        if (isLoopMap[i]?.[j + 1] && isLoopMap[i]?.[j - 1]) curr = pipes.h;
        else if (isLoopMap[i + 1]?.[j] && isLoopMap[i - 1]?.[j]) curr = pipes.v;
        else if (isLoopMap[i]?.[j + 1] && isLoopMap[i + 1]?.[j]) curr = pipes.tl;
        else if (isLoopMap[i]?.[j + 1] && isLoopMap[i - 1]?.[j]) curr = pipes.bl;
        else if (isLoopMap[i]?.[j - 1] && isLoopMap[i + 1]?.[j]) curr = pipes.tr;
        else if (isLoopMap[i]?.[j - 1] && isLoopMap[i - 1]?.[j]) curr = pipes.br;
      }

      if (!isLoopMap[i][j]) continue;
      if (curr === pipes.h) continue;

      if (curr === pipes.v) {
        stack = [];
        isInside = !isInside;
      } else if (curr === pipes.tl || curr === pipes.bl) {
        stack.push(curr);
        isInside = !isInside;
      } else {
        const prev = stack.pop();
        if (prev === pipes.tl && curr === pipes.tr) isInside = !isInside;
        else if (prev === pipes.bl && curr === pipes.br) isInside = !isInside;
        else stack.push(prev);
      }
    }
  }

  return [pipeLength / 2, innerDots];
}

function main() {
  const lines = readFile('./day10/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first1, second1] = solve(readFile('./day10/test-1.txt', 'utf8').split('\n'));
  expect(first1).toBe(4);
  expect(second1).toBe(1);

  const [first2, second2] = solve(readFile('./day10/test-2.txt', 'utf8').split('\n'));
  expect(first2).toBe(8);
  expect(second2).toBe(1);

  const [, second3] = solve(readFile('./day10/test-3.txt', 'utf8').split('\n'));
  expect(second3).toBe(4);

  const [, second4] = solve(readFile('./day10/test-4.txt', 'utf8').split('\n'));
  expect(second4).toBe(4);

  const [, second5] = solve(readFile('./day10/test-5.txt', 'utf8').split('\n'));
  expect(second5).toBe(8);

  const [, second6] = solve(readFile('./day10/test-6.txt', 'utf8').split('\n'));
  expect(second6).toBe(10);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
