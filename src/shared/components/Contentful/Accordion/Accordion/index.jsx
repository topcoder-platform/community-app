/**
 * Accordion component
 *
 * This is mostly a clone of the Accordion component found in tc-communities.
 */
import React, { Component } from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import MarkdownRenderer from 'components/MarkdownRenderer';

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
    const {
      children,
      theme,
      title,
      description,
      spaceName,
      environment,
      preview,
    } = this.props;
    const { selectedIndex } = this.state;
    const contentfulConfig = {
      spaceName,
      environment,
      preview,
    };

    return (
      <div className={theme.outerContainer}>
        { title ? (<h1>{title}</h1>) : null}
        { description ? (
          <div className={theme.description}>
            <MarkdownRenderer markdown={description} {...contentfulConfig} />
          </div>
        ) : null }
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
      </div>
    );
  }
}

Accordion.defaultProps = {
  defaultSelectedIndex: 0,
  theme: {},
  title: null,
  description: null,
  preview: false,
  spaceName: null,
  environment: null,
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
  description: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

export default themr('Contentful-Accordion', defaultStyle)(Accordion);
