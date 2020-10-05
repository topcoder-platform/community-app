/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Toggles component.
 */
import React, { useRef, useState } from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import './style.scss';

import { config } from 'topcoder-react-utils';

function Toggles({ checked, onChange, size }) {
  const [internalChecked, setInternalChecked] = useState(checked);
  let sizeStyle = size === 'lg' ? 'lgSize' : null;
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), config.GUIKIT.DEBOUNCE_ON_CHANGE_TIME),
  );

  if (!sizeStyle) {
    sizeStyle = size === 'xs' ? 'xsSize' : 'smSize';
  }

  return (
    <label styleName={`container ${sizeStyle}`}>
      <input
        checked={internalChecked}
        type="checkbox"
        onChange={(e) => {
          setInternalChecked(e.target.checked);
          delayedOnChange.current(e.target.checked, onChange);
        }}
      />
      <span styleName="slider" />
      {sizeStyle === 'lgSize' && !internalChecked ? <span styleName="off">off</span> : null}
      {sizeStyle === 'lgSize' && internalChecked ? <span styleName="on">on</span> : null}
    </label>
  );
}

Toggles.defaultProps = {
  checked: false,
  onChange: () => {},
  size: 'sm',
};

Toggles.propTypes = {
  checked: PT.bool,
  onChange: PT.func,
  size: PT.oneOf(['xs', 'sm', 'lg']),
};

export default Toggles;
