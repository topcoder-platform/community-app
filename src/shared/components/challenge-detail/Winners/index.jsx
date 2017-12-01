/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Winners tab component.
 */

import React from 'react';
import PT from 'prop-types';
import Winner from './Winner';
import './style.scss';

export default function Winners({
  checkpointPrize,
  winners,
  prizes,
  submissions,
  viewable,
  isDesign,
}) {
  const checkpointWinners = [];
  const finalWinners = [];
  if (winners) {
    winners.forEach(w => (
      w.type === 'checkpoint'
        ? checkpointWinners.push(w)
        : finalWinners.push(w)
    ));
  }

  return (
    <div styleName="container">
      {
        checkpointWinners.length && finalWinners.length ? (
          <h1 styleName="section-title">Final Winners</h1>
        ) : null
      }
      {
        finalWinners.length ?
          finalWinners.map(w => (
            <Winner
              isDesign={isDesign}
              key={`${w.handle}-${w.placement}`}
              prizes={prizes}
              submissions={submissions}
              viewable={viewable}
              winner={w}
            />
          )) : null
      }
      {
        checkpointWinners.length ? (
          <h1 styleName="section-title">Checkpoint Winners</h1>
        ) : null
      }
      {
        checkpointWinners.length ? (
          checkpointWinners.map(w => (
            <Winner
              checkpointPrize={checkpointPrize}
              isDesign={isDesign}
              key={`${w.handle}-${w.placement}`}
              prizes={prizes}
              submissions={submissions}
              viewable={viewable}
              winner={w}
            />
          ))
        ) : null
      }
    </div>
  );
}

Winners.defaultProps = {
  checkpointPrize: 0,
  winners: [],
  prizes: [],
  submissions: [],
  viewable: false,
  isDesign: false,
};

Winners.propTypes = {
  checkpointPrize: PT.number,
  winners: PT.arrayOf(PT.shape()),
  prizes: PT.arrayOf(PT.number),
  submissions: PT.arrayOf(PT.shape()),
  viewable: PT.bool,
  isDesign: PT.bool,
};
