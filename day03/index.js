#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const debug = 0;

function isDigit(/** @type {string} */ char) {
  return !isNaN(parseInt(char, 10));
}

function isSymbol(/** @type {string} */ char) {
  if (char === '.') return false;

  return !isDigit(char, 10);
}

function getNumber(
  /** @type {string} */ line,
  /** @type {number} */ index,
  { toLeft = true, toRight = true } = {}
) {
  let number = line[index];

  if (toRight) {
    for (let i = index + 1; i < line.length; i++) {
      const char = line[i];

      if (!isDigit(char)) {
        break;
      }

      number += char;
    }
  }

  if (toLeft) {
    for (let i = index - 1; i >= 0; i--) {
      const char = line[i];

      if (!isDigit(char)) {
        break;
      }

      number = char + number;
    }
  }

  return +number;
}

function checkSidesForNumbers(/** @type {Array} */ line, /** @type {number} */ index) {
  const numbers = [];

  if (isDigit(line[index])) {
    numbers.push(getNumber(line, index));
  } else {
    // left
    if (isDigit(line[index - 1])) {
      numbers.push(getNumber(line, index - 1, { toRight: false }));
    }

    // right
    if (isDigit(line[index + 1])) {
      numbers.push(getNumber(line, index + 1, { toLeft: false }));
    }
  }

  return numbers;
}

function solve(/** @type {Array.<string>} */ lines) {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      if (!isSymbol(line[j])) continue;

      let gearRatioParts = [];

      if (i !== 0) {
        const topNumbers = checkSidesForNumbers(lines[i - 1], j);
        sum1 += topNumbers.reduce((acc, curr) => acc + curr, 0);
        gearRatioParts.push(...topNumbers);

        if (debug) {
          console.log('top numbers', topNumbers);
        }
      }

      if (i !== lines.length - 1) {
        const bottomNumbers = checkSidesForNumbers(lines[i + 1], j);
        sum1 += bottomNumbers.reduce((acc, curr) => acc + curr, 0);
        gearRatioParts.push(...bottomNumbers);

        if (debug) {
          console.log('bottom numbers', bottomNumbers);
        }
      }

      {
        const sideNumbers = checkSidesForNumbers(line, j);
        sum1 += sideNumbers.reduce((acc, curr) => acc + curr, 0);
        gearRatioParts.push(...sideNumbers);

        if (debug) {
          console.log('side numbers', sideNumbers);
        }
      }

      if (debug) {
        console.log('gear ratio parts', gearRatioParts);
      }

      if (gearRatioParts.length > 1) {
        sum2 += gearRatioParts.reduce((acc, curr) => acc * curr);
      }
    }
  }

  return [sum1, sum2];
}

function main() {
  const lines = readFile('./day03/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day03/test.txt', 'utf8').split('\n'));
  expect(first).toBe(4361);
  expect(second).toBe(467835);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
