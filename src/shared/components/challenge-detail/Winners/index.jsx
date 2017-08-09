/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Winners tab component.
 */

import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import config from 'utils/config';

import './style.scss';

function getId(submissions, winner) {
  const found = _.find(submissions, s => ((s.submitter || s.handle) === winner.handle &&
    (s.submissionTime || s.submissionDate) === winner.submissionDate)) || {};
  return found.submissionId;
}

export default function Winners(props) {
  const {
    results,
    prizes,
    submissions,
    viewable,
    isDesign,
  } = props;

  results.sort((a, b) => a.placement - b.placement);
  const winners = results.slice(0, prizes.length);

  return (
    <div styleName="container">
      {
        winners.map((w) => {
          const submissionId = getId(submissions, w);
          return (
            <div
              styleName={cn('winner', {
                'place-1': w.placement === 1,
                'place-2': w.placement === 2,
                'place-3': w.placement === 3 })}
              key={w.handle}
            >
              <div styleName="thumbnail">
                <div styleName="flag">{w.placement}</div>
                {
                  (submissionId && viewable && isDesign) ?
                    (
                      <img
                        styleName="preview"
                        alt=""
                        src={`${config.URL.STUDIO}/studio.jpg` +
                          `?module=DownloadSubmission&sbmid=${submissionId}&sbt=small&sfi=1`}
                      />
                    ) :
                    (
                      <div styleName="lock">
                        <div styleName="image" />
                        <div styleName="text">LOCKED</div>
                      </div>
                    )
                }
              </div>
              <div styleName="info">
                <a
                  href={`${config.URL.BASE}/members/${w.handle}`}
                  styleName="handle"
                >{w.handle}</a>
                <div styleName="prize">{`$${prizes[w.placement - 1].toLocaleString()}`}</div>
                {
                  submissionId &&
                  <div styleName="id">ID: <span>#{getId(submissions, w)}</span></div>
                }
                {
                  w.submissionDownloadLink &&
                  <a
                    styleName="download"
                    target="_blank"
                    href={w.submissionDownloadLink}
                  >Download</a>
                }
                <div styleName="date">
                  <span>Submitted on: </span>
                  <span>{moment(w.submissionDate).format('MMM DD, YYYY HH:mm')} EDT</span>
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

Winners.defaultProps = {
  results: [],
  prizes: [],
  submissions: [],
  viewable: false,
  isDesign: false,
};

Winners.propTypes = {
  results: PT.arrayOf(PT.shape()),
  prizes: PT.arrayOf(PT.number),
  submissions: PT.arrayOf(PT.shape()),
  viewable: PT.bool,
  isDesign: PT.bool,
};
