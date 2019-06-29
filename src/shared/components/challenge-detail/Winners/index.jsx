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
  pointPrizes,
  prizes,
  submissions,
  viewable,
  isDesign,
}) {
  return (
    <div styleName="container">
      {
        winners.map((w, index) => (
          <Winner
            isDesign={isDesign}
            key={`${w.handle}-${w.placement}`}
            last={index === winners.length - 1}
            pointPrizes={pointPrizes}
            prizes={prizes}
            submissions={submissions}
            viewable={viewable}
            winner={w}
          />
        ))
      }
    </div>
  );
}

Winners.defaultProps = {
  winners: PT.arrray(PT.shape({
    photoURL: PT.string,
    submissionDownloadLink: PT.string,
  })),
  pointPrizes: [],
  prizes: [],
  submissions: [],
  viewable: false,
  isDesign: false,
};

Winners.propTypes = {
  winners: PT.arrayOf(PT.shape()),
  pointPrizes: PT.arrayOf(PT.number),
  prizes: PT.arrayOf(PT.number),
  submissions: PT.arrayOf(PT.shape()),
  viewable: PT.bool,
  isDesign: PT.bool,
};
