/**
 * Popup Component for Link Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { GhostButton } from 'topcoder-react-ui-kit';

import EditModal from '../EditModal';

import './style.scss';

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: props.triggerModal,
    };
  }

  render() {
    const renderDisplay = () => (
      <div>
        <GhostButton
          className="edit"
          onClick={() => this.setState({ editing: true })}
          size="sm"
        >Edit</GhostButton>
      </div>
    );

    const renderEdit = () => (
      <div>
        <EditModal
          size={this.props.size}
          src={this.props.src}
          onCancel={() => this.setState({ editing: false })}
          onSave={(src, size) => {
            this.setState({ editing: false });
            this.props.onEdit(src, size);
          }}
        />
      </div>
    );

    return (
      <div>
        { this.state.editing ? renderEdit() : renderDisplay() }
      </div>
    );
  }
}

Popup.defaultProps = {
  size: 100,
  src: 'http://',
  onEdit: _.noop,
  triggerModal: false,
};

Popup.propTypes = {
  onEdit: PT.func,
  size: PT.number,
  src: PT.string,
  triggerModal: PT.bool,
};
