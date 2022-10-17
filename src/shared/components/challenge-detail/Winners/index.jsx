/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Winners tab component.
 */

import React from 'react';
import PT from 'prop-types';
import Winner from './Winner';
import './style.scss';

export default function Winners({
  winners,
  prizes,
  submissions,
  viewable,
  isDesign,
  isMM,
  isLoggedIn,
  auth,
}) {
  return (
    <div styleName="container">
      {
        winners.map(w => (
          <Winner
            isDesign={isDesign}
            isMM={isMM}
            key={`${w.handle}-${w.placement}`}
            prizes={prizes}
            submissions={submissions}
            viewable={viewable}
            winner={w}
            isLoggedIn={isLoggedIn}
            auth={auth}
          />
        ))
      }
    </div>
  );
}

Winners.defaultProps = {
  winners: [],
  prizes: [],
  submissions: [],
  viewable: false,
  isDesign: false,
  isMM: false,
  isLoggedIn: false,
};

Winners.propTypes = {
  winners: PT.arrayOf(PT.shape()),
  prizes: PT.arrayOf(PT.shape()),
  submissions: PT.arrayOf(PT.shape()),
  viewable: PT.bool,
  isDesign: PT.bool,
  isMM: PT.bool,
  isLoggedIn: PT.bool,
  auth: PT.shape().isRequired,
};
