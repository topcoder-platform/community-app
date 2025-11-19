/*
  Component renders my submissions list
*/

import React from 'react';
import cn from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { PrimaryButton, Modal } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import { services } from 'topcoder-react-lib';
import sortList from 'utils/challenge-detail/sort';
import { getSubmissionStatus } from 'utils/challenge-detail/submission-status';

import IconClose from 'assets/images/icon-close-green.svg';
import DateSortIcon from 'assets/images/icon-date-sort.svg';
import SortIcon from 'assets/images/icon-sort.svg';
import Tooltip from 'components/Tooltip';
import IconFail from '../../icons/failed.svg';
import DownloadIcon from '../../../SubmissionManagement/Icons/IconSquareDownload.svg';
import ZoomIcon from '../../../SubmissionManagement/Icons/IconZoom.svg';
import ArtifactsDownloadIcon from '../../../SubmissionManagement/Icons/IconDownloadArtifacts.svg';

// import SearchIcon from '../../../SubmissionManagement/Icons/IconSearch.svg';
import style from './styles.scss';

const { getService } = services.submissions;

const collectReviewSummations = (submission) => {
  const summations = [];
  if (!submission) {
    return summations;
  }
  if (Array.isArray(submission.reviewSummations)) {
    summations.push(...submission.reviewSummations);
  }
  if (Array.isArray(submission.reviewSummation)) {
    summations.push(...submission.reviewSummation);
  }
  return summations;
};

const getReviewSummationSubmissionId = (submission) => {
  const summations = collectReviewSummations(submission);
  const match = _.find(summations, s => s && !_.isNil(s.submissionId));
  if (!match) {
    return null;
  }
  return `${match.submissionId}`;
};

const getDisplaySubmissionId = (submission) => {
  const fromSummation = getReviewSummationSubmissionId(submission);
  if (fromSummation) {
    return fromSummation;
  }
  if (submission && !_.isNil(submission.submissionId)) {
    return `${submission.submissionId}`;
  }
  if (submission && !_.isNil(submission.id)) {
    return `${submission.id}`;
  }
  return '';
};

const getSubmissionCreatedTime = (submission) => {
  if (!submission) return undefined;
  return (
    submission.created
    || submission.createdAt
    || submission.submissionTime
    || submission.updated
    || submission.updatedAt
  );
};

class SubmissionsListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedSubmissions: [],
      submissionIdClicked: false,
      statusClicked: false,
      finalClicked: false,
      provisionClicked: false,
      timeClicked: true,
      openModal: false,
      selectedSubmission: {},
    };
    this.sortSubmissions = this.sortSubmissions.bind(this);
    this.getSubmissionsSortParam = this.getSubmissionsSortParam.bind(this);
    this.updateSortedSubmissions = this.updateSortedSubmissions.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    this.updateSortedSubmissions();
  }

  componentDidUpdate(prevProps) {
    const { mySubmissions, submissionsSort } = this.props;
    if (
      !_.isEqual(prevProps.mySubmissions, mySubmissions)
      || !_.isEqual(prevProps.submissionsSort, submissionsSort)
    ) {
      this.updateSortedSubmissions();
    }
  }

  /**
   * Get submission sort parameter
   */
  getSubmissionsSortParam() {
    const {
      submissionsSort,
    } = this.props;
    let { field, sort } = submissionsSort;
    if (!field) {
      field = 'Time';
    }

    if (!sort) {
      sort = 'desc'; // default order for submission sorting
    }

    return {
      field,
      sort,
    };
  }

  /**
   * Update sorted submission array
   */
  updateSortedSubmissions() {
    const { mySubmissions } = this.props;
    const sortedSubmissions = _.cloneDeep(mySubmissions);
    this.sortSubmissions(sortedSubmissions);
    this.setState({ sortedSubmissions });
  }

  /**
   * Sort array of submission
   * @param {Array} submissions array of submission
   */
  sortSubmissions(submissions) {
    const { field, sort } = this.getSubmissionsSortParam();
    return sortList(submissions, field, sort, (a, b) => {
      let valueA = 0;
      let valueB = 0;
      let valueIsString = false;
      switch (field) {
        case 'Submission ID': {
          const idA = getDisplaySubmissionId(a);
          const idB = getDisplaySubmissionId(b);
          const numericA = Number(idA);
          const numericB = Number(idB);
          const useNumericSort = idA !== '' && idB !== '' && _.isFinite(numericA) && _.isFinite(numericB);
          if (useNumericSort) {
            valueA = numericA;
            valueB = numericB;
          } else {
            valueA = idA;
            valueB = idB;
            valueIsString = true;
          }
          break;
        }
        case 'Status': {
          valueA = getSubmissionStatus(a).isAccepted ? 1 : 0;
          valueB = getSubmissionStatus(b).isAccepted ? 1 : 0;
          break;
        }
        case 'Final': {
          valueA = a.finalScore;
          valueB = b.finalScore;
          break;
        }
        case 'Provision': {
          valueA = a.provisionalScore;
          valueB = b.provisionalScore;
          break;
        }
        case 'Time': {
          valueA = new Date(getSubmissionCreatedTime(a));
          valueB = new Date(getSubmissionCreatedTime(b));
          break;
        }
        default:
      }

      if (valueIsString === false) {
        if (valueA === '-') valueA = 0;
        if (valueB === '-') valueB = 0;
      }

      return {
        valueA,
        valueB,
        valueIsString,
      };
    });
  }

  toggleModal(selectedSubmission) {
    const { openModal } = this.state;
    this.setState({ openModal: !openModal, selectedSubmission });
  }

  showDetailsModal(submission) {
    const { onShowDetailsModal } = this.props;
    onShowDetailsModal(submission);
  }

  render() {
    const {
      challengesUrl,
      challenge,
      hasRegistered,
      unregistering,
      submissionEnded,
      isLegacyMM,
      auth,
      onSortChange,
      onShowDownloadArtifactsModal,
    } = this.props;

    const isButtonDisabled = !hasRegistered || unregistering || submissionEnded || isLegacyMM;

    const { field, sort } = this.getSubmissionsSortParam();
    const revertSort = (sort === 'desc') ? 'asc' : 'desc';

    const {
      id: challengeId,
    } = challenge;
    const {
      sortedSubmissions,
      submissionIdClicked,
      statusClicked,
      finalClicked,
      provisionClicked,
      timeClicked,
      selectedSubmission,
      openModal,
    } = this.state;

    const sortOptionClicked = {
      submissionIdClicked: false,
      statusClicked: false,
      finalClicked: false,
      provisionClicked: false,
      timeClicked: false,
    };

    // Determine if a challenge is for Topcrowd so we can edit the UI accordingly
    let isTopCrowdChallenge = false;
    const isTopCrowdChallengeData = _.find(challenge.metadata, { name: 'is_platform' });
    if (isTopCrowdChallengeData) {
      isTopCrowdChallenge = isTopCrowdChallengeData.value;
    } else {
      isTopCrowdChallenge = false;
    }

    return (
      <div styleName="wrapper">
        <div styleName="submission-table">
          <div styleName="submission-table-header submission-table-row">
            <div styleName="submission-table-column column-1">
              <div
                styleName={cn(
                  'submission-table-column column-1-1',
                  {
                    'is-highlight': field === 'Submission ID',
                  },
                )}
              >
                <button
                  type="button"
                  styleName="header-sort"
                  onClick={() => {
                    onSortChange({
                      field: 'Submission ID',
                      sort: (field === 'Submission ID') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, submissionIdClicked: true });
                  }}
                >
                  <span>Submission ID</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Submission ID') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Submission ID',
                      },
                    )}
                  >{ submissionIdClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
              </div>
              <div
                styleName={cn(
                  'submission-table-column column-1-2',
                  {
                    'is-highlight': field === 'Status',
                  },
                )}
              >
                <button
                  type="button"
                  styleName="header-sort"
                  onClick={() => {
                    onSortChange({
                      field: 'Status',
                      sort: (field === 'Status') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, statusClicked: true });
                  }}
                >
                  <span>Status</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Status') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Status',
                      },
                    )}
                  >{ statusClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
              </div>
            </div>
            <div styleName="submission-table-column column-2">
              <div
                styleName={cn(
                  'submission-table-column column-2-1',
                  {
                    'is-highlight': field === 'Final',
                  },
                )}
              >
                <button
                  type="button"
                  styleName="header-sort"
                  onClick={() => {
                    onSortChange({
                      field: 'Final',
                      sort: (field === 'Final') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, finalClicked: true });
                  }}
                >
                  <span>Final Score</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Final') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Final',
                      },
                    )}
                  >{ finalClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
              </div>
              <div
                styleName={cn(
                  'submission-table-column column-2-2',
                  {
                    'is-highlight': field === 'Provision',
                  },
                )}
              >
                <button
                  type="button"
                  styleName="header-sort"
                  onClick={() => {
                    onSortChange({
                      field: 'Provision',
                      sort: (field === 'Provision') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, provisionClicked: true });
                  }}
                >
                  <span>Provision Score</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Provision') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Provision',
                      },
                    )}
                  >{ provisionClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
              </div>
              <div
                styleName={cn(
                  'submission-table-column column-2-3',
                  {
                    'is-highlight': field === 'Time',
                  },
                )}
              >
                <button
                  type="button"
                  styleName="header-sort"
                  onClick={() => {
                    onSortChange({
                      field: 'Time',
                      sort: (field === 'Time') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, timeClicked: true });
                  }}
                >
                  <span>Time</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Time') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Time',
                      },
                    )}
                  >{ timeClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
              </div>
              <div styleName="submission-table-column column-2-4">
                <span styleName="actions-col">ACTIONS</span>
              </div>
            </div>
          </div>
          {
            sortedSubmissions.map((mySubmission) => {
              let { finalScore, provisionalScore } = mySubmission;
              if (_.isNumber(finalScore)) {
                if (finalScore > 0) {
                  finalScore = finalScore.toFixed(2);
                }
              } else {
                finalScore = 'N/A';
              }
              if (_.isNumber(provisionalScore)) {
                if (provisionalScore > 0) {
                  provisionalScore = provisionalScore.toFixed(2);
                }
              } else {
                provisionalScore = 'N/A';
              }
              const { isAccepted } = getSubmissionStatus(mySubmission);
              const statusStyleName = isAccepted ? 'accepted' : 'queue';
              const statusLabel = isAccepted ? 'Accepted' : 'In Queue';
              const displaySubmissionId = getDisplaySubmissionId(mySubmission);
              const submissionCreatedTime = getSubmissionCreatedTime(mySubmission);
              const submissionTimeDisplay = submissionCreatedTime
                ? moment(submissionCreatedTime).format('MMM DD, YYYY HH:mm:ss')
                : 'N/A';
              return (
                <div
                  key={displaySubmissionId || mySubmission.submissionId || mySubmission.id}
                  styleName="submission-table-row"
                >
                  <div
                    styleName={cn(
                      'submission-table-column column-1',
                    )}
                  >
                    <div
                      styleName={cn(
                        'submission-table-column column-1-1',
                      )}
                    >
                      <div styleName="mobile-header">Submission Id</div>
                      <span>{displaySubmissionId}</span>
                    </div>
                    <div
                      styleName={cn(
                        'submission-table-column column-1-2 status-row',
                      )}
                    >
                      <div styleName="mobile-header">Status</div>
                      <span styleName={statusStyleName}>{statusLabel}</span>
                    </div>
                  </div>
                  <div styleName="submission-table-column column-2">
                    <div
                      styleName={cn(
                        'submission-table-column column-2-1 final-score-row',
                      )}
                    >
                      <div styleName="mobile-header">Final Score</div>
                      {(finalScore < 0) ? (<IconFail />) : (<span>{finalScore}</span>)}
                    </div>
                    <div
                      styleName={cn(
                        'submission-table-column column-2-2 provisional-score-row',
                      )}
                    >
                      <div styleName="mobile-header">Provisional Score</div>
                      {(provisionalScore < 0) ? (
                        <Tooltip content="Failed Submission" className="toolTipPadding">
                          <IconFail />
                        </Tooltip>
                      ) : (<span>{provisionalScore}</span>)}
                    </div>
                    <div
                      styleName={cn(
                        'submission-table-column column-2-3 time-row',
                      )}
                    >
                      <div styleName="mobile-header">Time</div>
                      <span>{submissionTimeDisplay}</span>
                    </div>
                    <div styleName="submission-table-column column-2-4">
                      { !isTopCrowdChallenge
                        ? (
                          <Tooltip content={() => <div styleName="tooltip-content">Download Submission</div>}>
                            <button
                              onClick={() => {
                                // download submission
                                const submissionsService = getService(auth.tokenV3);
                                submissionsService.downloadSubmission(mySubmission.submissionId)
                                  .then((blob) => {
                                    const url = window.URL.createObjectURL(new Blob([blob]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', `submission-${mySubmission.submissionId}.zip`);
                                    document.body.appendChild(link);
                                    link.click();
                                    link.parentNode.removeChild(link);
                                  });
                              }}
                              type="button"
                            >
                              <DownloadIcon />
                            </button>
                          </Tooltip>
                        )
                        : <span /> }
                      { !isTopCrowdChallenge
                        ? (
                          <Tooltip content={() => <div styleName="tooltip-content">Download Submission Artifacts</div>}>
                            <button
                              onClick={() => onShowDownloadArtifactsModal(mySubmission)}
                              type="button"
                              styleName="download-artifacts-button"
                            >
                              <ArtifactsDownloadIcon />
                            </button>
                          </Tooltip>
                        )
                        : <span /> }

                      <Tooltip content={() => <div styleName="tooltip-content">Show Submission Details</div>}>
                        <button onClick={() => this.showDetailsModal(mySubmission)} type="button">
                          <ZoomIcon styleName="icon-zoom" />
                        </button>
                      </Tooltip>

                      {/* <button onClick={() => this.toggleModal(mySubmission)} type="button">
                        <SearchIcon styleName="icon-search" />
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
        <PrimaryButton
          theme={{
            button: isButtonDisabled ? style.challengeActionDisabled : style.challengeAction,
          }}
          disabled={isButtonDisabled}
          to={`${challengesUrl}/${challengeId}/submit`}
        >
          Add Submission
        </PrimaryButton>
        {
          openModal && (
            <Modal onCancel={this.toggleModal} theme={style}>
              <div styleName="mySubModal">
                <div styleName="header">
                  <h2 styleName="title">Submission Details</h2>
                  <div styleName="icon" role="presentation" onClick={() => this.toggleHistory({})}>
                    <IconClose />
                  </div>
                </div>
                <hr />
                <div styleName="submission-text">
                  Submission: <span>{selectedSubmission.submissionId}</span>
                </div>
                <div styleName="detail-row">
                  <div styleName="col-1 col">
                    Review Type
                  </div>
                  <div styleName="col-2 col">
                    Reviewer
                  </div>
                  <div styleName="col-3 col">
                    Score
                  </div>
                  <div styleName="col-4 col">
                    Status
                  </div>
                </div>
                <div styleName="close-btn" onClick={() => this.toggleHistory({})} role="presentation">
                  <span>CLOSE</span>
                </div>
              </div>
            </Modal>
          )
        }
      </div>
    );
  }
}

SubmissionsListView.defaultProps = {
  onSortChange: () => {},
  onShowDownloadArtifactsModal: () => {},
  onShowDetailsModal: () => {},
};

SubmissionsListView.propTypes = {
  challengesUrl: PT.string.isRequired,
  challenge: PT.shape().isRequired,
  hasRegistered: PT.bool.isRequired,
  unregistering: PT.bool.isRequired,
  submissionEnded: PT.bool.isRequired,
  isLegacyMM: PT.bool.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()).isRequired,
  auth: PT.shape().isRequired,
  submissionsSort: PT.shape({
    field: PT.string,
    sort: PT.string,
  }).isRequired,
  onSortChange: PT.func,
  onShowDownloadArtifactsModal: PT.func,
  onShowDetailsModal: PT.func,
};

export default SubmissionsListView;
