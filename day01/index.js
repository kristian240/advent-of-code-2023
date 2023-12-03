#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function preprocess(/** @type {Array.<string>} */ line) {
  let newLine = '';

  for (let i = 0; i < line.length; i++) {
    const segment = line.slice(i);

    let added = false;
    for (const number of numbers) {
      if (segment.startsWith(number)) {
        newLine += numbers.indexOf(number) + 1;
        added = true;
        break;
      }
    }

    if (added) continue;

    newLine += segment[0];
  }

  return newLine;
}

function solve(/** @type {Array.<string>} */ lines) {
  return lines
    .map((line) => {
      const digits = line.match(/\d/g);

      return parseInt(digits[0], 10) * 10 + parseInt(digits.at(-1), 10);
    })
    .reduce((acc, curr) => acc + curr);
}

function main() {
  const lines = readFile('./day01/input.txt', 'utf8').split('\n');

  const first = solve(lines);
  const second = solve(lines.map(preprocess));

  console.log(`[${first}, ${second}]`);
}

function test() {
  const first = solve(readFile('./day01/test-1.txt', 'utf8').split('\n'));
  expect(first).toBe(142);

  const second = solve(readFile('./day01/test-2.txt', 'utf8').split('\n').map(preprocess));
  expect(second).toBe(281);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
