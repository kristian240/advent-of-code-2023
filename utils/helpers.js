function rSum(a, b) {
  return a + b;
}

function allEqual(array, value = array[0]) {
  return array.every((item) => item === value);
}

function mInt(num) {
  return parseInt(num, 10);
}

module.exports = {
  allEqual,
  mInt,
  rSum,
};
