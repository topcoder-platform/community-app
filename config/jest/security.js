module.exports = {
  rootDir: '../..',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/security'],
  testMatch: ['<rootDir>/tests/security/*.test.js'],
  transform: {
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      presets: [['@babel/preset-env', { targets: { node: '24' } }]],
    }],
  },
};
