#!/usr/bin/env node

const { readFile } = require('../utils/file');
const { expect } = require('../utils/test');

const cardToValue = (/** @type {string} */ card, /** @type {boolean} */ hasJokers = false) => {
  if (card === 'T') return 10;
  if (card === 'J') return hasJokers ? 1 : 11;
  if (card === 'Q') return 12;
  if (card === 'K') return 13;
  if (card === 'A') return 14;

  return parseInt(card, 10);
};

const hands = {
  fiveOfAKind: 7,
  fourOfAKind: 6,
  fullHouse: 5,
  threeOfAKind: 4,
  twoPairs: 3,
  onePair: 2,
  highCard: 1,
};

function getHandValue(/** @type {Array<number>} */ cards, /** @type {Number} */ jokersCount = 0) {
  const cardsGrouped = cards.reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {});

  const cardCounts = Object.values(cardsGrouped);

  if (cardCounts.length === 1) return hands.fiveOfAKind;

  // high card becomes one pair
  // only one joker; if 2 there is a pair
  if (cardCounts.length === 5) return jokersCount === 1 ? hands.onePair : hands.highCard;

  // one pair becomes three of a kind
  // either one or two jokers; if 3 there is three of a kind
  if (cardCounts.length === 4) return jokersCount ? hands.threeOfAKind : hands.onePair;

  const hasThreeOfAKind = cardCounts.includes(3);
  const hasTwoOfAKind = cardCounts.includes(2);

  // full house becomes five of a kind
  // either two or three jokers since full house is 3 + 2
  if (hasThreeOfAKind && hasTwoOfAKind) return jokersCount ? hands.fiveOfAKind : hands.fullHouse;
  // three of a kind becomes four of a kind
  // only one or three jokers; if 2 there is full house
  else if (hasThreeOfAKind) return jokersCount ? hands.fourOfAKind : hands.threeOfAKind;

  // two pairs becomes three of a kind or four of a kind
  // when one joker -> two pairs becomes three of a kind
  // when two jokers -> two pairs becomes four of a kind
  if (hasTwoOfAKind && cardCounts.length === 3) {
    if (!jokersCount) return hands.twoPairs;

    if (jokersCount === 1) return hands.fullHouse;
    if (jokersCount === 2) return hands.fourOfAKind;

    return hands.twoPairs;
  }

  // four of a kind becomes five of a kind
  // either one or four jokers since four of a kind is 4 + 1
  return jokersCount ? hands.fiveOfAKind : hands.fourOfAKind;
}

function solve(/** @type {Array.<string>} */ lines) {
  const games = lines.map((line) => {
    const [cards, bid] = line.split(/\s+/);

    const cardValues1 = cards.split('').map((card) => cardToValue(card));
    const cardValues2 = cards.split('').map((card) => cardToValue(card, true));

    return {
      bid: parseInt(bid, 10),
      rawCards: cards,
      cards1: cardValues1,
      handValue1: getHandValue(cardValues1),
      cards2: cardValues2,
      handValue2: getHandValue(cardValues2, cardValues2.filter((card) => card === 1).length),
    };
  });

  const sortedGames1 = [...games].sort((a, b) => {
    const aHand = a.handValue1;
    const bHand = b.handValue1;

    if (aHand === bHand) {
      for (let i = 0; i < a.cards1.length; i++) {
        if (a.cards1[i] === b.cards1[i]) continue;

        return a.cards1[i] - b.cards1[i];
      }
    }

    return aHand - bHand;
  });

  const sortedGames2 = [...games].sort((a, b) => {
    const aHand = a.handValue2;
    const bHand = b.handValue2;

    if (aHand === bHand) {
      for (let i = 0; i < a.cards2.length; i++) {
        if (a.cards2[i] === b.cards2[i]) continue;

        return a.cards2[i] - b.cards2[i];
      }
    }

    return aHand - bHand;
  });

  console.log(sortedGames2.map((game) => game.rawCards).join('\n'));

  return [
    sortedGames1.reduce((acc, game, index) => acc + game.bid * (index + 1), 0),
    sortedGames2.reduce((acc, game, index) => acc + game.bid * (index + 1), 0),
  ];
}

function main() {
  const lines = readFile('./day07/input.txt', 'utf8').split('\n');

  const [first, second] = solve(lines);

  console.log(`[${first}, ${second}]`);
}

function test() {
  const [first, second] = solve(readFile('./day07/test.txt', 'utf8').split('\n'));
  expect(first).toBe(6440);
  expect(second).toBe(5905);

  console.log('All tests passed!');
}

module.exports = {
  main,
  test,
};

// 252782748
// 252424923

// 250898830
