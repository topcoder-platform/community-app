import React from 'react';
import ReactSelect from 'react-select';
import './style.scss';

export default function Select(props) {
  return (
    <div styleName="select">
      <ReactSelect
        {...props}
        autosize={false}
      />
    </div>
  );
}
