#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const findMarginOfError = (/** @type {number} */ time, /** @type {number} */ distance) => {
  /*
    x * (time - x) > distance
    time*x - x^2 > distance
    x^2 - time*x + distance < 0
    x = (time +- sqrt(time^2 - 4*distance)) / 2
  */

  let x1 = (time + Math.sqrt(time ** 2 - 4 * distance)) / 2;
  x1 = Math.floor(x1) === x1 ? x1 - 1 : Math.floor(x1);
  let x2 = (time - Math.sqrt(time ** 2 - 4 * distance)) / 2;
  x2 = Math.ceil(x2) === x2 ? x2 + 1 : Math.ceil(x2);

  return x1 - x2 + 1;
};

function getSolution(/** @type {Array<number>} */ times, /** @type {Array<number>} */ distances) {
  let product = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];

    product *= findMarginOfError(time, distance);
  }

  return product;
}

function solve(/** @type {Array.<string>} */ lines) {
  const timeString = lines[0].replace('Time:', '').trim().split(/\s+/);
  const distanceString = lines[1].replace('Distance:', '').trim().split(/\s+/);

  const task1 = getSolution(
    timeString.map((n) => parseInt(n, 10)),
    distanceString.map((n) => parseInt(n, 10))
  );

  const task2 = getSolution(
    [parseInt(timeString.join(''), 10)],
    [parseInt(distanceString.join(''), 10)]
  );

  return [task1, task2];
}

function main() {
  const lines = readFile('./day06/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day06/test.txt', 'utf8').split('\n'));
  expect(first).toBe(288);
  expect(second).toBe(71503);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
