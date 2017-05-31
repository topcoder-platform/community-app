/**
 * Dropdown component
 *
 * It's styled for tc communities
 */

/* global window */

import React from 'react';
import PT from 'prop-types';
import ReactDropdown from 'react-dropdown';
import './style.scss';

function Dropdown(props) {
  const { options, value } = props;

  return (
    <div styleName="container">
      <ReactDropdown
        onChange={(option) => {
          const op = options.find(item => item.value === option.value) || {};
          if (op.redirect) window.location = op.redirect;
        }}
        options={options}
        value={value}
      />
    </div>
  );
}

Dropdown.defaultProps = {
};

const optionType = PT.shape({
  label: PT.string.isRequired,
  value: PT.string.isRequired,
});

Dropdown.propTypes = {
  options: PT.arrayOf(optionType).isRequired,
  value: optionType.isRequired,
};

export default Dropdown;
