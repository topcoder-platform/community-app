/**
 * Question and Answer Component
 */
import React from 'react';
import PT from 'prop-types';
import renderMarkdown from 'utils/markdown';

import './styles.scss';

class QAComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: props.isActive,
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
      <div styleName={className} id={data.title}>
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
        <div styleName={isActive ? 'answer active' : 'answer'}>
          {renderMarkdown(data.text)}
        </div>
      </div>
    );
  }
}

QAComponent.propTypes = {
  data: PT.shape().isRequired,
  isLastItem: PT.string.isRequired,
  isActive: PT.bool.isRequired,
};

export default QAComponent;
