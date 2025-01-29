/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PT from 'prop-types';
import IconCheck from 'assets/images/icon-check.svg';

import './styles.scss';

export default function FormInputCheckBox({
  checked: checkedProp,
  id,
  name,
  label,
  onChange,
  style,
}) {
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {
    setChecked(checkedProp);
  }, [checkedProp]);

  const handleChange = (e) => {
    setChecked(!checked);
    onChange(e);
  };

  return (
    <span styleName="formInputCheckbox" style={style}>
      <span styleName="input-container">
        <input type="checkbox" id={id} name={name} checked={checked} onChange={handleChange} />
        <span styleName="checked"><IconCheck /></span>
        <span styleName="unchecked" />
      </span>
      <label styleName="label" htmlFor={id}>{label}</label>
    </span>
  );
}

FormInputCheckBox.defaultProps = {
  checked: false,
  id: '',
  name: '',
  label: '',
  onChange: () => {},
  style: {},
};

FormInputCheckBox.propTypes = {
  checked: PT.bool,
  id: PT.string,
  name: PT.string,
  label: PT.string,
  onChange: PT.func,
  style: PT.object,
};
