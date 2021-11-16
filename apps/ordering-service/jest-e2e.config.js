module.exports = {
  displayName: 'ordering-service',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  testMatch: ['**/e2e/**/*.(e2e-test|e2e-spec).(ts|tsx|js)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
};
