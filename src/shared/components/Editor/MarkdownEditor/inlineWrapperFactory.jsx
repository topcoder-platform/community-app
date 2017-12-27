import React from 'react';

function InlineWrapper({ children, key }) {
  if (!key) return children;
  if (key === 'mdSyntax') {
    return <span className="mdSyntax">{children}</span>;
  }
  const keys = key.split('-');
  const child = InlineWrapper({
    children,
    key: keys.slice(1).join('-'),
  });
  return React.createElement(keys[0], {}, child);
}

export default function inlineWrapperFactory(key) {
  return ({ children }) => InlineWrapper({ children, key });
}
