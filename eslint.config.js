import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

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
      ]
    }
  }
];
