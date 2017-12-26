/**
 * Prism language definition for GitHub-flavored Markdown.
 *
 * Prism (http://prismjs.com) is a lightweight, extensible syntax highlighter.
 * The default Prism language definition for Markdown syntax is over-simplified;
 * for the purpose of perfection, here is a custom definition, written from
 * scratch.
 *
 * NOTE: Currently, it sure can contain bugs and miss some edge cases. In all
 * cases the GitHub's Markdown Specs (https://github.github.com/gfm/) must be
 * considered as the final source of truth on how this should behave - consult
 * it before making any corrections.
 */

const syntax = {};

/* Inline code. */
syntax.code = [{
  lookbehind: true,
  pattern: /(^|[^`])`[^`]([^`]|`{2,})+`/m,
}];

/* Backslash escapes. */
syntax.baskslashEscape = {
  inside: {
    markup: /\\(?=.)/,
  },
  pattern: /\\[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/,
};

/* Headings */
for (let i = 1; i <= 6; i += 1) {
  syntax[`h${i}`] = {
    inside: {
      [`markup h${i}`]: new RegExp(`^\\s{0,3}#{${i}}\\s+|\\s+#+\\s*$`),
    },
    pattern: new RegExp(`^\\s{0,3}#{${i}}\\s+.*`),
  };
}

/* Thematic break. */
syntax['markup thematicBreak'] = /^\s{0,3}((-\s*){3,}|(_\s*){3,}|(\*\s*){3,})$/;

export default syntax;
