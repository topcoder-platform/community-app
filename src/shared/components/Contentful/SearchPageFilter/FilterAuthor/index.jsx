/**
 * The filter author rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';

import IconArrow from 'assets/images/tc-edu/icon-arrow-up-big.svg';
import defaultTheme from './themes/default.scss';


export class FilterAuthorInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPopup: false,
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Event if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ isShowPopup: false });
    }
  }

  render() {
    const {
      theme,
      selected,
      options,
      onSelected,
      className,
    } = this.props;
    const {
      isShowPopup,
    } = this.state;

    return (
      <div ref={this.setWrapperRef} className={`${theme.container} ${className}`}>
        <span className={theme.title}>Author</span>
        <button
          type="button"
          className={theme.header}
          onClick={() => {
            this.setState({ isShowPopup: !isShowPopup });
          }}
        >
          <span>{selected}</span>
          <IconArrow className={theme['icon-arrow']} />
        </button>
        {isShowPopup && (
          <div className={theme.popup}>
            {
              _.map(options, option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelected(option);
                    this.setState({ isShowPopup: false });
                  }}
                ><span>{option}</span>
                </button>
              ))
            }
          </div>
        )}
      </div>
    );
  }
}

FilterAuthorInner.defaultProps = {
  className: '',
  selected: '',
  options: [],
  onSelected: () => {},
};

FilterAuthorInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    title: PT.string.isRequired,
    header: PT.string.isRequired,
    popup: PT.string.isRequired,
    'icon-arrow': PT.string.isRequired,
  }).isRequired,
  className: PT.string,
  selected: PT.string,
  options: PT.arrayOf(PT.string),
  onSelected: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(FilterAuthorInner);
