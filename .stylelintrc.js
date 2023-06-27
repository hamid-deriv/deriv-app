module.exports = {
    extends: ['stylelint-config-hudochenkov/full', 'stylelint-config-standard-scss'],
    ignoreFiles: ['packages/*/dist/**/*.css'],
    plugins: ['stylelint-no-unsupported-browser-features', 'stylelint-selector-bem-pattern'],
    rules: {
        // 'at-rule-name-space-after': 'always',
        'color-named': 'never',
        'color-no-invalid-hex': true,
        // 'declaration-bang-space-after': 'never',
        // 'declaration-bang-space-before': 'always',
        'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates'] }],
        'declaration-block-no-shorthand-property-overrides': true,
        'font-family-name-quotes': 'always-unless-keyword',
        'function-calc-no-unspaced-operator': true,
        'function-name-case': 'lower',
        'function-url-quotes': 'always',
        // 'media-feature-colon-space-after': 'always',
        // 'media-feature-colon-space-before': 'never',
        // 'media-feature-range-operator-space-after': 'always',
        // 'media-feature-range-operator-space-before': 'always',
        'no-duplicate-selectors': true,
        'no-invalid-double-slash-comments': true,
        'number-max-precision': 3,
        // 'selector-attribute-brackets-space-inside': 'never',
        // 'selector-attribute-operator-space-after': 'never',
        // 'selector-attribute-operator-space-before': 'never',
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['export'] }],
        // 'selector-pseudo-class-parentheses-space-inside': 'never',
        'selector-pseudo-element-colon-notation': 'single',
        'selector-pseudo-element-no-unknown': true,
        'selector-type-case': 'lower',
        'selector-max-type': [0, { ignore: ['child', 'descendant', 'compounded'] }],
        'selector-type-no-unknown': [true, { ignoreTypes: ['from', 'to', '0%', '50%', '100%', '_'] }],
        'shorthand-property-no-redundant-values': true,
        'string-no-newline': true,
        'time-min-milliseconds': 100,
        'unit-allowed-list': ['fr', 'px', 'em', 'rem', '%', 'vw', 'vh', 'deg', 'ms', 's', 'dpcm'],
        'value-keyword-case': 'lower',

        // Temporary disabled rules because of the dirty styles
        'selector-class-pattern': null,
        'declaration-no-important': null,
        'no-descending-specificity': null,
        'scss/dollar-variable-pattern': null,
        'selector-max-type': null,
        'keyframes-name-pattern': null,
        'no-unknown-animations': null,
        'selector-no-qualifying-type': [true, { ignore: ["attribute", "class", "id"] }]

        // Plugins Config

        // This rule is commented because current styles are not followed by BEM methodology
        // 'plugin/selector-bem-pattern': {
        //     preset: 'bem',
        // },
    },
};
