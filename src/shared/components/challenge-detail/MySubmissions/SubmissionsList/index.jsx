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

import IconClose from 'assets/images/icon-close-green.svg';
import DateSortIcon from 'assets/images/icon-date-sort.svg';
import SortIcon from 'assets/images/icon-sort.svg';
import Tooltip from 'components/Tooltip';
import IconFail from '../../icons/failed.svg';
import DownloadIcon from '../../../SubmissionManagement/Icons/IconSquareDownload.svg';
import ZoomIcon from '../../../SubmissionManagement/Icons/IconZoom.svg';

// import SearchIcon from '../../../SubmissionManagement/Icons/IconSearch.svg';
import style from './styles.scss';

const { getService } = services.submissions;


class SubmissionsListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedSubmissions: [],
      submissionIdClicked: false,
      statusClicked: false,
      finalClicked: false,
      provisionClicked: false,
      timeClicked: false,
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
      field = 'Submission ID';
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
      const valueIsString = false;
      switch (field) {
        case 'Submission ID': {
          valueA = a.id;
          valueB = b.id;
          break;
        }
        case 'Status': {
          valueA = a.provisionalScoringIsCompleted;
          valueB = b.provisionalScoringIsCompleted;
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
          valueA = new Date(a.submissionTime);
          valueB = new Date(b.submissionTime);
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

  render() {
    const {
      selectSubmission,
      challengesUrl,
      challenge,
      hasRegistered,
      unregistering,
      submissionEnded,
      isLegacyMM,
      auth,
      onSortChange,
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
              return (
                <div key={mySubmission.submissionId} styleName="submission-table-row">
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
                      <span>{mySubmission.id}</span>
                    </div>
                    <div
                      styleName={cn(
                        'submission-table-column column-1-2 status-row',
                      )}
                    >
                      <div styleName="mobile-header">Status</div>
                      {mySubmission.provisionalScoringIsCompleted ? (
                        <span styleName="accepted">Accepted</span>
                      ) : <span styleName="queue">In Queue</span>}
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
                      <span>{moment(mySubmission.submissionTime).format('MMM DD, YYYY HH:mm:ss')}</span>
                    </div>
                    <div styleName="submission-table-column column-2-4">
                      { !isTopCrowdChallenge
                        ? (
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
                        )
                        : <span /> }

                      <button onClick={() => selectSubmission(mySubmission)} type="button">
                        <ZoomIcon styleName="icon-zoom" />
                      </button>

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
  selectSubmission: () => {},
  onSortChange: () => {},
};

SubmissionsListView.propTypes = {
  selectSubmission: PT.func,
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
};

export default SubmissionsListView;
