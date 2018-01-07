import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default class Previewer extends React.Component {
  constructor(props) {
    super(props);
    if (props.connector) props.connector.setPreviewer(this);
    this.state = {
      content: props.initialContent,
    };
  }

  setContent(content) {
    setImmediate(() => this.setState({ content }));
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="title">Rendering Preview</div>
        <div
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{ __html: this.state.content }}
          /* eslint-enable react/no-danger */
          styleName="content"
        />
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
