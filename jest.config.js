module.exports = {
	moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testPathIgnorePatterns: [
        '<rootDir>/test/setup.js',
    ],
	testRegex: 'test/.*\\.test\\.js$',
};
