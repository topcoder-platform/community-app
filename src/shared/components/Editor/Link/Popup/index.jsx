/**
 * Popup Component for Link Decorators
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import { GhostButton } from 'topcoder-react-ui-kit';

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
    const { onEdit } = this.props;
    const { href } = this.state;
    onEdit(href);
    this.setState({ editing: false });
  }

  render() {
    const { editing, href } = this.state;
    const renderDisplay = () => (
      <div>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {href}
        </a>
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
        <input
          type="text"
          value={href}
          onChange={() => this.setState({ href: this.node.value })}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              this.handleDone();
            }
          }}
          ref={(node) => { this.node = node; }}
        />
        <GhostButton
          className="edit"
          onClick={() => {
            this.handleDone();
          }}
          size="sm"
        >
Done
        </GhostButton>
      </div>
    );

    return (
      <div styleName="container">
        { editing ? renderEdit() : renderDisplay() }
      </div>
    );
  }
}

Popup.defaultProps = {
  href: '',
  onEdit: _.noop,
};

Popup.propTypes = {
  href: PT.string,
  onEdit: PT.func,
};
