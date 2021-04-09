/**
 * Question and Answer Component
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import MarkdownRenderer from 'components/MarkdownRenderer';
import { themr } from 'react-css-super-themr';
import defaultTheme from './themes/item.scss';
import darkTheme from './themes/item-dark.scss';

const THEMES = {
  Default: defaultTheme,
  'Dark mode': darkTheme,
};
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
    const { data, baseTheme } = this.props;
    const { isActive } = this.state;
    return (
      <div className={THEMES[baseTheme].container} id={data.sys.id}>
        <div
          tabIndex={0}
          role="button"
          onKeyPress={e => (e.key === 'Enter' ? null : null)}
          className={isActive ? THEMES[baseTheme]['question-active'] : THEMES[baseTheme].question}
          onClick={() => this.toggleActive()}
        >
          <div className={THEMES[baseTheme].text}>
            {data.fields.title}
          </div>
          <div className={isActive ? THEMES[baseTheme]['toggle-arrow-active'] : THEMES[baseTheme]['toggle-arrow']} />
        </div>
        <div
          className={isActive ? THEMES[baseTheme]['answer-active'] : THEMES[baseTheme].answer}
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
  baseTheme: 'Default',
};

DropdownItem.propTypes = {
  data: PT.shape().isRequired,
  isActive: PT.bool,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
  baseTheme: PT.string,
};

export default themr('DropdownItem', defaultTheme)(DropdownItem);
