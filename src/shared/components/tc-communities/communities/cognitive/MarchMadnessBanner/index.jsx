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
      <div styleName="mask" />
      <div>
        <h1
          styleName="title"
        >
          A Data Science Match to make online ratings more accurate
        </h1>
        <p styleName="text">
          Perform
          sentiment analysis on review comments by customers, and correlate
          these comments to the quantitative review score for a given seller.
        </p>
        <p styleName="text bold">
          Starts on July 9, 2018
        </p>
      </div>
      {
      /*
      <Button
        theme={{
          button: style.button,
        }}
        to={to}
      >
View Challenges
      </Button>
      */
      }
    </div>
  );
}

MonthOfLoveBanner.propTypes = {
  to: PT.string.isRequired,
};
