import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import './style.scss';

export default function SortingSelectBar({
  onSelect, options, title, value,
}) {
  return (
    <div styleName="sortingBar">
      <h2 styleName="title">
        {title}
      </h2>
      {
        options ? (
          <div styleName="view-options-toggle-container">
            <Select
              searchable={false}
              clearable={false}
              options={options}
              onChange={item => onSelect(item.value)}
              value={value}
              placeholder="Select an option"
              arrowRenderer={ArrowIcon}
            />
          </div>
        ) : null
      }
    </div>
  );
}

SortingSelectBar.defaultProps = {
  onSelect: _.noop,
  options: null,
  title: '',
  value: null,
};

SortingSelectBar.propTypes = {
  onSelect: PT.func,
  options: PT.arrayOf(PT.shape()),
  title: PT.string,
  value: PT.shape(),
};
