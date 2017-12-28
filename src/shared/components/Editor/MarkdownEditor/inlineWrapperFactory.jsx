import PT from 'prop-types';
import React from 'react';

function InlineWrapper({ children, hrefs, key }) {
  if (!key || key === 'text') return <span className="text">{children}</span>;
  if (key === 'mdSyntax') {
    return <span className="mdSyntax">{children}</span>;
  } else if (key === 'inlineCode') {
    return <code className="inline">{children}</code>;
  }
  const keys = key.split('-');
  const child = InlineWrapper({
    children,
    key: keys.slice(1).join('-'),
  });

  if (keys[0].startsWith('a:')) {
    return <a href={encodeURI(hrefs[keys[0].slice(2)])}>{children}</a>;
  }

  return React.createElement(keys[0], {}, child);
}

InlineWrapper.propTypes = {
  children: PT.node.isRequired,
  hrefs: PT.shape.isRequired,
  key: PT.string.isRequired,
};

export default function inlineWrapperFactory(key, hrefs) {
  return ({ children }) => InlineWrapper({ children, hrefs, key });
}
