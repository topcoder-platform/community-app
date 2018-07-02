import PT from 'prop-types';
import React from 'react';

import { EditorBlock } from 'draft-js';

export default function BlockWrapper(props) {
  const { blockProps } = props;
  const { type } = blockProps;
  const types = type.split('-');
  const thisType = (types[0] || 'unstyled').split(':');

  const leadingLi = thisType[0] === 'li'
  && !types.slice(1).some(x => x === 'li');

  if (thisType[0] !== 'unstyled') {
    const child = BlockWrapper({
      ...props,
      blockProps: {
        type: types.slice(1).join('-'),
      },
    });
    let className = thisType[0];
    if (thisType[1]) className += ` md-syntax-level-${thisType[1]}`;
    if (leadingLi) className += ' leadingLi';
    if (thisType[0] === 'hr') {
      return (
        <div className="hr">
          {child}
        </div>
      );
    }
    return React.createElement(thisType[0], { className }, child);
  }
  return <EditorBlock {...props} />;
}

BlockWrapper.propTypes = {
  blockProps: PT.shape({
    type: PT.string.isRequired,
  }).isRequired,
};
