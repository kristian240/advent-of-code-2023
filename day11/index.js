#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');
const { rSum } = require('../utils/helpers');

function getDistanceArray(
  /** @type {Array} */ coords,
  /** @type {Array} */ emptyRows,
  /** @type {Array} */ emptyCols,
  /** @type {number} */ multiplier = 1
) {
  const distances = coords.reduce((acc, [rowIndex, colIndex], index, self) => {
    const distances = self.slice(index + 1).map(([row, col]) => {
      const emptyColOffset = emptyCols.filter((emptyCol) =>
        col > colIndex
          ? emptyCol < col && emptyCol > colIndex
          : emptyCol > col && emptyCol < colIndex
      ).length;

      const emptyRowOffset = emptyRows.filter((emptyRow) =>
        row > rowIndex
          ? emptyRow < row && emptyRow > rowIndex
          : emptyRow > row && emptyRow < rowIndex
      ).length;

      return (
        Math.abs(row - rowIndex) +
        Math.abs(col - colIndex) +
        (emptyColOffset + emptyRowOffset) * Math.max(multiplier - 1, 1)
      );
    });

    if (distances.length) acc.push(distances);

    return acc;
  }, []);

  return distances;
}

function getDistanceSum(/** @type {Array} */ distances) {
  return distances.reduce((acc, distancesForPoint) => acc + distancesForPoint.reduce(rSum, 0), 0);
}

function solve(/** @type {Array.<string>} */ lines) {
  const emptyRows = [];

  const galaxyMap = lines.reduce((acc, line, index) => {
    const lineChars = line.split('');

    acc.push(lineChars);
    if (!line.includes('#')) emptyRows.push(index);

    return acc;
  }, []);

  // for every column that contains only ".", duplicate it
  const emptyCols = galaxyMap[0]
    .map((_, colIndex) => {
      const col = galaxyMap.map((line) => line[colIndex]).join('');
      return col.includes('#') ? null : colIndex;
    })
    .filter((item) => item !== null);

  const galaxyCoords = galaxyMap.reduce((acc, line, rowIndex) => {
    acc.push(
      ...line
        .map((char, colIndex) => (char === '#' ? [rowIndex, colIndex] : null))
        .filter((item) => item !== null)
    );

    return acc;
  }, []);

  return [1, 10, 100, 1_000_000].map((multiplier) =>
    getDistanceSum(getDistanceArray(galaxyCoords, emptyRows, emptyCols, multiplier))
  );
}

function main() {
  const lines = readFile('./day11/input.txt', 'utf8').split('\n');

  const [first, , , second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second, third] = solve(readFile('./day11/test.txt', 'utf8').split('\n'));
  expect(first).toBe(374);
  expect(second).toBe(1030);
  expect(third).toBe(8410);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};
