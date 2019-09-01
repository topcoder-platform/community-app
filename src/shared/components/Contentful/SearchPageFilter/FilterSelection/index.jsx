/**
 * The filter selection rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';

import IconUnCheck from 'assets/images/tc-edu/icon-un-check.svg';
import IconChecked from 'assets/images/tc-edu/icon-checked.svg';
import defaultTheme from './themes/default.scss';


export class FilterSelectionInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      theme,
      className,
      options,
      onSelected,
    } = this.props;

    return (
      <div className={`${theme.container} ${className}`}>
        {
          _.map(options, (option, index) => (
            <div
              key={index}
              className={theme.item}
            >
              <button
                type="button"
                onClick={() => {
                  onSelected(index);
                }}
              >
                {option.selected ? (<IconChecked />) : (<IconUnCheck />)}
              </button>
              <span>{option.title}</span>
            </div>
          ))
        }
      </div>
    );
  }
}

FilterSelectionInner.defaultProps = {
  className: '',
  options: [],
  onSelected: () => {},
};

FilterSelectionInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    item: PT.string.isRequired,
  }).isRequired,
  className: PT.string,
  options: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    selected: PT.bool.isRequired,
  })),
  onSelected: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(FilterSelectionInner);
