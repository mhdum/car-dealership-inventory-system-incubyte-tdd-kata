module.exports = {
  testEnvironment: 'node',

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  clearMocks: true,
};