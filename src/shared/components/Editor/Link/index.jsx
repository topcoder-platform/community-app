import PT from 'prop-types';
import React from 'react';

import Tooltip from 'components/Tooltip';

import Popup from './Popup';

export default class Link extends React.Component {
  constructor(props) {
    super(props);

    const {
      contentState,
      entityKey,
    } = this.props;

    const { href } = contentState.getEntity(entityKey).getData();

    this.state = {
      href,
    };
  }

  render() {
    const {
      entityKey,
      children,
      contentState,
    } = this.props;

    const {
      insertedFromToolbar,
    } = contentState.getEntity(entityKey).getData();

    const data = contentState.getEntity(entityKey).getData();

    data.href = 'Testing Mutability';

    const popup = (
      <Popup
        href={this.state.href}
        onEdit={href => this.setState({ href })}
      />
    );

    return (
      <span>
        <Tooltip
          align={{
            offset: [0, 5],
          }}
          content={popup}
          suppressDiv
          trigger={['click', 'hover']}
          defaultVisible={insertedFromToolbar}
        >
          <a href={data.href} target="_blank" rel="noopener noreferrer">{children}</a>
        </Tooltip>
      </span>
    );
  }
}

Link.defaultProps = {
  children: null,
};

Link.propTypes = {
  contentState: PT.shape().isRequired,
  children: PT.node,
  entityKey: PT.string.isRequired,
};
