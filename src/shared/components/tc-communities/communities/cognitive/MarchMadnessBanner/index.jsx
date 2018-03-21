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
        >Cognitive March Madness</h1>
        <p styleName="text">
          Four contests to build a tool that gathers information on teams and
          players by analyzing textual materials from top sports writers and
          commentators!
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
