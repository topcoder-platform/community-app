/**
 * Popup Component for Image Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { GhostButton } from 'components/buttons';
import Modal from 'components/Modal';

import './style.scss';

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      href: props.href,
      editing: false,
    };
  }

  handleDone() {
    this.props.onEdit(this.state.href);
    this.setState({ editing: false });
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
      <Modal
        onCancel={() => this.setState({ editing: false })}
      >Image Modal Test</Modal>
    );

    return (
      <div styleName="container">
        { this.state.editing ? renderEdit() : renderDisplay() }
      </div>
    );
  }
}

Popup.defaultProps = {
  href: '',
  onEdit: _.noop,
  title: '',
};

Popup.propTypes = {
  href: PT.string,
  onEdit: PT.func,
};
