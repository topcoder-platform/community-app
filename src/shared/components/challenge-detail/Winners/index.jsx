/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Winners tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import config from 'utils/config';

import Lock from '../icons/lock.svg';
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

  const maxPlace = Number.MAX_SAFE_INTEGER;
  if (results) {
    results.sort((a, b) => (_.isNumber(a.placement) ? a.placement : maxPlace) -
      (_.isNumber(b.placement) ? b.placement : maxPlace));
  }

  const winners = results && results.slice(0, prizes.length);

  return (
    <div styleName="container">
      {
        winners && winners.map((w) => {
          const placeStyle = w.placement > 0 && w.placement < 4 ?
            `place-${w.placement}` : '';
          const submissionId = getId(submissions, w);
          return (
            <div
              styleName={`winner ${placeStyle}`}
              key={submissionId}
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
                        <Lock styleName="lock-icon" />
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
                  (w.submissionDownloadLink && viewable) &&
                  <a
                    styleName="download"
                    target="_blank"
                    href={isDesign ? `${config.URL.STUDIO}/?module=DownloadSubmission&sbmid=${submissionId}` : w.submissionDownloadLink}
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
