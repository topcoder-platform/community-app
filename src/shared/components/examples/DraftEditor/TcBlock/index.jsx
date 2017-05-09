/*
 * Test custom block. At the moment it renders two columns, each containing
 * a separate editor. If we manage to get it work smoothly, then we can expand
 * it for more layout options, and background images.
 */

import PT from 'prop-types';
import React from 'react';
import Editor from '../Editor';

import './style.scss';

export default function TcBlock(props) {
  return (
    <div>
      <div styleName="column">
        <Editor
          onBlured={props.blockProps.onBlured}
          onFocused={props.blockProps.onFocused}
        />
      </div>
      <div styleName="column">
        <Editor
          onBlured={props.blockProps.onBlured}
          onFocused={props.blockProps.onFocused}
        />
      </div>
    </div>
  );
}

TcBlock.propTypes = {
  blockProps: PT.shape({
    onBlured: PT.func,
    onFocused: PT.func,
  }).isRequired,
};
