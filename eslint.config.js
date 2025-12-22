import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import eslintComments from 'eslint-plugin-eslint-comments'
import globals from 'globals'

export default [
    js.configs.recommended,
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'dev/**',
            'tsup.config.ts',
            'vitest.config.ts',
            'app/**',
        ],
    },
    {
        files: ['src/**/*.{js,ts,tsx,jsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'no-only-tests': noOnlyTests,
            'eslint-comments': eslintComments,
        },
        rules: {
            'prefer-const': 'warn',
            'no-console': 'warn',
            'no-debugger': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/no-useless-empty-export': 'warn',
            'no-only-tests/no-only-tests': 'warn',
            'eslint-comments/no-unused-disable': 'warn',
        },
    },
]
