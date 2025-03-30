import globals from "globals";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  // Use the recommended configuration
  eslintPluginUnicorn.configs.recommended,
  
  // Add your custom configuration
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      'unused-imports': unusedImports
    },
    // Override specific rules if needed
    rules: {
      // Example: disable specific rules that might be too strict for your project
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: [String.raw`^[A-Z]+\.tsx$`]
        }
      ],
      // Turn off the base rule as it can report incorrect errors
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Remove unused imports
      'unused-imports/no-unused-imports': 'error',
      // Report unused variables but with better pattern handling
      'unused-imports/no-unused-vars': [
        'warn',
        { 
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
];
