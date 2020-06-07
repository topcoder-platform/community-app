/*
  Component renders challenge details and specifications
*/

import _ from 'lodash';
import Editor, { MODES as EDITOR_MODES } from 'components/Editor/MultiEditor';
import EditorToolbar from 'components/Editor/Toolbar';
import Previewer from 'components/Editor/Previewer';
import ToolbarConnector from 'components/Editor/Connector';
import React from 'react';
import Sticky from 'react-stickynode';
import { config } from 'topcoder-react-utils';
import { isMM } from 'utils/challenge';

import PT from 'prop-types';
import { DangerButton } from 'topcoder-react-ui-kit';
import { SPECS_TAB_STATES } from 'actions/page/challenge-details';
import SpecificationComponent from './SpecificationComponent';
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
    description,
    privateDescription,
    descriptionFormat,
    legacy,
    documents,
    finalSubmissionGuidelines,
    userDetails,
    metadata,
    events,
  } = challenge;

  const tags = challenge.tags || [];
  const roles = (userDetails || {}).roles || [];
  const { track, reviewScorecardId, screeningScorecardId } = legacy;

  const allowStockArt = _.find(metadata, { type: 'allowStockArt' });
  let environment = '';
  const environmentData = _.find(metadata, { name: 'environment' });
  if (environmentData) {
    environment = environmentData.value;
  }

  let codeRepo = '';
  const codeRepoData = _.find(metadata, { name: 'codeRepo' });
  if (codeRepoData) {
    codeRepo = codeRepoData.value;
  }

  let forumLink = track.toLowerCase() === 'design'
    ? `/?module=ThreadList&forumID=${forumId}`
    : `/?module=Category&categoryID=${forumId}`;
  forumLink = `${config.URL.FORUMS}${forumLink}`;

  let isWipro = false;
  const wiproCommunity = communitiesList.find(x => x.communityId === 'wipro');
  if (wiproCommunity && groups) {
    isWipro = wiproCommunity.groupIds.some(id => groups[id]);
  }

  const isDataScience = tags.includes('Data Science');
  let accentedStyle = 'challenge-specs-design';
  if (track.toLowerCase() === 'develop') {
    accentedStyle = isDataScience ? 'challenge-specs-datasci' : 'challenge-specs-develop';
  }

  const canEdit = roles.some(x => x === 'Copilot' || x === 'Manager');
  const editMode = specsTabState === SPECS_TAB_STATES.EDIT;
  const toolbarConnector = new ToolbarConnector();
  const isSaving = specsTabState === SPECS_TAB_STATES.SAVING;

  const stockArtText = allowStockArt
    ? 'Stock photography is allowed in this challenge.'
    : 'Stock photography is not allowed in this challenge. All submitted elements must be designed solely by you.';

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
    <div styleName="container">
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
            >
              Don&apos;t press it!
            </DangerButton>
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
              track.toLowerCase() !== 'design'
                ? (
                  <div>
                    {
                      description
                      && (
                      <article>
                        <h2 styleName="h2">
                          Challenge Overview
                        </h2>
                        {
                          editMode ? (
                            <Editor
                              connector={toolbarConnector}
                              id="description"
                              initialMode={EDITOR_MODES.WYSIWYG}
                              ref={n => n && n.setHtml(description)}
                            />
                          ) : (
                            <SpecificationComponent
                              bodyText={description}
                              format={descriptionFormat}
                            />
                          )
                        }
                      </article>
                      )
                    }
                    {
                      finalSubmissionGuidelines
                      && (
                      <article>
                        <h2 styleName="h2">
                          Final Submission Guidelines
                        </h2>
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
                      )
                    }
                  </div>
                )
                : (
                  <div>
                    {
                      description
                      && (
                      <article>
                        {
                          editMode ? (
                            <Editor
                              connector={toolbarConnector}
                              id="privateDescription"
                              initialMode={EDITOR_MODES.WYSIWYG}
                              ref={n => n && n.setHtml(privateDescription)}
                            />
                          ) : (
                            <SpecificationComponent
                              bodyText={description}
                              format={descriptionFormat}
                            />
                          )
                        }
                      </article>
                      )
                    }
                    <article>
                      <h2 styleName="h2">
                        Stock Photography
                      </h2>
                      <p styleName="p">
                        {stockArtText}
&nbsp;
                        <a href={config.URL.INFO.STOCK_ART_POLICY}>
                          See this page for more details.
                        </a>
                      </p>
                    </article>
                    <article>
                      <h2 styleName="h2">
                        How To Submit
                      </h2>
                      <ul styleName="ul">
                        <li>
                          New to Studio?
                          &zwnj;
                          <a href={config.URL.INFO.DESIGN_CHALLENGE_TYPES}>
                            Learn how to compete here
                          </a>
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
                          </a>
                          &rdquo;
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
                      <h2 styleName="h2">
                        Winner Selection
                      </h2>
                      <p styleName="p">
                        Submissions are viewable to the client as they are entered
                        into the challenge. Winners are selected by the client and
                        are chosen solely at the client&apos;s discretion.
                      </p>
                    </article>
                  </div>
                )
            }
            <article>
              <h2 styleName="h2">
                Payments
              </h2>
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
                      &zwnj;
                      <a
                        href="https://wipro365.sharepoint.com/sites/wipro-people-policies/wipro%20policies/TopGear-RewardPoints-Policy.pdf"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://wipro365.sharepoint.com/sites/wipro-people-policies/wipro%20policies/TopGear-RewardPoints-Policy.pdf
                      </a>
                      &zwnj;
                      for details regarding the policy.
                    </p>
                  </div>
                ) : (
                  <p styleName="p">
                    Topcoder will compensate members in accordance with our
                    standard payment policies, unless otherwise specified in this
                    challenge. For information on payment policies, setting up your
                    profile to receive payments, and general payment questions,
                    please refer to
                    &zwnj;
                    <a
                      href="https://www.topcoder.com/thrive/articles/Payment%20Policies%20and%20Instructions"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      https://www.topcoder.com/thrive/articles/Payment%20Policies%20and%20Instructions
                    </a>
                  </p>
                )
              }
            </article>
            <article>
              <h2 styleName="h2">
                Reliability Rating and Bonus
              </h2>
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
          forumLink={forumLink}
          documents={documents}
          hasRegistered={hasRegistered}
          isDesign={track.toLowerCase() === 'design'}
          isDevelop={track.toLowerCase() === 'develop'}
          eventDetail={_.isEmpty(events) ? null : events[0]}
          isMM={isMM(challenge)}
          terms={terms}
          shareable={_.isEmpty(groups)}
          environment={environment}
          codeRepo={codeRepo}
          metadata={metadata}
          reviewScorecardId={reviewScorecardId}
          screeningScorecardId={screeningScorecardId}
        />
      </div>
    </div>
  );
}

ChallengeDetailsView.defaultProps = {
  terms: [],
  challenge: {
    description: undefined,
    privateDescription: undefined,
    track: 'design',
    reviewType: undefined,
    tags: [],
    numberOfCheckpointsPrizes: 0,
    finalSubmissionGuidelines: '',
    environment: '',
    descriptionFormat: 'HTML',
    codeRepo: '',
    metadata: {},
    events: [],
    reviewScorecardId: '',
    screeningScorecardId: '',
  },
};

ChallengeDetailsView.propTypes = {
  terms: PT.arrayOf(PT.shape()),
  hasRegistered: PT.bool.isRequired,
  challenge: PT.shape({
    description: PT.string,
    descriptionFormat: PT.string,
    documents: PT.any,
    id: PT.any,
    subTrack: PT.any,
    privateDescription: PT.string,
    legacy: PT.shape({
      track: PT.string.isRequired,
      reviewScorecardId: PT.string,
      screeningScorecardId: PT.string,
    }),
    groups: PT.any,
    forumId: PT.number,
    reviewType: PT.string,
    tags: PT.arrayOf(PT.string),
    numberOfCheckpointsPrizes: PT.number,
    finalSubmissionGuidelines: PT.string,
    environment: PT.string,
    codeRepo: PT.string,
    userDetails: PT.shape({
      roles: PT.arrayOf(PT.string).isRequired,
    }),
    metadata: PT.shape(),
    events: PT.arrayOf(PT.string),
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
