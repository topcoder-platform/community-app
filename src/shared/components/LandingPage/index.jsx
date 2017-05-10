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
import _ from 'lodash';
import uuid from 'uuid/v4';
import styles from './styles.css'; // eslint-disable-line no-unused-vars

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      editorData: {},
      nextTabIndex: 1
    };
  }

  componentDidMount(){
    this.load();
  }

  load(){
    try{
      const rows = JSON.parse(localStorage.getItem('rows'));
      const editorData = JSON.parse(localStorage.getItem('editorData'));
      this.setState({
        rows, editorData
      });
    }catch(e){
      console.log(e);
    }
  }

  render() {
    return (
      <div className="playground-root landing-page-root">
        <div className="custom-editor-wrap">

        {this.state.rows.map((rowDetails, rowIndex) => {

          return <div key={rowDetails.id} className="playground-editorSection">
            {rowDetails.ids.map((editorId, columnIndex) => {
              if(rowDetails.type){
                const className = rowDetails.type === '1:2' && columnIndex === 0 ? 'width-33' :
                                  rowDetails.type === '1:2' && columnIndex === 1 ? 'width-66' :
                                  rowDetails.type === '2:1' && columnIndex === 0 ? 'width-66' :
                                  rowDetails.type === '2:1' && columnIndex === 1 ? 'width-33' :
                                  rowDetails.type === '3C' ? 'width-33' : '';

                return <div key={editorId} className={className + " editor-" + editorId + " playground-editorWrapper"}>
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
                  </div>
                }
            })}

          </div>

        })}

        </div>
      </div>
    );
  }
}

export default LandingPage;