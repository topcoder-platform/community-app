import React from 'react';
import _ from 'lodash';
import ReactSelect from 'react-select';
import PT from 'prop-types';
import './styles.scss';

export default function Select(props) {
  const { selectRef } = props;
  return (
    <div styleName="form-input-select">
      <ReactSelect
        ref={selectRef}
        {...props}
        autosize={false}
      />
    </div>
  );
}

Select.defaultProps = {
  selectRef: _.noop,
};

Select.propTypes = {
  selectRef: PT.func,
};
