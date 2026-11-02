// Retain the existing style policy with maintained stylelint and stylistic rules.
const stylelint = require('stylelint');
const standard = require('stylelint-config-standard');
const recommended = require('stylelint-config-recommended');
const stylistic = require('@stylistic/stylelint-plugin').default;
const stylisticRules = new Set(stylistic.map(plugin => plugin.ruleName));
const originalRules = { ...recommended.rules, ...standard.rules, ...{
  "at-rule-no-unknown": [
    true,
    {
      "ignoreAtRules": [
        "content",
        "extend",
        "for",
        "include",
        "mixin"
      ]
    }
  ],
  "selector-pseudo-class-no-unknown": [
    true,
    {
      "ignorePseudoClasses": [
        "global"
      ]
    }
  ]
} };
const rules = {};
Object.entries(originalRules).forEach(([name, options]) => {
  const target = stylelint.rules[name] ? name : `@stylistic/${name}`;
  if (!stylelint.rules[name] && !stylisticRules.has(target)) {
    throw new Error(`No replacement for legacy stylelint rule: ${name}`);
  }
  rules[target] = options;
});
module.exports = { plugins: ['@stylistic/stylelint-plugin'], rules };
