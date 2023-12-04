#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const debug = 0;

function solve(/** @type {Array.<string>} */ lines) {
  let sum1 = 0;
  const scratchcardCounts = {};

  for (const line of lines) {
    const result = line.match(
      /^Card\s+(?<cardId>\d+):\s*(?<winningNumbers>(\d+\s+)+(\d+))\s*\|\s*(?<myNumbers>(\d+\s+)+(\d+))\s*$/
    );

    if (!result) {
      throw new Error(`Invalid line: ${line}`);
    }

    console.log(result.groups);

    const cardId = parseInt(result.groups.cardId, 10);
    const winningNumbers = result.groups.winningNumbers.split(/\s+/).map((n) => parseInt(n, 10));
    const myNumbers = result.groups.myNumbers.split(/\s+/).map((n) => parseInt(n, 10));

    if (debug) {
      console.log({
        cardId,
        winningNumbers,
        myNumbers,
      });
    }

    let cardValue1 = 0;
    let cardValue2 = 0;
    for (const myNumber of myNumbers) {
      if (winningNumbers.includes(myNumber)) {
        cardValue1 = cardValue1 === 0 ? 1 : cardValue1 * 2;
        cardValue2++;
      }
    }
    sum1 += cardValue1;

    console.log({
      cardValue1,
      cardValue2,
    });

    if (!scratchcardCounts[cardId]) {
      scratchcardCounts[cardId] = 0;
    }

    scratchcardCounts[cardId] += 1;
    Array.from({ length: cardValue2 }, (_, i) => i + 1).forEach((n) => {
      if (!scratchcardCounts[cardId + n]) {
        scratchcardCounts[cardId + n] = 0;
      }

      scratchcardCounts[cardId + n] += scratchcardCounts[cardId];
    });

    console.log({
      scratchcardCounts,
    });
  }

  return [sum1, Object.values(scratchcardCounts).reduce((acc, curr) => acc + curr)];
}

function main() {
  const lines = readFile('./day04/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day04/test.txt', 'utf8').split('\n'));
  expect(first).toBe(13);
  expect(second).toBe(30);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
