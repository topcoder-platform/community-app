/**
 * The filter radio rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';

import RadioUnCheck from 'assets/images/tc-edu/icon-radio-un-check.svg';
import RadioChecked from 'assets/images/tc-edu/icon-radio-checked.svg';
import defaultTheme from './themes/default.scss';

export function FilterRadioInner(props) {
  const {
    theme,
    className,
    options,
    selected,
    onSelected,
  } = props;

  return (
    <div className={`${theme.container} ${className}`}>
      {
        _.map(options, (option, index) => (
          <div key={index} className={theme.item}>
            <button
              type="button"
              onClick={() => { onSelected(option); }}
            >
              {(option.title === selected) ? (<RadioChecked />) : (<RadioUnCheck />)}
            </button>
            <span>{option.title}</span>
          </div>
        ))
      }
    </div>
  );
}

FilterRadioInner.defaultProps = {
  className: '',
  selected: '',
  options: [],
  onSelected: () => {},
};

FilterRadioInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    item: PT.string.isRequired,
  }).isRequired,
  className: PT.string,
  options: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
  })),
  selected: PT.string,
  onSelected: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(FilterRadioInner);
