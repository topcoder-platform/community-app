/* eslint jsx-a11y/no-static-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import Tooltip from 'components/Tooltip';
import { Link } from 'react-router-dom';
import { config } from 'topcoder-react-utils';

import EligibleEvents from './EligibleEvents';

import ShareSocial from './ShareSocial';

import styles from './styles.scss';

export default function SideBar({
  challengesUrl,
  legacyId,
  documents,
  eventDetail,
  shareable,
  forumLink,
  hasRegistered,
  reviewType,
  isDesign,
  terms,
  isDevelop,
  environment,
  codeRepo,
  isMM,
  metadata,
  reviewScorecardId,
  screeningScorecardId,
}) {
  const scorecardURL = `${config.URL.ONLINE_REVIEW}/review/actions/ViewScorecard?scid=`;
  const faqURL = config.URL.INFO.DESIGN_CHALLENGE_SUBMISSION;
  let submissionLimitDisplay = 'Unlimited';
  const submissionLimit = _.find(metadata, { name: 'submissionLimit' });
  const fileTypes = _.find(metadata, { name: 'fileTypes' });

  if (submissionLimit) {
    if (submissionLimit.value === 1) {
      submissionLimitDisplay = '1 submission';
    } else if (submissionLimit.value > 1) {
      submissionLimitDisplay = `${submissionLimit.value} submissions`;
    }
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

  const reviewScorecardTip = (
    <div styleName="tctooltiptext tooltiptextapproval">
      <h4>
        See how you&apos;ll be reviewed.
      </h4>
      <p>
        Make sure you review the scorecard before you start.
        This will show you how your submission will be judged and scored.
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
                    const url = `${config.URL.COMMUNITY}/tc?module=DownloadDocument&docid=${doc.documentId}`;
                    return (
                      <li key={url}>
                        <a href={url}>
                          {doc.documentName}
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          )
        }
        <EligibleEvents eventDetails={eventDetail} />
        {
          !isDesign && !isMM && (
          <div>
            <h2>
              REVIEW STYLE:
            </h2>
            <h3>
              Final Review:
            </h3>
            <span styleName="link-like-paragraph tooltip-container">
              {reviewTypeTitle}
              <Tooltip id="review-tip" content={reviewTip} trigger={['hover', 'focus']}>
                <div styleName="tctooltip" tabIndex="0" role="button" aria-describedby="review-tip">
                  ?
                </div>
              </Tooltip>
            </span>
            <h3>
              Approval:
            </h3>
            <span styleName="link-like-paragraph tooltip-container">
              User Sign-Off
              <Tooltip id="approval-tip" content={approvalTip} className={styles['tooltip-overlay']} trigger={['hover', 'focus']}>
                <div styleName="tctooltip" tabIndex="0" role="button" aria-describedby="approval-tip">
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
            <h2>
              CHALLENGE LINKS:
            </h2>
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
              <span styleName="link-like-paragraph tooltip-container">
                <a href={`${scorecardURL}${reviewScorecardId}`}>
                  Review Scorecard
                </a>
                <Tooltip id="reviewscorecard-tip" content={reviewScorecardTip} className={styles['tooltip-overlay']} trigger={['hover', 'focus']}>
                  <div styleName="tctooltip" tabIndex="0" role="button" aria-describedby="reviewscorecard-tip">
                    ?
                  </div>
                </Tooltip>
              </span>
              )
            }
          </div>
          )
        }
        {
          isDesign
          && (
          <div>
            <h2>
              SUBMISSION FORMAT:
            </h2>
            <h3>
              Your Design Files:
            </h3>
            <ol>
              <li>
                Look for instructions in this challenge regarding what files to provide.
              </li>
              <li>
                Place your submission files into a &quot;Submission.zip&quot; file.
              </li>
              <li>
                Place all of your source files into a &quot;Source.zip&quot; file.
              </li>
              <li>
                Declare your fonts, stock photos, and icons in a &quot;Declaration.txt&quot; file.
              </li>
              <li>
                Create a JPG preview file.
              </li>
              <li>
                Place the 4 files you just created into a single zip file.
                This will be what you upload.
              </li>
            </ol>
            <p styleName="link-like-paragraph">
              Trouble formatting your submission or want to learn more?
              &zwnj;
              <a href={faqURL}>
                Read the FAQ.
              </a>
            </p>
            <h3>
              Fonts, Stock Photos, and Icons:
            </h3>
            <p styleName="link-like-paragraph">
              All fonts, stock photos, and icons within your design must be declared
              when you submit. DO NOT include any 3rd party files in your
              submission or source files. Read about the
              {' '}
              <a href="https://help.topcoder.com/hc/en-us/articles/217959447-Font-Policy-for-Design-Challenges">
                policy.
              </a>
            </p>
            <h3>
              Screening:
            </h3>
            <p styleName="link-like-paragraph">
              All submissions are screened for eligibility before the challenge
              holder picks winners. Don
              &quot;
              t let your hard work go to waste. Learn more about how to
              &nbsp;
              <a href="https://help.topcoder.com/hc/en-us/articles/217959577-How-to-Pass-Screening-in-Design-Challenges">
                pass screening.
              </a>
            </p>
            <p styleName="link-like-paragraph">
              Questions?
              &zwnj;
              <a href={forumLink}>
                Ask in the Challenge Discussion Forums.
              </a>
            </p>
            <h2>
              SOURCE FILES:
            </h2>
            {
              fileTypes
              && (
                <ul styleName="source-files-list">
                  {
                    fileTypes.value && fileTypes.value.length > 0
                      ? JSON.parse(fileTypes.value).map(fileT => (
                        <li key={fileT}>
                          {fileT}
                        </li>
                      ))
                      : undefined
                  }
                </ul>
              )
            }
            <p styleName="link-like-paragraph">
              You must include all source files with your submission.
            </p>
            <h2>
              SUBMISSION LIMIT:
            </h2>
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
            <h2>
              CHALLENGE TERMS:
            </h2>
            <div styleName="link-like-paragraph">
              {
                terms.map(t => (
                  <div styleName="term" key={t.id}>
                    <Link
                      to={`${challengesUrl}/terms/detail/${t.id}`}
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
            <h2>
              SHARE:
            </h2>
            <ShareSocial />
          </div>
        )}
        { legacyId && (
          <div styleName="legacy-challenge-id">
            <h3>ID: {legacyId}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

SideBar.defaultProps = {
  eventDetail: null,
  documents: undefined,
  hasRegistered: false,
  reviewType: 'COMMUNITY',
  isDesign: false,
  terms: [],
  isDevelop: false,
  environment: '',
  codeRepo: '',
  isMM: false,
  metadata: {},
  reviewScorecardId: '',
  screeningScorecardId: '',
  legacyId: '',
};

SideBar.propTypes = {
  challengesUrl: PT.string.isRequired,
  legacyId: PT.string,
  eventDetail: PT.shape({
    eventName: PT.string.isRequired,
    description: PT.string.isRequired,
  }),
  documents: PT.arrayOf(PT.shape()),
  shareable: PT.bool.isRequired,
  forumLink: PT.string.isRequired,
  hasRegistered: PT.bool,
  reviewType: PT.string,
  isDesign: PT.bool,
  terms: PT.arrayOf(PT.shape()),
  isDevelop: PT.bool,
  environment: PT.string,
  codeRepo: PT.string,
  isMM: PT.bool,
  metadata: PT.shape(),
  reviewScorecardId: PT.string,
  screeningScorecardId: PT.string,
};
