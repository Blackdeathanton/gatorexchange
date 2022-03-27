module.exports = {
  testPathIgnorePatterns: ["front-end/cypress"],
  "moduleNameMapper": {
    "\\.(css|scss|less|sass)$": 'front-end/jest/styleMock.js'
  }
}