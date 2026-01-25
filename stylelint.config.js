/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    // BEM pattern for class names
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$',
      {
        message: 'Class names should follow BEM pattern',
      },
    ],

    // Property order - alphabetical
    'order/properties-alphabetical-order': true,

    // Max nesting depth
    'max-nesting-depth': 3,

    // No !important
    'declaration-no-important': true,

    // No ID selectors
    'selector-max-id': 0,

    // SCSS specific
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
  },
};
