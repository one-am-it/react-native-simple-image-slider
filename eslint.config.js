// https://docs.expo.dev/guides/using-eslint/

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const typescriptParser = require('@typescript-eslint/parser');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
    // Global ignores (must be in a separate object)
    {
        ignores: [
            '.idea/',
            '**/node_modules/**',
            '**/.expo/**',
            '**/android/**',
            '**/ios/**',
            '**/babel.config.js',
            '**/assets/**',
            '**/eslint.config.js',
            '**/metro.config.js',
            '**/webpack.config.js',
            '**/App.js',
            'bin/**',
            '**/.yarn/**',
            'lib/**',
        ],
    },
    expoConfig,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-shadow': 'error',
            'complexity': ['warn', 10],
            'eqeqeq': 'error',
            'max-params': 'warn',
            'react/no-array-index-key': 'warn',
            'react/no-children-prop': 'warn',
            'react/jsx-no-bind': 'warn',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/exhaustive-deps': 'error',
            'import/extensions': [
                'error',
                'never',
                {
                    ts: 'never',
                    tsx: 'never',
                    jpg: 'always',
                    png: 'always',
                    json: 'always',
                },
            ],
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-default-export': 'off',
            'import/no-duplicates': 'error',
            'import/order': 'error',
            'import/export': 'error',
            'import/no-deprecated': 'error',
            'import/no-empty-named-blocks': 'error',
            'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
            'import/no-mutable-exports': 'error',
        },
    },
    // Disable import/no-extraneous-dependencies for example workspace
    // (it's test/development code only, uses workspace-linked packages)
    {
        files: ['example/**/*'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },
]);
