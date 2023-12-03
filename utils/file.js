const { readFileSync } = require('fs');

/**
 * @returns {string}
 */
function readFile(filePath) {
  return readFileSync(filePath, 'utf8');
}

module.exports = {
  readFile,
};
