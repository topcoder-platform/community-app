/**
 * Question and Answer Component
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';

import './styles.scss';

const converter = new showdown.Converter();

class QAComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  toggleActive() {
    const { isActive } = this.state;
    this.setState({
      isActive: !isActive,
    });
  }

  render() {
    const { data, isLastItem } = this.props;
    const { isActive } = this.state;
    const className = `container ${isLastItem}`;
    return (
      <div styleName={className}>
        <div
          tabIndex={0}
          role="button"
          onKeyPress={e => (e.key === 'Enter' ? null : null)}
          styleName={isActive ? 'question active' : 'question'}
          onClick={() => this.toggleActive()}
        >
          <div styleName="text">
            { data.title }
          </div>
          <div styleName={isActive ? 'toggle-arrow active' : 'toggle-arrow'} />
        </div>
        <div
          styleName={isActive ? 'answer active' : 'answer'}
          dangerouslySetInnerHTML={
            { __html: converter.makeHtml(data.text) }
          }
        />
      </div>
    );
  }
}

QAComponent.propTypes = {
  data: PT.shape().isRequired,
  isLastItem: PT.string.isRequired,
};

export default QAComponent;
