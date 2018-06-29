import React from 'react';
import PT from 'prop-types';
import './LoaderStyle.scss';

function Loader({
  type,
}) {
  const className = `Loader${type ? ` Loader_${type}` : ''}`;

  return (
    <div styleName={className}>
      <div styleName="Loader__container">
        <div styleName="Loader__loader" />
      </div>
    </div>
  );
}

Loader.defaultProps = {
  type: '',
};

Loader.propTypes = {
  type: PT.oneOf(['small', '']),
};

export default Loader;
