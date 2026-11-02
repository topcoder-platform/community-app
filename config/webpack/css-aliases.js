const valueParser = require('postcss-value-parser');

module.exports = {
  postcssPlugin: 'community-css-asset-aliases',
  Declaration(declaration) {
    if (!declaration.value.includes('url(')) return;
    const value = valueParser(declaration.value);
    value.walk((node) => {
      if (node.type !== 'function' || node.value !== 'url' || !node.nodes[0]) return;
      const target = node.nodes[0];
      if (target.value.startsWith('assets/')) target.value = `~${target.value}`;
      if (target.value.startsWith('fonts/')) target.value = target.value.replace('fonts/', '~tc-fonts/');
    });
    // PostCSS visitors update the declaration in place.
    // eslint-disable-next-line no-param-reassign
    declaration.value = value.toString();
  },
};
