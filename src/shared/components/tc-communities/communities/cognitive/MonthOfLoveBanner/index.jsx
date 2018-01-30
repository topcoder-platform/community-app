/**
 * IBM Cloud Banner.
 */

import PT from 'prop-types';
import React from 'react';
import { Button } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function MonthOfLoveBanner({
  to,
}) {
  return (
    <div styleName="container">
      <div>
        <h1
          styleName="title"
        >Cognitive Month of Love</h1>
        <p styleName="text">
          A new challenge will be posted every week, all February long.
        </p>
      </div>
      <Button
        theme={{
          button: style.button,
        }}
        to={to}
      >View Challenges</Button>
    </div>
  );
}

MonthOfLoveBanner.propTypes = {
  to: PT.string.isRequired,
};
