/* eslint-disable max-len */
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
    groups,
    description,
    privateDescription,
    descriptionFormat,
    legacy,
    legacyId,
    documents,
    userDetails,
    metadata,
    events,
    track,
  } = challenge;

  const roles = (userDetails || {}).roles || [];
  const {
    reviewScorecardId,
    screeningScorecardId,
    forumId,
    selfService,
  } = legacy;

  let stockArtValue = '';
  const allowStockArt = _.find(metadata, { name: 'allowStockArt' });
  if (allowStockArt) {
    stockArtValue = allowStockArt.value === 'true';
  }

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

  const discuss = _.get(challenge, 'discussions', []).filter(d => (
    d.type === 'challenge' && !_.isEmpty(d.url)
  ));

  let forumLink = '';
  if (forumId > 0) {
    forumLink = track.toLowerCase() === 'design'
      ? `/?module=ThreadList&forumID=${forumId}`
      : `/?module=Category&categoryID=${forumId}`;
  }

  let isWipro = false;
  const wiproCommunity = communitiesList.find(x => x.communityId === 'wipro');
  if (wiproCommunity && groups) {
    isWipro = wiproCommunity.groupIds.some(id => groups.includes(id));
  }

  // Determine if a challenge is for Topcrowd so we can edit the UI accordingly
  // CORE-292
  let isTopCrowdChallenge = false;
  const isTopCrowdChallengeData = _.find(metadata, { name: 'is_platform' });
  if (isTopCrowdChallengeData) {
    isTopCrowdChallenge = isTopCrowdChallengeData.value;
  }

  let accentedStyle = '';
  switch (track.toLowerCase()) {
    case 'design':
      accentedStyle = 'challenge-specs-design';
      break;

    case 'data science':
      accentedStyle = 'challenge-specs-datasci';
      break;

    default:
      accentedStyle = 'challenge-specs-develop';
      break;
  }

  const canEdit = roles.some(x => x === 'Copilot' || x === 'Manager');
  const editMode = specsTabState === SPECS_TAB_STATES.EDIT;
  const toolbarConnector = new ToolbarConnector();
  const isSaving = specsTabState === SPECS_TAB_STATES.SAVING;

  const stockArtText = stockArtValue
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
                        <h2>
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
                        {
                          privateDescription && (
                            <React.Fragment>
                              <h2>
                                Registered User Additional Information
                              </h2>
                              <SpecificationComponent
                                bodyText={privateDescription}
                                format={descriptionFormat}
                              />
                            </React.Fragment>
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
                          selfService && (
                            <p styleName="note">
                              <strong>
                                On Demand Challenges are customer-initiated single round design challenges.
                              </strong>
                              <br />
                              Please note the following important information for Topcoder competitors who participate in this challenge:
                              <ul>
                                <li>Any communication needed, should be done directly with the customer in the Challenge Forum.</li>
                                <li>In order to pass challenge screening and review, all challenge requirements and requested screens must be completed as described below.</li>
                                <li>Submission source files must be created with the application(s) listed in the requirements.</li>
                                <li>There will be no appeals or final fixes.</li>
                                <li>The challenge winner selections will be based upon completed requirements and associated Topcoder review scoring.</li>
                              </ul>
                              <br />
                              <strong>
                                REQUEST MARVEL PROTOTYPES HERE:
                              </strong>
                              <br />
                              <a href="https://discussions.topcoder.com/discussion/15528/request-marvel-access-for-on-demand-challenges">
                                Request Marvel for On Demand Challenges
                              </a>
                              <br />
                              <strong>
                                DO NOT request Marvel access in the challenge forum with the customer.
                              </strong>
                              <br />
                              Figma or XD Prototypes are acceptable for submissions created with those applications.
                            </p>
                          )
                        }
                        <h2>
                          Challenge Summary
                        </h2>
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
                        {
                          privateDescription && (
                            <React.Fragment>
                              <h2>
                                Registered User Additional Information
                              </h2>
                              <SpecificationComponent
                                bodyText={privateDescription}
                                format={descriptionFormat}
                              />
                            </React.Fragment>
                          )
                        }
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
                      )
                    }
                    <article>
                      <h2>
                        Stock Photography
                      </h2>
                      <p>
                        {stockArtText}
&nbsp;
                        <a href={config.URL.INFO.STOCK_ART_POLICY}>
                          See this page for more details.
                        </a>
                      </p>
                    </article>
                    <article>
                      <h2>
                        How To Submit
                      </h2>
                      <ul>
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
                      <h2>
                        Winner Selection
                      </h2>
                      <p>
                        Submissions are viewable to the client as they are entered
                        into the challenge. Winners are selected by the client and
                        are chosen solely at the client&apos;s discretion.
                      </p>
                    </article>
                  </div>
                )
            }
            {isWipro && (
              <article>
                <h2>
                  Payments
                </h2>
                <div>
                  <p>
                    For employees of Wipro Technologies, following are the
                    payment terms. Winner/s would be awarded the prize money on
                    successful completion and acceptance of the submission by
                    the stakeholder. Accumulated prize money for the month will
                    be paid through Wipro payroll as part of subsequent month’s
                    salary (eg. Aug month challenge winners payment will be
                    credited as part Sept month salary). For payment of prize
                    money, respective country currency conversion shall be
                    considered as per Wipro standard currency conversion
                    guidelines.
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
        { !isTopCrowdChallenge ? (
          <SideBar
            challengesUrl={challengesUrl}
            legacyId={legacyId}
            forumLink={forumLink}
            discuss={discuss}
            documents={documents}
            hasRegistered={hasRegistered}
            isDesign={track.toLowerCase() === 'design'}
            isDevelop={track.toLowerCase() === 'development'}
            eventDetail={_.isEmpty(events) ? null : events[0]}
            isMM={isMM(challenge)}
            terms={terms}
            shareable={_.isEmpty(groups)}
            environment={environment}
            codeRepo={codeRepo}
            metadata={metadata}
            reviewScorecardId={reviewScorecardId}
            screeningScorecardId={screeningScorecardId}
            isWipro={isWipro}
          />
        ) : null }
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
    numberOfCheckpointsPrizes: 0,
    environment: '',
    descriptionFormat: 'HTML',
    codeRepo: '',
    metadata: [],
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
    privateDescription: PT.string,
    legacy: PT.shape({
      reviewScorecardId: PT.oneOfType([PT.string, PT.number]),
      screeningScorecardId: PT.string,
      forumId: PT.number,
      selfService: PT.bool,
    }),
    track: PT.string.isRequired,
    legacyId: PT.oneOfType([PT.string, PT.number]),
    groups: PT.any,
    reviewType: PT.string,
    numberOfCheckpointsPrizes: PT.number,
    environment: PT.string,
    codeRepo: PT.string,
    userDetails: PT.shape({
      roles: PT.arrayOf(PT.string).isRequired,
    }),
    metadata: PT.array,
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
