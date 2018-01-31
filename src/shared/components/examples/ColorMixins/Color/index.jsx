import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function Color({
  name,
}) {
  return (
    <div styleName="container">
      <div styleName={name} />
      <p styleName="name">${name}</p>
    </div>
  );
}

Color.propTypes = {
  name: PT.string.isRequired,
};
