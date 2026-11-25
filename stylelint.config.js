/** @type {import('stylelint').Config} */
const config = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    // BEM pattern for class names
    // &__element, &--modifier까지 검사하도록 SCSS 전용 규칙을 쓴다.
    'selector-class-pattern': null,
    'scss/selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$',
      {
        resolveNestedSelectors: true,
        message: 'Class names should follow BEM pattern',
      },
    ],

    // Property order - alphabetical
    'order/properties-alphabetical-order': true,

    // CSS Modules 문법
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],

    // Max nesting depth
    'max-nesting-depth': 3,

    // No !important
    'declaration-no-important': true,

    // No ID selectors
    'selector-max-id': 0,

    // SCSS specific
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',

    // Tailwind CSS v4 at-rules
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'reference',
          'config',
          'plugin',
        ],
      },
    ],
  },
};

export default config;
