import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import './style.scss';

export default function MenuItem({
  value, data, labelKey, onClick,
}) {
  let isSelect = false;
  if (value === data[labelKey]) {
    isSelect = true;
  }

  return (
    <div
      styleName={cn('item', { 'is-select': isSelect })}
      tabIndex={0}
      role="button"
      onKeyPress={() => {
        onClick(data);
      }}
      onClick={() => {
        onClick(data);
      }}
    >
      {data[labelKey]}
    </div>
  );
}

MenuItem.defaultProps = {
  data: {},
  labelKey: '',
  onClick: _.noop,
  value: '',
};

MenuItem.propTypes = {
  data: PT.shape(),
  labelKey: PT.string,
  onClick: PT.func,
  value: PT.string,
};
