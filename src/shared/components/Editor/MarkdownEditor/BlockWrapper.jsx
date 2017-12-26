import PT from 'prop-types';
import React from 'react';

import { EditorBlock } from 'draft-js';

export default function BlockWrapper(props) {
  const { type } = props.blockProps;
  const types = type.split('-');
  if (types.length && types[0] && types[0] !== 'unstyled') {
    const child = BlockWrapper({
      ...props,
      blockProps: {
        type: types.slice(1).join('-'),
      },
    });
    if (types[0] === 'hr') return <div className="hr">{child}</div>;
    return React.createElement(types[0], { className: types[0] }, child);
  }
  return <EditorBlock {...props} />;
}

BlockWrapper.propTypes = {
  blockProps: PT.shape({
    type: PT.string.isRequired,
  }).isRequired,
};
