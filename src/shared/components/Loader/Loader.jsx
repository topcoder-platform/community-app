import React from 'react';
import PT from 'prop-types';
import './LoaderStyle.scss';

const Loader = (props) => {
  const className = `Loader${props.type ? ` Loader_${props.type}` : ''}`;

  return (
    <div styleName={className}>
      <div styleName="Loader__container">
        <div styleName="Loader__loader" />
      </div>
    </div>
  );
};

Loader.defaultProps = {
  type: '',
};

Loader.propTypes = {
  type: PT.oneOf(['small', '']),
};

module.exports = Loader;
