/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/**
 * Checkbox component.
 */
import React, { useRef, useState } from 'react';
import PT from 'prop-types';
import IconCheckSolid from 'assets/images/check-mark.svg';
import _ from 'lodash';
import './style.scss';

import { config } from 'topcoder-react-utils';

function Checkbox({
  checked,
  onChange,
  size,
  errorMsg,
}) {
  const [checkedInternal, setCheckedInternal] = useState(checked);
  let sizeStyle = size === 'lg' ? 'lgSize' : null;
  let checkmarkSize = size === 'lg' ? 16 : 0;
  if (!sizeStyle) {
    sizeStyle = size === 'xs' ? 'xsSize' : 'smSize';
    checkmarkSize = size === 'xs' ? 10 : 13;
  }
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), config.GUIKIT.DEBOUNCE_ON_CHANGE_TIME),
  ).current;

  return (
    <label styleName={`container ${sizeStyle}`}>
      <input
        checked={checkedInternal}
        type="checkbox"
        onChange={(e) => {
          setCheckedInternal(e.target.checked);
          delayedOnChange(e.target.checked, onChange);
        }}
      />
      <div styleName={`checkmark ${errorMsg ? 'haveError' : ''}`}>
        <IconCheckSolid styleName="after" width={checkmarkSize} height={checkmarkSize} />
      </div>
      {errorMsg ? (<span styleName="errorMessage">{errorMsg}</span>) : null}
    </label>
  );
}

Checkbox.defaultProps = {
  checked: false,
  onChange: () => {},
  size: 'sm',
  errorMsg: '',
};

Checkbox.propTypes = {
  checked: PT.bool,
  onChange: PT.func,
  size: PT.oneOf(['xs', 'sm', 'lg']),
  errorMsg: PT.string,
};

export default Checkbox;
