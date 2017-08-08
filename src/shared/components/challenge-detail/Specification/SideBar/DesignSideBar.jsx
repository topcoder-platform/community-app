import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';

import ShareSocial from './ShareSocial';

import '../styles.scss';

export default function DesignSideBar({
  documents,
  eventDetail,
  screeningScorecardId,
  reviewScorecardId,
  forumLink,
  submissionLimit,
  hasRegistered,
  fileTypes,
}) {
  const scorecardURL = `${config.URL.ONLINE_REVIEW}/review/actions/ViewScorecard?scid=`;
  const faqURL = config.URL.INFO.DESIGN_CHALLENGE_SUBMISSION;
  /* TODO: This should be got from challenge terms endpoint! */
  const challengeTermsURL = (
    'https://www.topcoder.com/challenge-details/terms/detail/21193/'
  );
  let submissionLimitDisplay = 'Unlimited';
  if (submissionLimit === 1) {
    submissionLimitDisplay = '1 submission';
  } else if (submissionLimit > 1) {
    submissionLimitDisplay = `${submissionLimit} submissions`;
  }

  let downloadsPlaceHolder = 'None';
  if (!hasRegistered) {
    downloadsPlaceHolder = 'Register to Download Files (if available)';
  }

  return (
    <div styleName="challenge-spec-sidebar">
      <div styleName="challenge-sidebar-inner">
        <h3>DOWNLOADS:</h3>
        {
          hasRegistered && documents && documents.length > 0 ? (
            <ul>
              {
                documents.map(doc => (
                  <li key={doc.url}><a href={doc.url}>{doc.documentName}</a></li>
                ))
              }
            </ul>
          ) :
            <p>{downloadsPlaceHolder}</p>
        }
        {eventDetail && (
          <div>
            <h3>ELIGIBLE EVENTS:</h3>
            <p styleName="link-like-paragraph">
              {/* TODO: It is not good to compose the event URL like this, as
                * in general there is not guaranteed to be correct. */}
              <a href={`//${eventDetail.eventName}.topcoder.com`}>
                {eventDetail.description}
              </a>
            </p>
          </div>
        )}
        <h3>CHALLENGE LINKS:</h3>
        {
          screeningScorecardId &&
          <p><a href={`${scorecardURL}${screeningScorecardId}`}>Screening Scorecard</a></p>
        }
        {
          reviewScorecardId &&
          <p><a href={`${scorecardURL}${reviewScorecardId}`}>Review Scorecard</a></p>
        }
        <h3>SUBMISSION FORMAT:</h3>
        <h4>Your Design Files:</h4>
        <ol>
          <li>
            {'Look for instructions in this challenge regarding what files to provide.'}
          </li>
          <li>
            {'Place your submission files into a "Submission.zip" file.'}
          </li>
          <li>
            {'Place all of your source files into a "Source.zip" file.'}
          </li>
          <li>
            {'Create a JPG preview file.'}
          </li>
        </ol>
        <p>
          Trouble formatting your submission or want to learn more?
          &zwnj;<a href={faqURL}>Read the FAQ.</a>
        </p>
        <h4>Fonts:</h4>
        <p>
          All fonts within your design must be declared when you submit.
          DO NOT include any font files in your submission or source files.
          Read about the font policy here.
        </p>
        <h4>Screening:</h4>
        <p>
          All submissions are screened for eligibility before the challenge holder picks winners.
          Don{"'"}t let your hard work go to waste.
          Learn more about how to pass screening here.
        </p>
        <br />
        <p>
          {
            'Questions? '
          }
          <a href={forumLink}>Ask in the Challenge Discussion Forums. </a>
        </p>
        <h3>SOURCE FILES:</h3>
        <ul>
          {
            fileTypes && fileTypes.length > 0 ?
              fileTypes.map(fileT => <li key={fileT}>{fileT}</li>) :
              undefined
          }
        </ul>
        <p>
          You must include all source files with your submission.
        </p>
        <h3>SUBMISSION LIMIT:</h3>
        <p>
          {
            submissionLimit ? submissionLimitDisplay : <strong>{submissionLimitDisplay}</strong>
          }
        </p>
        <h3>CHALLENGE TERMS:</h3>
        <p><a href={challengeTermsURL}>Standard Terms for TopCoder Competitions v2.1 </a></p>
        <h3>SHARE:</h3>
        <ShareSocial />
      </div>
    </div>
  );
}

DesignSideBar.defaultProps = {
  eventDetail: null,
  documents: undefined,
  screeningScorecardId: undefined,
  reviewScorecardId: undefined,
  submissionLimit: 0,
  fileTypes: [],
  hasRegistered: false,
};

DesignSideBar.propTypes = {
  eventDetail: PT.shape({
    eventName: PT.string.isRequired,
    description: PT.string.isRequired,
  }),
  documents: PT.shape(),
  screeningScorecardId: PT.number,
  reviewScorecardId: PT.number,
  forumLink: PT.string.isRequired,
  submissionLimit: PT.number,
  fileTypes: PT.arrayOf(PT.string),
  hasRegistered: PT.bool,
};
