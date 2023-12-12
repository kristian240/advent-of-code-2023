#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');
const { rSum, mInt } = require('../utils/helpers');

const createRegex = (/** @type {Array<number>} */ pattern) =>
  new RegExp(`^\\.*${pattern.map((num) => `#{${num}}`).join('\\.+')}\\.*$`);

function countArrangements(/** @type {string} */ line, /** @type {number} */ multiplier = 1) {
  const [_template, _patternRaw] = line.split(' ');
  const template = Array.from({ length: multiplier }, () => _template).join('?');
  const patternRaw = Array.from({ length: multiplier }, () => _patternRaw).join(',');

  const pattern = patternRaw.split(',').map(mInt);
  const regex = createRegex(pattern);

  const questionMarks = template.split('').filter((char) => char === '?').length;
  const combinations = 2 ** questionMarks;

  let arrangements = 0;
  for (let i = 0; i < combinations; i++) {
    const binary = i.toString(2).padStart(questionMarks, '0');
    let j = 0;
    const test = template.replace(/\?/g, () => (binary[j++] === '0' ? '.' : '#'));

    if (test.match(regex)) {
      arrangements++;
    }
  }

  return arrangements;
}

function solve(/** @type {Array.<string>} */ lines) {
  return [1, 5].map((multiplier) =>
    lines.map((line) => countArrangements(line, multiplier)).reduce(rSum, 0)
  );
}

function main() {
  const lines = readFile('./day12/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day12/test.txt', 'utf8').split('\n'));
  console.log(`[${first}, ${second}]`);
  expect(first).toBe(21);
  expect(second).toBe(525152);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
