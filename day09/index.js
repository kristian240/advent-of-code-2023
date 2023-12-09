#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');
const { rSum, allEqual, mInt } = require('../utils/helpers');

function getHistory(sequence) {
  if (allEqual(sequence)) return [sequence[0]];

  const nextSequence = sequence.reduce((acc, value, index, self) => {
    if (index === 0) return acc;

    return [...acc, value - self[index - 1]];
  }, []);

  const [last, first = last] = getHistory(nextSequence);

  return [sequence.at(-1) + last, sequence[0] - first];
}

function solve(/** @type {Array.<string>} */ lines) {
  const histories = lines.map((line) => getHistory(line.split(/\s+/).map(mInt)));

  return [histories.map((h) => h[0]).reduce(rSum), histories.map((h) => h[1]).reduce(rSum)];
}

function main() {
  const lines = readFile('./day09/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day09/test.txt', 'utf8').split('\n'));
  expect(first).toBe(114);
  expect(second).toBe(2);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
