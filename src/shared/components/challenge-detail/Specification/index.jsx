/*
  Component renders challenge details and specifications

  WARNING:
  dangerouslySetInnerHTML - is used to render html string.
*/

import React from 'react';
import PT from 'prop-types';

import DesignSideBar from './SideBar/DesignSideBar';
import DevelopSideBar from './SideBar/DevelopSideBar';

import './styles.scss';

function setHtml(htmlString) {
  return (input) => {
    if (input) {
      input.innerHTML = htmlString;// eslint-disable-line no-param-reassign
      // input.querySelectorAll('*').forEach(cur => {
      //  cur.removeAttribute('style');
      //  cur.removeAttribute('class');
      // });
    }
  };
}

export default function ChallengeDetailsView(props) {
  const {
    introduction,
    detailedRequirements,
    track,
    screeningScorecardId,
    reviewScorecardId,
    forumLink,
    submissionLimit,
    mainEvent,
    documents,
    userDetails,
    reviewType,
    technologies,
    fileTypes,
    numberOfCheckpointsPrizes,
    round1Introduction,
    round2Introduction,
    allowStockArt,
    finalSubmissionGuidelines,
  } = props.challenge;
  const hasRegistered = (
    userDetails && userDetails.roles && userDetails.roles.includes('Submitter')
  );
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
        {
          track.toLowerCase() !== 'design' ?
            (
              <div styleName={`challenge-specs-main ${accentedStyle}`}>
                {
                  detailedRequirements &&
                  <article>
                    <h2>Challenge Overview</h2>
                    <div ref={setHtml(detailedRequirements)} />
                  </article>
                }
                {
                  finalSubmissionGuidelines &&
                  <article>
                    <h2>Final Submission Guidelines</h2>
                    <div ref={setHtml(finalSubmissionGuidelines)} />
                  </article>
                }
                <article>
                  <h2>Payments</h2>
                  <p>
                    Topcoder will compensate members in accordance with the payment structure
                    of this challenge. Initial payment for the winning member will be distributed
                    in two installments. The first payment will be made at the closure of the
                    approval phase. The second payment will be made at the completion of the
                    support period.
                  </p>
                </article>
                <article>
                  <h2>Reliability Rating and Bonus</h2>
                  <p>
                    For challenges that have a reliability bonus, the bonus depends on the
                    reliability rating at the moment of registration for that project.
                    A participant with no previous projects is considered to have no reliability
                    rating, and therefore gets no bonus. Reliability bonus does not apply to
                    Digital Run winnings. Since reliability rating is based on the past 15
                    projects, it can only have 15 discrete values.
                    <br />
                    <a href="https://help.topcoder.com/hc/en-us/articles/219240797-Development-Reliability-Ratings-and-Bonuses">
                      Read more.
                    </a>
                  </p>
                </article>
              </div>
            ) :
            (
              <div styleName={`challenge-specs-main ${accentedStyle}`}>
                {
                  introduction &&
                  <article>
                    <h2>Challenge Summary</h2>
                    <div ref={setHtml(introduction)} />
                    <p />
                    <p styleName="note">
                      Please read the challenge specification carefully and watch the forums for any
                      questions or feedback concerning this challenge. It is important that you
                      monitor any updates provided by the client or Studio Admins in the forums.
                      Please post any questions you might have for the client in the forums.
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
                        <div ref={setHtml(round1Introduction)} />
                      </div>
                    }
                    {
                      round2Introduction &&
                      <div>
                        <h3>Round 2</h3>
                        <div ref={setHtml(round2Introduction)} />
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
                          winners in the {'"Checkpoints"'} tab above.
                        </li>
                        <li>
                          You must submit to Round 1 to be eligible to compete in Round 2.
                          If your submission fails screening for a small mistake in Round 1,
                          you may still be eligible to submit to Round 2.
                        </li>
                        <li>
                          Every competitor with a passing Round 1 submission can submit to
                          Round 2, even if they didn{"'"}t win a Checkpoint prize.
                        </li>
                        <li>
                          <a
                            href="https://help.topcoder.com/hc/en-us/articles/219240807-Multi-Round-Checkpoint-Design-Challenges"
                          >
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
                    <div ref={setHtml(detailedRequirements)} />
                  </article>
                }
                <article>
                  <h2>Stock Photography</h2>
                  <p>
                    {stockArtText}
                    <a
                      href="http://help.topcoder.com/hc/en-us/articles/217481408-Policy-for-Stock-Artwork-in-Design-Submissions"
                    >
                  See this page for more details.
                    </a>
                  </p>
                </article>
                <article>
                  <h2>How To Submit</h2>
                  <ul>
                    <li>
                      New to Studio?
                      <a
                        href="http://help.topcoder.com/hc/en-us/articles/217481388-Choosing-a-Design-Challenge"
                      >
                      Learn how to compete here
                      </a>.
                    </li>
                    <li>
                      Upload your submission in three parts (
                      <a
                        href="http://help.topcoder.com/hc/en-us/articles/219122667-Formatting-Your-Submission-for-Design-Challenges"
                      >
                      Learn more here
                      </a>
                      ). Your design should be finalized and should contain only a single design
                      concept (do not include multiple designs in a single submission).
                    </li>
                    <li>
                      If your submission wins, your source files must be correct and {'"'}
                      <a
                        href="http://help.topcoder.com/hc/en-us/categories/202610437-DESIGN"
                      >
                      Final Fixes
                      </a>{'""'}
                      (if applicable) must be completed before payment can be released.
                    </li>
                    <li>
                      You may submit as many times as you{"'"}d like during the submission phase,
                      but only the number of files listed above in the Submission Limit that
                      you rank the highest will be considered. You can change the order of your
                      submissions at any time during the submission phase. If you make revisions
                      to your design, please delete submissions you are replacing.
                    </li>
                  </ul>
                </article>

                <article>
                  <h2>Winner Selection</h2>
                  <p>
                  Submissions are viewable to the client as they are entered
                  into the challenge. Winners are selected by the client and
                  are chosen solely at the Client{"'"}s discretion.
                  </p>
                </article>

                <article>
                  <h2>Payments</h2>
                  <p>
                  Topcoder will compensate members in accordance with the
                  payment structure of this challenge.
                  Initial payment for the winning member will be distributed in two installments.
                  The first payment will be made at the closure of the approval phase.
                  The second payment will be made at the completion of the support period.
                  </p>
                </article>
                <article>
                  <h2>Reliability Rating and Bonus</h2>
                  <p>
                  For challenges that have a reliability bonus, the bonus depends on the
                  reliability rating at the moment of registration for that project.
                  A participant with no previous projects is considered to have no reliability
                  rating, and therefore gets no bonus. Reliability bonus does not apply to
                  Digital Run winnings. Since reliability rating is based on the past 15 projects,
                  it can only have 15 discrete values.
                    <br />
                    <a href="https://help.topcoder.com/hc/en-us/articles/219240797-Development-Reliability-Ratings-and-Bonuses">
                    Read more.
                    </a>
                  </p>
                </article>
              </div>
            )
        }
      </div>
      {
        track.toLowerCase() === 'design' ?
          <DesignSideBar
            screeningScorecardId={screeningScorecardId}
            reviewScorecardId={reviewScorecardId}
            forumLink={forumLink}
            submissionLimit={submissionLimit}
            eventDetail={mainEvent}
            documents={documents}
            hasRegistered={hasRegistered}
            fileTypes={fileTypes}
          /> :
          <DevelopSideBar
            documents={documents}
            eventDetail={mainEvent}
            screeningScorecardId={screeningScorecardId}
            reviewScorecardId={reviewScorecardId}
            forumLink={forumLink}
            hasRegistered={hasRegistered}
            isDataScience={isDataScience}
            reviewType={reviewType}
          />
      }
    </div>
  );
}

ChallengeDetailsView.defaultProps = {
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
};
