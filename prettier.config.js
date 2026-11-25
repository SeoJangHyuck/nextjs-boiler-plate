/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  // 프로젝트 테마(@theme) 기준으로 클래스를 정렬한다.
  tailwindStylesheet: './src/styles/tailwind.css',
  tailwindFunctions: ['cn', 'clsx'],
};

export default config;
