/**
 * Accordion component
 *
 * This is mostly a clone of the Accordion component found in tc-communities.
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
    const { children, theme, title } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className={theme.outerContainer}>
        <h1>{title}</h1>
        <div className={theme.container} id="accordion">
          <ul className={theme.titleList}>
            {React.Children.map(children, (child, index) => (
              <li
                key={index}
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
                >{child.props.title}
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
      </div>
    );
  }
}

Accordion.defaultProps = {
  defaultSelectedIndex: 0,
  theme: {},
  title: '',
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
  title: PT.string,
};

export default themr('Contentful-Accordion', defaultStyle)(Accordion);
