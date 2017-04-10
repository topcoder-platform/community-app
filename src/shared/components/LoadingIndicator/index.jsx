import React from 'react';
import './styles.scss';

const Loader = "https://raw.githubusercontent.com/appirio-tech/topcoder-app/dev/assets/images/ripple.gif";

export default function LoadingIndicator(props) {
  return (
    <div styleName="root">
      <img src={Loader} alt="Loading data" />
    </div>
  );
}