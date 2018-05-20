const path = require('path');

const extPath = path.resolve('build');

module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      path.join(__dirname, '/__mocks__/fileMock.js'),
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jest-environment-selenium',
  testEnvironmentOptions: {
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: [`load-extension=${extPath}`]
      }
    }
  },
  testMatch: ['**/test/**/e2e/**/*.js?(x)']
};
