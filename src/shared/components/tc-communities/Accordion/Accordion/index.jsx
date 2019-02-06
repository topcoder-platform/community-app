/* eslint-disable jsx-a11y/no-static-element-interactions */
/* I've disabled this rule because of false positive
   there is a known bug in eslint-plugin-jsx-a11y which is fixed in version 5.0
   https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/214 */

/**
 * Accordion component
 *
 * TODO: This component is implemented using state
 * it's better to rewrite it to keep data in Redux store
 */

import React, { Component } from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

class Accordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.defaultSelectedIndex,
    };
  }

  selectItem(index) {
    this.setState({ selectedIndex: index });
  }

  render() {
    const { children, theme } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className={theme.container} id="accordion">
        <ul className={theme.titleList}>
          {React.Children.map(children, (child, index) => (
            <li
              key={parseInt(index.toString(), 10)}
              className={
                `${theme.titleListItem} ${index === selectedIndex ? theme.titleListItemSelected : ''}`
              }
            >
              <div
                onClick={() => this.selectItem(index)}
                onKeyPress={() => this.selectItem(index)}
                role="button"
                styleName="title"
                tabIndex={0}
              >
                {child.props.title}
              </div>
            </li>
          ))}
        </ul>
        <div className={theme.content}>
          {React.Children.map(children, (child, index) => (
            React.cloneElement(child, {
              onTitleClick: () => { this.selectItem(index); },
              isOpen: index === selectedIndex,
            })
          ))}
        </div>
      </div>
    );
  }
}

Accordion.defaultProps = {
  defaultSelectedIndex: 0,
  theme: {},
};

Accordion.propTypes = {
  children: PT.node.isRequired,
  defaultSelectedIndex: PT.number,
  theme: PT.shape({
    container: PT.string,
    titleList: PT.string,
    titleListItem: PT.string,
    titleListItemSelected: PT.string,
    content: PT.string,
  }),
};

export default themr('tcCommunities-Accordion', defaultStyle)(Accordion);
