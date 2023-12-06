#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const getNumbersFromLine = (/** @type {string} */ line) => {
  return line
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n, 10));
};

const isInRange = (
  /** @type {number} */ value,
  /** @type {number} */ min,
  /** @type {number} */ max
) => {
  return value >= min && value <= max;
};

const createReverseMapper = (
  /** @type {Array<{source: number, destination: number, range: number}>} */ mappings
) => {
  return (/** @type {number} */ input) => {
    const mapping = mappings.find((line) =>
      isInRange(input, line.destination, line.destination + line.range - 1)
    );

    if (!mapping) {
      return input;
    }

    return mapping.source + (input - mapping.destination);
  };
};

const isValidSeedTask2 = (/** @type {number} */ seed, /** @type {Array<number>} */ seeds) => {
  for (let i = 0; i < seeds.length; i += 2) {
    if (isInRange(seed, seeds[i], seeds[i] + seeds[i + 1] - 1)) return true;
  }

  return false;
};

function solve(/** @type {Array.<string>} */ lines) {
  const [seedsGroup, ...mappersGroup] = lines.join('\n').split('\n\n');

  const reverseMappers = mappersGroup.map((group) => {
    const lines = group
      .split('\n')
      .slice(1)
      .map(getNumbersFromLine)
      .map((numbers) => ({ source: numbers[1], destination: numbers[0], range: numbers[2] }));

    return createReverseMapper(lines);
  });

  const seeds = getNumbersFromLine(seedsGroup.replace('seeds:', ''));

  let i = 0;
  let task1 = null;
  let task2 = null;
  while (task1 === null || task2 === null) {
    const possibleSolution = reverseMappers.reduceRight((acc, mapper) => mapper(acc), i);

    if (!task1 && seeds.includes(possibleSolution)) {
      task1 = i;
    }

    if (!task2 && isValidSeedTask2(possibleSolution, seeds)) {
      task2 = i;
    }

    i++;
  }

  return [task1, task2];
}

function main() {
  const lines = readFile('./day05/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day05/test.txt', 'utf8').split('\n'));
  expect(first).toBe(35);
  expect(second).toBe(46);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
