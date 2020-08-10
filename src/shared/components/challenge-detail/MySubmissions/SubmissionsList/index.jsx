/*
  Component renders my submissions list
*/

import React from 'react';
import cn from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import { services } from 'topcoder-react-lib';
import sortList from 'utils/challenge-detail/sort';

import IconComplete from '../../icons/completed.svg';
import IconQueued from '../../icons/queued.svg';
import IconFail from '../../icons/failed.svg';
import DownloadIcon from '../../../SubmissionManagement/Icons/IconSquareDownload.svg';
import ArrowDown from '../../../../../assets/images/arrow-down.svg';

import style from './styles.scss';

const { getService } = services.submissions;


class SubmissionsListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedSubmissions: [],
    };
    this.sortSubmissions = this.sortSubmissions.bind(this);
    this.getSubmissionsSortParam = this.getSubmissionsSortParam.bind(this);
    this.updateSortedSubmissions = this.updateSortedSubmissions.bind(this);
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

    const { field, sort } = this.getSubmissionsSortParam();
    const revertSort = (sort === 'desc') ? 'asc' : 'desc';

    const {
      id: challengeId,
    } = challenge;
    const {
      sortedSubmissions,
    } = this.state;
    return (
      <div styleName="wrapper">
        <article>
          <h2 styleName="h2">
            My Submissions
          </h2>
        </article>
        <div styleName="submission-table">
          <div styleName="submission-table-header submission-table-row">
            <div styleName="submission-table-column column-1">
              <span>Submission</span>
            </div>
            <div styleName="submission-table-column column-2 score-title">
              <span>Score</span>
            </div>
          </div>
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
                  ><ArrowDown />
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
                  ><ArrowDown />
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
                  }}
                >
                  <span>Final</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Final') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Final',
                      },
                    )}
                  ><ArrowDown />
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
                  }}
                >
                  <span>Provision</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Provision') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Provision',
                      },
                    )}
                  ><ArrowDown />
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
                  ><ArrowDown />
                  </div>
                </button>
              </div>
              <div styleName="submission-table-column column-2-4" />
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
                finalScore = '-';
              }
              if (_.isNumber(provisionalScore)) {
                if (provisionalScore > 0) {
                  provisionalScore = provisionalScore.toFixed(2);
                }
              } else {
                provisionalScore = '-';
              }
              return (
                <div key={mySubmission.submissionId} styleName="submission-table-row">
                  <div
                    styleName={cn(
                      'submission-table-column column-1',
                    )}
                  >
                    <button
                      onClick={() => {
                        selectSubmission(mySubmission);
                      }}
                      type="button"
                      styleName={cn(
                        'submission-table-column column-1-1',
                        {
                          'is-highlight': field === 'Submission ID',
                        },
                      )}
                    >
                      <span>{mySubmission.id}</span>
                    </button>
                    <div
                      styleName={cn(
                        'submission-table-column column-1-2',
                        {
                          'is-highlight': field === 'Status',
                        },
                      )}
                    >
                      {mySubmission.provisionalScoringIsCompleted ? (
                        <IconComplete />
                      ) : (<IconQueued />)}
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
                      {(finalScore < 0) ? (<IconFail />) : (<span>{finalScore}</span>)}
                    </div>
                    <div
                      styleName={cn(
                        'submission-table-column column-2-2',
                        {
                          'is-highlight': field === 'Provision',
                        },
                      )}
                    >
                      {(provisionalScore < 0) ? (<IconFail />) : (<span>{provisionalScore}</span>)}
                    </div>
                    <div
                      styleName={cn(
                        'submission-table-column column-2-3',
                        {
                          'is-highlight': field === 'Time',
                        },
                      )}
                    >
                      <span>{moment(mySubmission.submissionTime).format('DD MMM YYYY')} {moment(mySubmission.submissionTime).format('HH:mm:ss')}</span>
                    </div>
                    <div styleName="submission-table-column column-2-4">
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
                        <DownloadIcon styleName="icon-download" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
        <PrimaryButton
          theme={{ button: style.challengeAction }}
          disabled={!hasRegistered || unregistering || submissionEnded || isLegacyMM}
          to={`${challengesUrl}/${challengeId}/submit`}
        >
          Add Submission
        </PrimaryButton>
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
  challenge: PT.shape({
    id: PT.any,
    checkpoints: PT.arrayOf(PT.object),
    submissions: PT.arrayOf(PT.object),
    submissionViewable: PT.string,
    registrants: PT.any,
  }).isRequired,
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
