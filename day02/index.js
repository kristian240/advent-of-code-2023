const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const debug = 0;

const colors = ['red', 'green', 'blue'];
const maxColors = [12, 13, 14];

function solve(/** @type {string} */ lines) {
  const invalidGames = new Set();
  let sum1 = 0;
  let sum2 = 0;

  for (const line of lines) {
    const gameInfo = line.match(/Game (\d+): (.+)/);

    if (!gameInfo) throw new Error(`Invalid game line: ${line}`);

    const gameNumber = parseInt(gameInfo[1]);
    const sets = gameInfo[2].split(';').map((game) => game.trim().split(', '));

    const used = [0, 0, 0];

    if (debug) {
      console.log({
        gameNumber,
      });
    }

    for (const set of sets) {
      if (debug) {
        console.log({
          set,
        });
      }

      for (const color of set) {
        const [num, col] = color.split(' ');
        const index = colors.indexOf(col);

        if (index === -1) throw new Error(`Invalid color: ${col}`);

        if (debug) {
          console.log({
            color,
          });
        }

        if (+num > maxColors[index]) {
          if (debug) {
            console.log('Invalid game:', gameNumber);
          }

          invalidGames.add(gameNumber);
        }

        if (used[index] < +num) {
          used[index] = +num;
        }
      }
    }

    if (debug) {
      console.log({
        used,
      });
    }

    sum2 += used.reduce((acc, curr) => acc * curr);

    if (invalidGames.has(gameNumber)) continue;

    if (debug) {
      console.log('Possible game:', gameNumber);
    }

    sum1 += gameNumber;
  }

  return [sum1, sum2];
}

function main() {
  const lines = readFile('./day02/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day02/test.txt', 'utf8').split('\n'));
  expect(first).toBe(8);
  expect(second).toBe(2286);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
