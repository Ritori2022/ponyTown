// ESLint 9 Flat Config Format
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
	{
		ignores: [
			'build/**',
			'dist/**',
			'node_modules/**',
			'src/scripts/**',
			'**/*.js',
			'!eslint.config.js',
		],
	},
	{
		files: ['src/ts/**/*.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},
		rules: {
			// TypeScript specific rules
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'warn',

			// General rules
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'no-eval': 'error',
			'eqeqeq': ['error', 'allow-null'],
			'semi': ['error', 'always'],
			'quotes': ['error', 'single', { avoidEscape: true }],
			'indent': ['error', 'tab'],
			'max-len': ['warn', { code: 130 }],
			'no-trailing-spaces': 'error',
			'eol-last': 'error',
		},
	},
];
