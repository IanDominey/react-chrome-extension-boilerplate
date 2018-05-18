const path = require('path');

module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      path.join(__dirname, '/__mocks__/fileMock.js'),
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  testMatch: ['**/test/**/e2e/**/*.js?(x)'],
  testEnvironment: 'enzyme',
  setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',

  // old versions of jest set the unmocks
  unmockedModulePathPatterns: [
    'react',
    'enzyme',
    'jest-enzyme'
  ]
};
