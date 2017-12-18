/**
 * Modal Component for Image Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { PrimaryButton, Button } from 'components/buttons';
import Modal from 'components/Modal';

import style from './style.scss';

const theme = {
  container: style.modalContainer,
  overlay: style.modalOverlay,
};

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    const { description, size, src } = props;
    this.state = {
      description,
      size,
      src,
      previewURL: '',
      editURL: src,
    };
  }

  render() {
    const st = this.state;
    return (
      <div styleName="container">
        <Modal
          onCancel={() => this.props.onCancel()}
          theme={theme}
        >
          <div styleName="fields-container">
            <div styleName="field">
              URL:
              <input
                type="text"
                onChange={() => this.setState({ editURL: this.inputURL.value })}
                onBlur={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
                onCompositionStart={e => e.stopPropagation()}
                onCompositionUpdate={e => e.stopPropagation()}
                onCompositionEnd={e => e.stopPropagation()}
                onCopy={e => e.stopPropagation()}
                onCut={e => e.stopPropagation()}
                onContextMenu={e => e.stopPropagation()}
                onFocus={(e) => {
                  e.stopPropagation();
                  this.inputURL.focus();
                }}
                onInput={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
                onKeyPress={e => e.stopPropagation()}
                onKeyUp={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onMouseEnter={e => e.stopPropagation()}
                onMouseLeave={e => e.stopPropagation()}
                onMouseMove={e => e.stopPropagation()}
                onMouseOut={e => e.stopPropagation()}
                onMouseOver={e => e.stopPropagation()}
                onPaste={e => e.stopPropagation()}
                onSelect={e => e.stopPropagation()}
                onSubmit={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                ref={(node) => { this.inputURL = node; }}
                styleName="url"
                tabIndex="0"
                value={st.editURL}
              />
            </div>
            <div styleName="field">
              Size%:
              <input
                type="number"
                onChange={() => this.setState({ size: _.clamp(this.inputSize.value, 0, 100) })}
                ref={(node) => { this.inputSize = node; }}
                styleName="size"
                tabIndex="-1"
                value={st.size}
              />
            </div>
          </div>
          <div styleName="buttons-container">
            <Button
              onClick={() => this.setState({ previewURL: st.editURL })}
            >Preview</Button>
            <PrimaryButton
              onClick={() => this.props.onSave(st.editURL, st.size)}
            >Save</PrimaryButton>
          </div>
          { st.previewURL ?
            <div styleName="preview">
              <hr />
              <img src={st.previewURL} alt={st.description} height={`${st.size}%`} width={`${st.size}%`} />
            </div> : null
          }
        </Modal>
      </div>
    );
  }
}

EditModal.defaultProps = {
  description: '',
  onSave: _.noop,
  onCancel: _.noop,
  size: 100,
  src: 'http://',
};

EditModal.propTypes = {
  description: PT.string,
  onSave: PT.func,
  onCancel: PT.func,
  size: PT.number,
  src: PT.string,
};
