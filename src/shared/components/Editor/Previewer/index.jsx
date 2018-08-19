import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default class Previewer extends React.Component {
  constructor(props) {
    super(props);
    if (props.connector) props.connector.setPreviewer(this);
    this.state = {
      content: props.initialContent,
      visible: false,
    };
  }

  setContent(content) {
    setImmediate(() => this.setState({ content }));
  }

  setVisible(newVisible) {
    const { visible } = this.state;
    if (newVisible === visible) return;
    setImmediate(() => this.setState({ visible: newVisible }));
  }

  render() {
    const { content, visible } = this.state;
    return (
      <div styleName="container">
        {
          visible ? (
            <div>
              <div styleName="title">
Rendering Preview
              </div>
              <div
                /* eslint-disable react/no-danger */
                dangerouslySetInnerHTML={{ __html: content }}
                /* eslint-enable react/no-danger */
                styleName="content"
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}

Previewer.defaultProps = {
  connector: null,
  initialContent: '',
};

Previewer.propTypes = {
  connector: PT.shape(),
  initialContent: PT.string,
};
