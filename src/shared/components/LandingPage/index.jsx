/* global localStorage */

import React, { Component } from 'react';
import draftToHtml from 'draftjs-to-html'; // eslint-disable-line no-unused-vars
import draftToMarkdown from 'draftjs-to-markdown'; // eslint-disable-line no-unused-vars
import { Editor } from 'react-draft-wysiwyg/dist/react-draft-wysiwyg';
import editorStyles from 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // eslint-disable-line no-unused-vars
import {
  convertFromHTML, // eslint-disable-line no-unused-vars
  convertToRaw, // eslint-disable-line no-unused-vars
  ContentState, // eslint-disable-line no-unused-vars
  EditorState, // eslint-disable-line no-unused-vars
} from 'draft-js';
import logger from 'utils/logger';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      editorData: {},
      nextTabIndex: 1,
    };
  }

  componentDidMount() {
    this.load();
  }

  load() {
    try {
      const rows = JSON.parse(localStorage.getItem('rows'));
      const editorData = JSON.parse(localStorage.getItem('editorData'));
      this.setState({
        rows, editorData,
      });
    } catch (e) {
      logger.log(e);
    }
  }

  render() {
    return (
      <div className="playground-root landing-page-root">
        <div className="custom-editor-wrap">
          {this.state.rows.map(rowDetails =>
            <div key={rowDetails.id} className="playground-editorSection">
              {rowDetails.ids.map((editorId, columnIndex) => {
                if (rowDetails.type) {
                  let className = '';
                  if (rowDetails.type === '1:2' && columnIndex === 0) {
                    className = 'width-33';
                  } else if (rowDetails.type === '1:2' && columnIndex === 1) {
                    className = 'width-66';
                  } else if (rowDetails.type === '2:1' && columnIndex === 0) {
                    className = 'width-66';
                  } else if (rowDetails.type === '2:1' && columnIndex === 1) {
                    className = 'width-33';
                  } else if (rowDetails.type === '3C') {
                    className = 'width-33';
                  }

                  return (<div key={editorId} className={`${className} editor-${editorId} playground-editorWrapper`}>
                    <Editor
                      toolbarHidden
                      readOnly
                      initialContentState={this.state.editorData[editorId].editorContent}
                      toolbarClassName="playground-toolbar"
                      wrapperClassName="playground-wrapper"
                      editorClassName="playground-editor"
                      toolbar={{
                        history: { inDropdown: true },
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        link: { showOpenOptionOnHover: true },
                        textAlign: { inDropdown: true },
                        image: { uploadCallback: this.imageUploadCallBack },
                      }}
                    />
                  </div>);
                }
                return undefined;
              })}

            </div>)}

        </div>
      </div>
    );
  }
}

export default LandingPage;
