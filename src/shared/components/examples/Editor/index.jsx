/**
 * POC for WYSIWYG ReactJS editor.
 */

import React from 'react';
import Immutable from 'immutable';
import { Editor } from 'react-draft-wysiwyg';
import Draft from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import CustomButton from './CustomButton';
import TwoColumnsBlock from './TwoColumnsBlock';
import TwoColumnsSwitch from './TwoColumnsSwitch';

const blockRenderMap = Immutable.Map({
  'two-columns': {
    element: 'div',
    wrapper: <TwoColumnsBlock />,
  },
});

const extendedBlockRenderMap =
  Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

export default function EditorPage() {
  return (
    <div>
      <h1>WYSIWYG Editor POC</h1>
      <Editor
        blockRenderMap={extendedBlockRenderMap}
        // onEditorStateChange={state => console.log(state)}
        toolbarCustomButtons={[
          <CustomButton />,
          <TwoColumnsSwitch />,
        ]}
        wrapperStyle={{
          border: '1px solid black',
          margin: '24px',
        }}
      />
      <h3>HTML</h3>
    </div>
  );
}

