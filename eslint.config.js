import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'node_modules', 'coverage', 'test-results', 'playwright-report', '.superpowers', 'public/vendor'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      // Un `catch {}` vacío traga errores en silencio: pedir al menos un comentario.
      'no-empty': ['error', { allowEmptyCatch: false }],
      // El barajado va con Fisher-Yates (CLAUDE.md §12), nunca con sort aleatorio.
      'no-restricted-syntax': ['error', {
        selector: "CallExpression[callee.property.name='sort'] > ArrowFunctionExpression[body.type='BinaryExpression'] CallExpression[callee.object.name='Math'][callee.property.name='random']",
        message: 'sort(() => Math.random() - 0.5) no baraja: usar Fisher-Yates.',
      }],
      // Nada de innerHTML con datos: textContent o un helper que escape (CLAUDE.md §5).
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
  {
    // El service worker corre en otro entorno global.
    files: ['public/sw.js'],
    languageOptions: { globals: { ...globals.serviceworker } },
  },
)
