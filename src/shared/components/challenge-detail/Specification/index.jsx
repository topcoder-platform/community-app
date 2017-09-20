/*
  Component renders challenge details and specifications
*/

import config from 'utils/config';
import React from 'react';
import PT from 'prop-types';

import SideBar from './SideBar';

import './styles.scss';

export default function ChallengeDetailsView(props) {
  const {
    terms,
    hasRegistered,
    openTermsModal,
    challenge: {
      introduction,
      detailedRequirements,
      track,
      screeningScorecardId,
      reviewScorecardId,
      forumLink,
      submissionLimit,
      mainEvent,
      documents,
      technologies,
      fileTypes,
      numberOfCheckpointsPrizes,
      round1Introduction,
      round2Introduction,
      allowStockArt,
      finalSubmissionGuidelines,
    },
  } = props;

  const isDataScience = technologies.includes('Data Science');
  let accentedStyle = 'challenge-specs-design';
  if (track.toLowerCase() === 'develop') {
    accentedStyle = isDataScience ? 'challenge-specs-datasci' : 'challenge-specs-develop';
  }

  const stockArtText = allowStockArt ?
    'Stock photography is allowed in this challenge.' :
    'Stock photography is not allowed in this challenge. All submitted elements must be designed solely by you.';
  return (
    <div styleName="challenge-details-view">
      <div styleName="challenge-specifications">
        <div styleName={`challenge-specs-main ${accentedStyle}`}>
          {
            track.toLowerCase() !== 'design' ?
              (
                <div>
                  {
                    detailedRequirements &&
                    <article>
                      <h2>Challenge Overview</h2>
                      <div
                        /* eslint-disable react/no-danger */
                        dangerouslySetInnerHTML={{
                          __html: detailedRequirements,
                        }}
                        /* eslint-enable react/no-danger */
                      />
                    </article>
                  }
                  {
                    finalSubmissionGuidelines &&
                    <article>
                      <h2>Final Submission Guidelines</h2>
                      <div
                        /* eslint-disable react/no-danger */
                        dangerouslySetInnerHTML={{
                          __html: finalSubmissionGuidelines,
                        }}
                        /* eslint-enable react/no-danger */
                      />
                    </article>
                  }
                </div>
              ) :
              (
                <div>
                  {
                    introduction &&
                    <article>
                      <h2>Challenge Summary</h2>
                      <div
                        /* eslint-disable react/no-danger */
                        dangerouslySetInnerHTML={{
                          __html: introduction,
                        }}
                        /* eslint-enable react/no-danger */
                      />
                      <p />
                      <p styleName="note">
                        Please read the challenge specification carefully and
                        watch the forums for any questions or feedback
                        concerning this challenge. It is important that you
                        monitor any updates provided by the client or Studio
                        Admins in the forums. Please post any questions you
                        might have for the client in the forums.
                      </p>
                    </article>
                  }
                  {
                    numberOfCheckpointsPrizes > 0 &&
                    <article>
                      <h2>Challenge Format</h2>
                      <p>This competition will be run as a two-round challenge.</p>
                      {
                        round1Introduction &&
                        <div>
                          <h3>Round 1</h3>
                          <div
                            /* eslint-disable react/no-danger */
                            dangerouslySetInnerHTML={{
                              __html: round1Introduction,
                            }}
                            /* eslint-enable react/no-danger */
                          />
                        </div>
                      }
                      {
                        round2Introduction &&
                        <div>
                          <h3>Round 2</h3>
                          <div
                            /* eslint-disable react/no-danger */
                            dangerouslySetInnerHTML={{
                              __html: round2Introduction,
                            }}
                            /* eslint-enable react/no-danger */
                          />
                        </div>
                      }
                      <div styleName="note">
                        <p>Regarding the Rounds:</p>
                        <ul>
                          <li>To be eligible for Round 1 prizes and design feedback,
                            you must submit before the Checkpoint deadline.
                          </li>
                          <li>
                            A day or two after the Checkpoint deadline, the challenge holder
                            will announce Round 1 winners and provide design feedback to those
                            winners in the &ldquo;Checkpoints&rdquo; tab above.
                          </li>
                          <li>
                            You must submit to Round 1 to be eligible to compete in Round 2.
                            If your submission fails screening for a small mistake in Round 1,
                            you may still be eligible to submit to Round 2.
                          </li>
                          <li>
                            Every competitor with a passing Round 1 submission can submit to
                            Round 2, even if they didn&apos;t win a Checkpoint prize.
                          </li>
                          <li>
                            <a href={config.URL.INFO.DESIGN_CHALLENGE_CHECKPOINTS}>
                              Learn more here
                            </a>.
                          </li>
                        </ul>
                      </div>
                    </article>
                  }
                  {
                    detailedRequirements &&
                    <article>
                      <h2>Full Description & Project Guide</h2>
                      <div
                        /* eslint-disable react/no-danger */
                        dangerouslySetInnerHTML={{
                          __html: detailedRequirements,
                        }}
                        /* eslint-enable react/no-danger */
                      />
                    </article>
                  }
                  <article>
                    <h2>Stock Photography</h2>
                    <p>
                      {stockArtText}&nbsp;
                      <a href={config.URL.INFO.STOCK_ART_POLICY}>
                        See this page for more details.
                      </a>
                    </p>
                  </article>
                  <article>
                    <h2>How To Submit</h2>
                    <ul>
                      <li>
                        New to Studio?
                        &zwnj;<a href={config.URL.INFO.DESIGN_CHALLENGE_TYPES}>
                          Learn how to compete here
                        </a>.
                      </li>
                      <li>
                        Upload your submission in three parts (
                        <a href={config.URL.INFO.DESIGN_CHALLENGE_SUBMISSION}>
                          Learn more here
                        </a>
                        ). Your design should be finalized and should contain only a single design
                        concept (do not include multiple designs in a single submission).
                      </li>
                      <li>
                        If your submission wins, your source files must be correct and &ldquo;
                        <a href={config.URL.INFO.DESIGN_CHALLENGES}>
                          Final Fixes
                        </a>&rdquo;
                        (if applicable) must be completed before payment can be released.
                      </li>
                      <li>
                        You may submit as many times as you&apos;d like during
                        the submission phase, but only the number of files
                        listed above in the Submission Limit that you rank the
                        highest will be considered. You can change the order of
                        your submissions at any time during the submission
                        phase. If you make revisions to your design, please
                        delete submissions you are replacing.
                      </li>
                    </ul>
                  </article>

                  <article>
                    <h2>Winner Selection</h2>
                    <p>
                      Submissions are viewable to the client as they are entered
                      into the challenge. Winners are selected by the client and
                      are chosen solely at the Client&apos;s discretion.
                    </p>
                  </article>
                </div>
              )
          }
          <article>
            <h2>Payments</h2>
            <p>
              Topcoder will compensate members in accordance with the payment
              structure of this challenge. Initial payment for the winning
              member will be distributed in two installments. The first payment
              will be made at the closure of the approval phase. The second
              payment will be made at the completion of the
              support period.
            </p>
          </article>
          <article>
            <h2>Reliability Rating and Bonus</h2>
            <p>
              For challenges that have a reliability bonus, the bonus depends
              on the reliability rating at the moment of registration for that
              project. A participant with no previous projects is considered to
              have no reliability rating, and therefore gets no bonus.
              Reliability bonus does not apply to Digital Run winnings. Since
              reliability rating is based on the past 15 projects, it can only
              have 15 discrete values.
              <br />
              <a href={config.URL.INFO.RELIABILITY_RATINGS_AND_BONUSES}>
                Read more.
              </a>
            </p>
          </article>
        </div>
      </div>
      <SideBar
        screeningScorecardId={screeningScorecardId}
        reviewScorecardId={reviewScorecardId}
        forumLink={forumLink}
        submissionLimit={submissionLimit}
        eventDetail={mainEvent}
        documents={documents}
        hasRegistered={hasRegistered}
        fileTypes={fileTypes}
        isDesign={track.toLowerCase() === 'design'}
        terms={terms}
        openTermsModal={openTermsModal}
      />
    </div>
  );
}

ChallengeDetailsView.defaultProps = {
  terms: [],
  challenge: {
    introduction: undefined,
    detailedRequirements: undefined,
    track: 'design',
    screeningScorecardId: undefined,
    reviewScorecardId: undefined,
    submissionLimit: 0,
    mainEvent: undefined,
    forumLink: '',
    reviewType: undefined,
    technologies: '',
    fileTypes: [],
    numberOfCheckpointsPrizes: 0,
    round1Introduction: '',
    round2Introduction: '',
    allowStockArt: false,
    finalSubmissionGuidelines: '',
  },
};

ChallengeDetailsView.propTypes = {
  terms: PT.arrayOf(PT.shape()),
  hasRegistered: PT.bool.isRequired,
  challenge: PT.shape({
    introduction: PT.string,
    detailedRequirements: PT.string,
    track: PT.string.isRequired,
    screeningScorecardId: PT.number,
    reviewScorecardId: PT.number,
    forumLink: PT.string,
    submissionLimit: PT.number,
    mainEvent: PT.shape(),
    reviewType: PT.string,
    technologies: PT.string,
    fileTypes: PT.arrayOf(PT.string),
    numberOfCheckpointsPrizes: PT.number,
    round1Introduction: PT.string,
    round2Introduction: PT.string,
    allowStockArt: PT.bool,
    finalSubmissionGuidelines: PT.string,
  }),
  openTermsModal: PT.func.isRequired,
};
