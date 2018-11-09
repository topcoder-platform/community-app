/* eslint jsx-a11y/no-static-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';

import Tooltip from 'components/Tooltip';
import { Link } from 'react-router-dom';
import { config } from 'topcoder-react-utils';

import ShareSocial from './ShareSocial';

import styles from './styles.scss';

export default function SideBar({
  challengesUrl,
  documents,
  eventDetail,
  reviewScorecardId,
  screeningScorecardId,
  shareable,
  forumLink,
  submissionLimit,
  hasRegistered,
  fileTypes,
  reviewType,
  isDesign,
  terms,
  isDevelop,
  environment,
  codeRepo,
  isMM,
}) {
  const scorecardURL = `${config.URL.ONLINE_REVIEW}/review/actions/ViewScorecard?scid=`;
  const faqURL = config.URL.INFO.DESIGN_CHALLENGE_SUBMISSION;
  let submissionLimitDisplay = 'Unlimited';
  if (submissionLimit === 1) {
    submissionLimitDisplay = '1 submission';
  } else if (submissionLimit > 1) {
    submissionLimitDisplay = `${submissionLimit} submissions`;
  }

  const reviewTypeTitle = reviewType === 'PEER' ? 'Peer Review' : 'Community Review Board';
  const reviewTypeDescription = (
    reviewType === 'PEER'
      ? 'Your peers performs a thorough review based on scorecards.'
      : 'Community Review Board performs a thorough review based on scorecards.'
  );

  const reviewTip = (
    <div styleName="tctooltiptext tooltiptextreview">
      <h4>
Final Review:
      </h4>
      <p>
        {reviewTypeDescription}
      </p>
    </div>
  );

  const approvalTip = (
    <div styleName="tctooltiptext tooltiptextapproval">
      <h4>
Approval:
      </h4>
      <p>
Customer has final opportunity to sign-off on the delivered assets.
      </p>
    </div>
  );

  return (
    <div styleName="challenge-spec-sidebar">
      <div styleName="challenge-sidebar-inner">
        {
          hasRegistered && documents && documents.length > 0 && (
            <div>
              <h3>
DOWNLOADS:
              </h3>
              <ul>
                {
                  documents.map((doc) => {
                    const url = `${config.URL.COMMUNITY}/tc?module=DownloadDocument&docid=${doc.documentid}`;
                    return (
                      <li key={url}>
                        <a href={url}>
                          {doc.documentname}
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          )
        }
        {eventDetail && (
          <div>
            <h3>
ELIGIBLE EVENTS:
            </h3>
            <p styleName="link-like-paragraph">
              {/* TODO: It is not good to compose the event URL like this, as
                * in general there is not guaranteed to be correct. */}
              <a href={`//${eventDetail.eventName}.topcoder.com`}>
                {eventDetail.description}
              </a>
            </p>
          </div>
        )}
        {
          !isDesign && !isMM && (
          <div>
            <h3>
REVIEW STYLE:
            </h3>
            <h4>
Final Review:
            </h4>
            <span styleName="link-like-paragraph tooltip-container">
              {reviewTypeTitle}
              <Tooltip content={reviewTip}>
                <div styleName="tctooltip">
?
                </div>
              </Tooltip>
            </span>
            <h4>
Approval:
            </h4>
            <span styleName="link-like-paragraph tooltip-container">
              User Sign-Off
              <Tooltip content={approvalTip} className={styles['tooltip-overlay']}>
                <div styleName="tctooltip">
?
                </div>
              </Tooltip>
            </span>
          </div>
          )
        }
        {
          !isMM && (
          <div>
            <h3>
  CHALLENGE LINKS:
            </h3>
            {
              isDevelop && environment && environment.length > 0
              && (
              <p styleName="link-like-paragraph">
                <a href={`${environment}`}>
  Environment
                </a>
              </p>
              )
            }
            {
              isDevelop && codeRepo && codeRepo.length > 0
              && (
              <p styleName="link-like-paragraph">
                <a href={`${codeRepo}`}>
  Code Repository
                </a>
              </p>
              )
            }
            {
              screeningScorecardId > 0
              && (
              <p styleName="link-like-paragraph">
                <a href={`${scorecardURL}${screeningScorecardId}`}>
  Screening Scorecard
                </a>
              </p>
              )
            }
            {
              reviewScorecardId > 0 && !isDesign
              && (
              <p styleName="link-like-paragraph">
                <a href={`${scorecardURL}${reviewScorecardId}`}>
  Review Scorecard
                </a>
              </p>
              )
            }
          </div>
          )
        }
        {
          isDesign
          && (
          <div>
            <h3>
SUBMISSION FORMAT:
            </h3>
            <h4>
Your Design Files:
            </h4>
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
            <p styleName="link-like-paragraph">
              Trouble formatting your submission or want to learn more?
              &zwnj;
              <a href={faqURL}>
Read the FAQ.
              </a>
            </p>
            <h4>
Fonts:
            </h4>
            <p styleName="link-like-paragraph">
              All fonts within your design must be declared when you submit.
              DO NOT include any font files in your submission or source files.
              Read about the font policy
              <a href="https://help.topcoder.com/hc/en-us/articles/217959447-Font-Policy-for-Design-Challenges">
                here.
              </a>
            </p>
            <h4>
Screening:
            </h4>
            <p styleName="link-like-paragraph">
              All submissions are screened for eligibility before the challenge
              holder picks winners. Don
              {"'"}
t let your hard work go to waste.
              Learn more about how to pass screening
              <a href="https://help.topcoder.com/hc/en-us/articles/217959577-How-to-Pass-Screening-in-Design-Challenges">
                here.
              </a>
            </p>
            <p styleName="link-like-paragraph">
              Questions?
              &zwnj;
              {
                <a href={forumLink}>
                  Ask in the Challenge Discussion Forums.
                </a>
              }
            </p>
            <h3>
SOURCE FILES:
            </h3>
            <ul styleName="source-files-list">
              {
                fileTypes && fileTypes.length > 0
                  ? fileTypes.map(fileT => (
                    <li key={fileT}>
                      {fileT}
                    </li>
                  ))
                  : undefined
              }
            </ul>
            <p styleName="link-like-paragraph">
              You must include all source files with your submission.
            </p>
            <h3>
SUBMISSION LIMIT:
            </h3>
            <p styleName="link-like-paragraph">
              {
                submissionLimit
                  ? submissionLimitDisplay : (
                    <strong>
                      {submissionLimitDisplay}
                    </strong>
                  )
              }
            </p>
          </div>
          )
        }
        {
          terms.length > 0
          && (
          <div>
            <h3>
CHALLENGE TERMS:
            </h3>
            <div styleName="link-like-paragraph">
              {
                terms.map(t => (
                  <div styleName="term" key={t.termsOfUseId}>
                    <Link
                      to={`${challengesUrl}/terms/detail/${t.termsOfUseId}`}
                    >
                      {t.title}
                    </Link>
                  </div>
                ))
              }
            </div>
          </div>
          )
        }
        { shareable && (
          <div>
            <h3>
SHARE:
            </h3>
            <ShareSocial />
          </div>
        )}
      </div>
    </div>
  );
}

SideBar.defaultProps = {
  eventDetail: null,
  documents: undefined,
  screeningScorecardId: 0,
  reviewScorecardId: 0,
  submissionLimit: 0,
  fileTypes: [],
  hasRegistered: false,
  reviewType: 'COMMUNITY',
  isDesign: false,
  isMM: false,
  terms: [],
  isDevelop: false,
  environment: '',
  codeRepo: '',
};

SideBar.propTypes = {
  challengesUrl: PT.string.isRequired,
  eventDetail: PT.shape({
    eventName: PT.string.isRequired,
    description: PT.string.isRequired,
  }),
  documents: PT.arrayOf(PT.shape()),
  screeningScorecardId: PT.number,
  shareable: PT.bool.isRequired,
  reviewScorecardId: PT.number,
  forumLink: PT.string.isRequired,
  submissionLimit: PT.number,
  fileTypes: PT.arrayOf(PT.string),
  hasRegistered: PT.bool,
  reviewType: PT.string,
  isDesign: PT.bool,
  isMM: PT.bool,
  terms: PT.arrayOf(PT.shape()),
  isDevelop: PT.bool,
  environment: PT.string,
  codeRepo: PT.string,
};
