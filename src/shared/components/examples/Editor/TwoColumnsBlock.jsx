import React from 'react';

import { Editor } from 'react-draft-wysiwyg';

import './TwoColumnsBlock.scss';

export default function TwoColumnsBlock() {
  return (
    <div>
      {/*
      <div styleName="left">
        {props.children}
      </div>
      <div styleName="right">
        TEST
        //props.children
      </div>
      */}
      <Editor
        wrapperStyle={{
          display: 'inline-block',
          width: '50%',
        }}
      />
      <Editor
        wrapperStyle={{
          display: 'inline-block',
          width: '50%',
        }}
      />
    </div>
  );
}
