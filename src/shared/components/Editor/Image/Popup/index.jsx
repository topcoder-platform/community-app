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
    const {
      onEdit,
      size,
      src,
    } = this.props;
    const { editing } = this.state;
    const renderDisplay = () => (
      <div>
        <GhostButton
          className="edit"
          onClick={() => this.setState({ editing: true })}
          size="sm"
        >
Edit
        </GhostButton>
      </div>
    );

    const renderEdit = () => (
      <div>
        <EditModal
          size={size}
          src={src}
          onCancel={() => this.setState({ editing: false })}
          onSave={(newSrc, newSize) => {
            this.setState({ editing: false });
            onEdit(newSrc, newSize);
          }}
        />
      </div>
    );

    return (
      <div>
        { editing ? renderEdit() : renderDisplay() }
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
