/**
 * Question and Answer Component
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import MarkdownRenderer from 'components/MarkdownRenderer';

import './item.scss';

class DropdownItem extends React.Component {
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
    const { data } = this.props;
    const { isActive } = this.state;
    return (
      <div styleName="container" id={data.sys.id}>
        <div
          tabIndex={0}
          role="button"
          onKeyPress={e => (e.key === 'Enter' ? null : null)}
          styleName={isActive ? 'question active' : 'question'}
          onClick={() => this.toggleActive()}
        >
          <div styleName="text">
            {data.fields.title}
          </div>
          <div styleName={isActive ? 'toggle-arrow active' : 'toggle-arrow'} />
        </div>
        <div
          styleName={isActive ? 'answer active' : 'answer'}
        >
          <MarkdownRenderer markdown={data.fields.text} {...this.props} />
        </div>
      </div>
    );
  }
}

DropdownItem.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
  isActive: false,
};

DropdownItem.propTypes = {
  data: PT.shape().isRequired,
  isActive: PT.bool,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

export default DropdownItem;
