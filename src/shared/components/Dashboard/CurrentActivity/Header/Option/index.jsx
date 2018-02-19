import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Option({ selected, title }) {
  let containerStyle = 'container';
  if (selected) containerStyle += ' selected';

  return <h1 styleName={containerStyle}>{title}</h1>;
}

Option.defaultProps = {
  selected: false,
};

Option.propTypes = {
  selected: PT.bool,
  title: PT.string.isRequired,
};
