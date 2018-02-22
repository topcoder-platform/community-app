/*
  Component renders challenge details and specifications
*/

import _ from 'lodash';
import config from 'utils/config';
import Editor, { MODES as EDITOR_MODES } from 'components/Editor/MultiEditor';
import EditorToolbar from 'components/Editor/Toolbar';
import Previewer from 'components/Editor/Previewer';
import ToolbarConnector from 'components/Editor/Connector';
import React from 'react';
import Sticky from 'react-stickynode';

import PT from 'prop-types';
import { DangerButton } from 'topcoder-react-ui-kit';
import { SPECS_TAB_STATES } from 'actions/page/challenge-details';
// import { editorStateToHTML } from 'utils/editor';

import SaveConfirmationModal from './SaveConfirmationModal';
import SideBar from './SideBar';

import style from './styles.scss';

export default function ChallengeDetailsView(props) {
  const {
    communitiesList,
    terms,
    hasRegistered,
    challenge,
    challengesUrl,
    savingChallenge,
    setSpecsTabState,
    specsTabState,
    updateChallenge,
  } = props;

  const {
    forumId,
    groups,
    introduction,
    detailedRequirements,
    track,
    screeningScorecardId,
    reviewScorecardId,
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
    environment,
    codeRepo,
    userDetails,
  } = challenge;

  const roles = (userDetails || {}).roles || [];

  let forumLink = track.toLowerCase() === 'design'
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;
  forumLink = `${config.URL.FORUMS}${forumLink}`;

  let isWipro = false;
  const wiproCommunity = communitiesList.find(x => x.communityId === 'wipro');
  if (wiproCommunity) {
    isWipro = wiproCommunity.groupIds.some(id => groups[id]);
  }

  const isDataScience = technologies.includes('Data Science');
  let accentedStyle = 'challenge-specs-design';
  if (track.toLowerCase() === 'develop') {
    accentedStyle = isDataScience ? 'challenge-specs-datasci' : 'challenge-specs-develop';
  }

  const canEdit = roles.some(x => x === 'Copilot' || x === 'Manager');
  const editMode = specsTabState === SPECS_TAB_STATES.EDIT;
  const toolbarConnector = new ToolbarConnector();
  const isSaving = specsTabState === SPECS_TAB_STATES.SAVING;

  const stockArtText = allowStockArt ?
    'Stock photography is allowed in this challenge.' :
    'Stock photography is not allowed in this challenge. All submitted elements must be designed solely by you.';

  /**
   * Saves updated challenge into API.
   */
  const saveChallenge = () => {
    setSpecsTabState(SPECS_TAB_STATES.SAVING);
    const updatedChallenge = {};
    updatedChallenge.id = challenge.id;
    updatedChallenge.reviewType = challenge.reviewType;
    _.forIn(toolbarConnector.editors, (x) => {
      // const html = editorStateToHTML(x.state.editorState.getCurrentContent());
      updatedChallenge[x.id] = x.getHtml();
    });
    updateChallenge(updatedChallenge);
  };

  /* TODO: This render markup is monstrous - should be refactored. */
  return (
    <div>
      {
        isSaving ? (
          <SaveConfirmationModal
            onDone={() => setSpecsTabState(SPECS_TAB_STATES.VIEW)}
            saving={savingChallenge}
          />
        ) : null
      }
      {
        canEdit && !editMode ? (
          <Sticky innerZ={100}>
            <DangerButton
              onClick={() => setSpecsTabState(SPECS_TAB_STATES.EDIT)}
              theme={{ button: style.hiddenSaveButton }}
            >Don&apos;t press it!</DangerButton>
          </Sticky>
        ) : null
      }
      {
        editMode ? (
          <div>
            <EditorToolbar
              connector={toolbarConnector}
              nodeId="editor-toolbar"
              onSave={saveChallenge}
            />
            <Sticky innerZ={1} top="#editor-toolbar">
              <Previewer connector={toolbarConnector} />
            </Sticky>
          </div>
        ) : null
      }
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
                        <h2 styleName="h2">Challenge Overview</h2>
                        {
                          editMode ? (
                            <Editor
                              connector={toolbarConnector}
                              id="detailedRequirements"
                              initialMode={EDITOR_MODES.WYSIWYG}
                              ref={n => n && n.setHtml(detailedRequirements)}
                            />
                          ) : (
                            <div
                              /* eslint-disable react/no-danger */
                              dangerouslySetInnerHTML={{
                                __html: detailedRequirements,
                              }}
                              /* eslint-enable react/no-danger */
                              styleName="rawHtml"
                            />
                          )
                        }
                      </article>
                    }
                    {
                      finalSubmissionGuidelines &&
                      <article>
                        <h2 styleName="h2">Final Submission Guidelines</h2>
                        {
                          editMode ? (
                            <Editor
                              connector={toolbarConnector}
                              id="submissionGuidelines"
                              initialMode={EDITOR_MODES.WYSIWYG}
                              ref={n => n && n.setHtml(finalSubmissionGuidelines)}
                            />
                          ) : (
                            <div
                              /* eslint-disable react/no-danger */
                              dangerouslySetInnerHTML={{
                                __html: finalSubmissionGuidelines,
                              }}
                              /* eslint-enable react/no-danger */
                              styleName="rawHtml"
                            />
                          )
                        }
                      </article>
                    }
                  </div>
                ) :
                (
                  <div>
                    {
                      introduction &&
                      <article>
                        <h2 styleName="h2">Challenge Summary</h2>
                        {
                          editMode ? (
                            <Editor
                              connector={toolbarConnector}
                              id="introduction"
                              initialMode={EDITOR_MODES.WYSIWYG}
                              ref={n => n && n.setHtml(introduction)}
                            />
                          ) : (
                            <div
                              /* eslint-disable react/no-danger */
                              dangerouslySetInnerHTML={{
                                __html: introduction,
                              }}
                              /* eslint-enable react/no-danger */
                              styleName="rawHtml"
                            />
                          )
                        }
                        <p styleName="p" />
                        <p styleName="p note">
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
                        <h2 styleName="h2">Challenge Format</h2>
                        <p styleName="p">This competition will be run as a two-round challenge.</p>
                        {
                          round1Introduction &&
                          <div>
                            <h3 styleName="h3">Round 1</h3>
                            {
                              editMode ? (
                                <Editor
                                  connector={toolbarConnector}
                                  id="round1Introduction"
                                  initialMode={EDITOR_MODES.WYSIWYG}
                                  ref={n => n.setHtml(round1Introduction)}
                                />
                              ) : (
                                <div
                                  /* eslint-disable react/no-danger */
                                  dangerouslySetInnerHTML={{
                                    __html: round1Introduction,
                                  }}
                                  /* eslint-enable react/no-danger */
                                  styleName="rawHtml"
                                />
                              )
                            }
                          </div>
                        }
                        {
                          round2Introduction &&
                          <div>
                            <h3 styleName="h3">Round 2</h3>
                            {
                              editMode ? (
                                <Editor
                                  connector={toolbarConnector}
                                  id="round2Introduction"
                                  initialMode={EDITOR_MODES.WYSIWYG}
                                  ref={n => n.setHtml(round2Introduction)}
                                />
                              ) : (
                                <div
                                  /* eslint-disable react/no-danger */
                                  dangerouslySetInnerHTML={{
                                    __html: round2Introduction,
                                  }}
                                  /* eslint-enable react/no-danger */
                                  styleName="rawHtml"
                                />
                              )
                            }
                          </div>
                        }
                        <div styleName="note">
                          <p styleName="p">Regarding the Rounds:</p>
                          <ul styleName="ul">
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
                        <h2 styleName="h2">Full Description & Project Guide</h2>
                        {
                          editMode ? (
                            <Editor
                              connector={toolbarConnector}
                              id="detailedRequirements"
                              initialMode={EDITOR_MODES.WYSIWYG}
                              ref={n => n && n.setHtml(detailedRequirements)}
                            />
                          ) : (
                            <div
                              /* eslint-disable react/no-danger */
                              dangerouslySetInnerHTML={{
                                __html: detailedRequirements,
                              }}
                              /* eslint-enable react/no-danger */
                              styleName="rawHtml"
                            />
                          )
                        }
                      </article>
                    }
                    <article>
                      <h2 styleName="h2">Stock Photography</h2>
                      <p styleName="p">
                        {stockArtText}&nbsp;
                        <a href={config.URL.INFO.STOCK_ART_POLICY}>
                          See this page for more details.
                        </a>
                      </p>
                    </article>
                    <article>
                      <h2 styleName="h2">How To Submit</h2>
                      <ul styleName="ul">
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
                      <h2 styleName="h2">Winner Selection</h2>
                      <p styleName="p">
                        Submissions are viewable to the client as they are entered
                        into the challenge. Winners are selected by the client and
                        are chosen solely at the Client&apos;s discretion.
                      </p>
                    </article>
                  </div>
                )
            }
            <article>
              <h2 styleName="h2">Payments</h2>
              {
                isWipro ? (
                  <div>
                    <p styleName="p">
                      For employees of Wipro Technologies, following are the
                      payment terms. Winner/s would be awarded the prize money on
                      successful completion and acceptance of the submission by
                      the stakeholder. Accumulated prize money for the month will
                      be paid through Wipro payroll as part of subsequent month’s
                      salary (eg. Aug month challenge winners payment will be
                      credited as part Sept month salary). For payment of prize
                      money, respective country currency conversion shall be
                      considered as per Wipro standard currency conversion
                      guidelines. Please refer to policy document at
                      &zwnj;<a
                        href="https://wipro365.sharepoint.com/sites/wipro-people-policies/wipro%20policies/TopGear-RewardPoints-Policy.pdf"
                        rel="noopener noreferrer"
                        target="_blank"
                      >https://wipro365.sharepoint.com/sites/wipro-people-policies/wipro%20policies/TopGear-RewardPoints-Policy.pdf</a>&zwnj;
                      for details regarding the policy.
                    </p>
                  </div>
                ) : (
                  <p styleName="p">
                    Topcoder will compensate members in accordance with the our
                    standard payment policies, unless otherwise specified in this
                    challenge. For information on payment policies, setting up your
                    profile to receive payments, and general payment questions,
                    please refer to
                    &zwnj;<a
                      href="https://help.topcoder.com/hc/en-us/articles/217482038-Payment-Policies-and-Instructions"
                      rel="noopener noreferrer"
                      target="_blank"
                    >https://help.topcoder.com/hc/en-us/articles/217482038-Payment-Policies-and-Instructions
                    </a>.
                  </p>
                )
              }
            </article>
            <article>
              <h2 styleName="h2">Reliability Rating and Bonus</h2>
              <p styleName="p">
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
          challengesUrl={challengesUrl}
          screeningScorecardId={screeningScorecardId}
          reviewScorecardId={reviewScorecardId}
          forumLink={forumLink}
          submissionLimit={submissionLimit}
          eventDetail={_.isEmpty(mainEvent) ? null : mainEvent}
          documents={documents}
          hasRegistered={hasRegistered}
          fileTypes={fileTypes}
          isDesign={track.toLowerCase() === 'design'}
          isDevelop={track.toLowerCase() === 'develop'}
          terms={terms}
          shareable={_.isEmpty(groups)}
          environment={environment}
          codeRepo={codeRepo}
        />
      </div>
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
    reviewType: undefined,
    technologies: '',
    fileTypes: [],
    numberOfCheckpointsPrizes: 0,
    round1Introduction: '',
    round2Introduction: '',
    allowStockArt: false,
    finalSubmissionGuidelines: '',
    environment: '',
    codeRepo: '',
  },
};

ChallengeDetailsView.propTypes = {
  terms: PT.arrayOf(PT.shape()),
  hasRegistered: PT.bool.isRequired,
  challenge: PT.shape({
    introduction: PT.string,
    detailedRequirements: PT.string,
    track: PT.string.isRequired,
    groups: PT.shape().isRequired,
    screeningScorecardId: PT.number,
    reviewScorecardId: PT.number,
    forumId: PT.number.isRequired,
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
    environment: PT.string,
    codeRepo: PT.string,
    userDetails: PT.shape({
      roles: PT.arrayOf(PT.string).isRequired,
    }).isRequired,
  }),
  challengesUrl: PT.string.isRequired,
  communitiesList: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    groupIds: PT.arrayOf(PT.string).isRequired,
  })).isRequired,
  savingChallenge: PT.bool.isRequired,
  setSpecsTabState: PT.func.isRequired,
  specsTabState: PT.string.isRequired,
  updateChallenge: PT.func.isRequired,
};
