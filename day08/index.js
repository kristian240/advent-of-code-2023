#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

function parseLines(/** @type {Array<string>} */ lines) {
  const [sequence, , ...network] = lines;

  const networkMap = network.reduce((acc, line) => {
    const match = line.match(
      /^(?<from>[0-9A-Z]{3}) = \((?<toLeft>[0-9A-Z]{3}), (?<toRight>[0-9A-Z]{3})\)$/
    );

    if (!match) throw new Error(`Invalid line: ${line}`);

    acc[match.groups.from] = {
      L: match.groups.toLeft,
      R: match.groups.toRight,
    };

    return acc;
  }, {});

  return [sequence, networkMap];
}

function greatestCommonDivisor(a, b) {
  if (b) return greatestCommonDivisor(b, a % b);
  return a;
}

function leastCommonMultiple(a, b) {
  return (a * b) / greatestCommonDivisor(a, b);
}

function followPath(
  /** @type {string} */ start,
  /** @type {string} */ sequence,
  /** @type {Object} */ networkMap
) {
  let position = start;
  let steps = 0;
  while (position[2] !== 'Z') {
    position = networkMap[position][sequence[steps % sequence.length]];
    steps++;
  }

  return steps;
}

function followPaths(
  /** @type {Array<string>} */ starts,
  /** @type {string} */ sequence,
  /** @type {Object} */ networkMap
) {
  const steps = starts.map((start, index) => {
    const step = followPath(start, sequence, networkMap);

    return step;
  });

  return steps.reduce((acc, step) => leastCommonMultiple(acc, step));
}

function solve1(/** @type {Array.<string>} */ lines) {
  const [sequence, networkMap] = parseLines(lines);

  return followPath('AAA', sequence, networkMap);
}

function solve2(/** @type {Array.<string>} */ lines) {
  const [sequence, networkMap] = parseLines(lines);

  const startPositions = Object.keys(networkMap).filter((pos) => pos.endsWith('A'));

  return followPaths(startPositions, sequence, networkMap);
}

function solve(/** @type {Array<string>} */ lines) {
  return [solve1(lines), solve2(lines)];
}

function main() {
  const lines = readFile('./day08/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const test1 = solve2(readFile('./day08/test-1.txt', 'utf8').split('\n'));
  expect(test1).toBe(2);

  const test2 = solve2(readFile('./day08/test-2.txt', 'utf8').split('\n'));
  expect(test2).toBe(6);

  const test3 = solve2(readFile('./day08/test-3.txt', 'utf8').split('\n'));
  expect(test3).toBe(6);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};

// 252782748
// 252424923

// 250898830
