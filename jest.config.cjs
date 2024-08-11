module.exports = {
  testEnvironment: "node",
  testTimeout: 10000,
  testSequencer: "./__tests__/customSequencer.cjs",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.mjs"],
  detectOpenHandles: true,
  verbose: true,
  transform: {
    '^.+\\.m?[tj]s$': 'babel-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
