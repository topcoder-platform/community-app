/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Submissions tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import { submission as submissionUtils } from 'topcoder-react-lib';
import { isTokenExpired } from 'tc-accounts';
import cn from 'classnames';

import sortList from 'utils/challenge-detail/sort';
import challengeDetailsActions from 'actions/page/challenge-details';
import LoadingIndicator from 'components/LoadingIndicator';
import { goToLogin } from 'utils/tc';
import Lock from '../icons/lock.svg';
import SubmissionRow from './SubmissionRow';
import SubmissionInformationModal from './SubmissionInformationModal';
import ArrowDown from '../../../../assets/images/arrow-down.svg';
import './style.scss';

const { getProvisionalScore, getFinalScore } = submissionUtils;

class SubmissionsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInformation: false,
      memberOfModal: '',
      sortedSubmissions: [],
    };
    this.onHandleInformationPopup = this.onHandleInformationPopup.bind(this);
    this.getSubmissionsSortParam = this.getSubmissionsSortParam.bind(this);
    this.updateSortedSubmissions = this.updateSortedSubmissions.bind(this);
    this.sortSubmissions = this.sortSubmissions.bind(this);
    this.checkIsReviewPhaseComplete = this.checkIsReviewPhaseComplete.bind(this);
  }

  componentDidMount() {
    const { challenge, loadMMSubmissions, auth } = this.props;
    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;

    // Check auth token, go to login page if invalid
    if (isMM && (_.isEmpty(auth) || _.isEmpty(auth.tokenV3) || isTokenExpired(auth.tokenV3))) {
      goToLogin('community-app-main');
      return;
    }

    if (isMM) {
      loadMMSubmissions(challenge.id, challenge.registrants, auth.tokenV3);
    }
    this.updateSortedSubmissions();
  }

  componentDidUpdate(prevProps) {
    const { challenge } = this.props;
    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;

    const { submissions, mmSubmissions, submissionsSort } = this.props;
    if (
      (!isMM && !_.isEqual(prevProps.submissions, submissions))
      || (isMM && !_.isEqual(prevProps.mmSubmissions, mmSubmissions))
      || !_.isEqual(prevProps.submissionsSort, submissionsSort)
    ) {
      this.updateSortedSubmissions();
    }
  }

  onHandleInformationPopup(status, submissionId = null, member = '') {
    const { loadSubmissionInformation, auth } = this.props;
    this.setState({
      isShowInformation: status,
      memberOfModal: member,
    });

    if (status) {
      loadSubmissionInformation(submissionId, auth.tokenV3);
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
      field = 'Rating'; // default field for submission sorting
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
    const { challenge } = this.props;
    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;
    const { submissions, mmSubmissions } = this.props;
    const sortedSubmissions = _.cloneDeep(isMM ? mmSubmissions : submissions);
    this.sortSubmissions(sortedSubmissions);
    this.setState({ sortedSubmissions });
  }

  /**
   * Sort array of submission
   * @param {Array} submissions array of submission
   */
  sortSubmissions(submissions) {
    const { challenge } = this.props;
    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;
    const { field, sort } = this.getSubmissionsSortParam();
    let isHaveFinalScore = false;
    if (field === 'Initial / Final Score') {
      isHaveFinalScore = _.some(submissions, s => !_.isNil(s.submissions[0].finalScore));
    }
    return sortList(submissions, field, sort, (a, b) => {
      let valueA = 0;
      let valueB = 0;
      let valueIsString = false;
      switch (field) {
        case 'Country': {
          valueA = a.registrant ? a.registrant.countryCode : '';
          valueB = b.registrant ? b.registrant.countryCode : '';
          valueIsString = true;
          break;
        }
        case 'Rating': {
          valueA = a.registrant ? a.registrant.rating : 0;
          valueB = b.registrant ? b.registrant.rating : 0;
          break;
        }
        case 'Username': {
          if (isMM) {
            valueA = `${a.member || ''}`.toLowerCase();
            valueB = `${b.member || ''}`.toLowerCase();
          } else {
            valueA = `${a.submitter}`.toLowerCase();
            valueB = `${b.submitter}`.toLowerCase();
          }
          valueIsString = true;
          break;
        }
        case 'Time':
        case 'Submission Date': {
          valueA = new Date(a.submissions[0].submissionTime);
          valueB = new Date(b.submissions[0].submissionTime);
          break;
        }
        case 'Initial / Final Score': {
          if (isHaveFinalScore) {
            valueA = getFinalScore(a);
            valueB = getFinalScore(b);
          } else {
            valueA = a.submissions[0].initialScore;
            valueB = b.submissions[0].initialScore;
          }
          break;
        }
        case 'Final Rank': {
          if (this.checkIsReviewPhaseComplete()) {
            valueA = a.finalRank ? a.finalRank : 0;
            valueB = b.finalRank ? b.finalRank : 0;
          }
          break;
        }
        case 'Provisional Rank': {
          valueA = a.provisionalRank ? a.provisionalRank : 0;
          valueB = b.provisionalRank ? b.provisionalRank : 0;
          break;
        }
        case 'Final Score': {
          valueA = getFinalScore(a);
          valueB = getFinalScore(b);
          break;
        }
        case 'Provisional Score': {
          valueA = getProvisionalScore(a);
          valueB = getProvisionalScore(b);
          break;
        }
        default:
      }

      return {
        valueA,
        valueB,
        valueIsString,
      };
    });
  }

  /**
   * Check if review phase complete
   */
  checkIsReviewPhaseComplete() {
    const {
      challenge,
    } = this.props;

    const {
      allPhases,
    } = challenge;

    let isReviewPhaseComplete = false;
    _.forEach(allPhases, (phase) => {
      if (phase.phaseType === 'Review' && phase.phaseStatus === 'Closed') {
        isReviewPhaseComplete = true;
      }
    });
    return isReviewPhaseComplete;
  }

  render() {
    const {
      challenge, toggleSubmissionHistory,
      submissionHistoryOpen,
      mmSubmissions,
      loadingMMSubmissionsForChallengeId,
      isLoadingSubmissionInformation,
      submissionInformation,
      toggleSubmissionTestcase,
      submissionTestcaseOpen,
      clearSubmissionTestcaseOpen,
      onSortChange,
    } = this.props;
    const {
      checkpoints,
    } = challenge;
    const { field, sort } = this.getSubmissionsSortParam();
    const revertSort = (sort === 'desc') ? 'asc' : 'desc';

    const { isShowInformation, memberOfModal, sortedSubmissions } = this.state;

    const modalSubmissionBasicInfo = () => _.find(mmSubmissions,
      item => item.member === memberOfModal);

    const renderSubmission = s => (
      <div styleName="submission" key={s.submissionId}>
        <a
          href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.submissionId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt=""
            src={`${config.URL.STUDIO}/studio.jpg?module=DownloadSubmission&sbmid=${s.submissionId}&sbt=small&sfi=1`}
          />
        </a>
        <div styleName="bottom-info">
          <div styleName="links">
            <a
              href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.submissionId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`#${s.submissionId}`}
            </a>
            <a
              href={`${config.URL.BASE}/members/${s.submitter}`}
              target="_blank"
              rel="noopener noreferrer"
              style={_.get(s, 'colorStyle')}
            >
              {s.submitter}
            </a>
          </div>
          <div>
            {moment(s.submissionTime)
              .format('MMM DD,YYYY HH:mm')}
          </div>
        </div>
      </div>
    );

    const isMM = challenge.subTrack.indexOf('MARATHON_MATCH') > -1;
    const isF2F = challenge.subTrack.indexOf('FIRST_2_FINISH') > -1;
    const isReviewPhaseComplete = this.checkIsReviewPhaseComplete();

    // copy colorStyle from registrants to submissions
    _.forEach(sortedSubmissions, (s) => {
      if (s.registrant && s.registrant.colorStyle && !s.colorStyle) {
        const { colorStyle } = s.registrant;
        /* eslint-disable no-param-reassign */
        s.colorStyle = JSON.parse(colorStyle.replace(/(\w+):\s*([^;]*)/g, '{"$1": "$2"}'));
        /* eslint-enable no-param-reassign */
      }
    });

    if (challenge.track.toLowerCase() === 'design') {
      return challenge.submissionViewable === 'true' ? (
        <div styleName="container view">
          <div styleName="title">
              ROUND 2 (FINAL) SUBMISSIONS
          </div>
          <div styleName="content">
            {
              sortedSubmissions.map(renderSubmission)
            }
          </div>
          {
            checkpoints.length > 0
            && (
              <div styleName="title">
                ROUND 1 (CHECKPOINT) SUBMISSIONS
              </div>
            )
          }
          {
            checkpoints.length > 0
            && (
              <div styleName="content">
                {
                  checkpoints.map(renderSubmission)
                }
              </div>
            )
          }
        </div>
      )
        : (
          <div styleName="container no-view">
            <Lock styleName="lock" />
            <div styleName="title">
              Private Challenge
            </div>
            <div styleName="subtitle">
              Submissions are not viewable for this challenge
            </div>
            <div styleName="desc">
              There are many reason why the submissions may not be viewable, such
              as the allowance of stock art, or a client&apos;s desire to keep the work private.
            </div>
          </div>
        );
    }

    if (!_.isEmpty(loadingMMSubmissionsForChallengeId)) {
      return <LoadingIndicator />;
    }

    return (
      <div styleName={`container dev ${isMM ? '' : 'non-mm'}`}>
        {
          isMM ? (
            <div styleName="head">
              <div styleName="col-1 col">
                Rank
              </div>
              <div styleName="col-2 col">
                User
              </div>
              <div styleName="col-3 col">
                Score
              </div>
              <div styleName="col-4 col" />
            </div>
          ) : (
            <div styleName="head">
              {
                !isF2F && (
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Rating',
                        sort: (field === 'Rating') ? revertSort : 'desc',
                      });
                    }}
                    styleName="col-2 header-sort"
                  >
                    <span>Rating</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Rating') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Rating',
                        },
                      )}
                    ><ArrowDown />
                    </div>
                  </button>
                )
              }
              <button
                type="button"
                onClick={() => {
                  onSortChange({
                    field: 'Username',
                    sort: (field === 'Username') ? revertSort : 'desc',
                  });
                }}
                styleName="col-3 header-sort"
              >
                <span>Username</span>
                <div
                  styleName={cn(
                    'col-arrow',
                    {
                      'col-arrow-sort-asc': (field === 'Username') && (sort === 'asc'),
                      'col-arrow-is-sorting': field === 'Username',
                    },
                  )}
                ><ArrowDown />
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSortChange({
                    field: 'Submission Date',
                    sort: (field === 'Submission Date') ? revertSort : 'desc',
                  });
                }}
                styleName="col-4 header-sort"
              >
                <span>Submission Date</span>
                <div
                  styleName={cn(
                    'col-arrow',
                    {
                      'col-arrow-sort-asc': (field === 'Submission Date') && (sort === 'asc'),
                      'col-arrow-is-sorting': field === 'Submission Date',
                    },
                  )}
                ><ArrowDown />
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSortChange({
                    field: 'Initial / Final Score',
                    sort: (field === 'Initial / Final Score') ? revertSort : 'desc',
                  });
                }}
                styleName="col-5 header-sort"
              >
                <span>Initial / Final Score</span>
                <div
                  styleName={cn(
                    'col-arrow',
                    {
                      'col-arrow-sort-asc': (field === 'Initial / Final Score') && (sort === 'asc'),
                      'col-arrow-is-sorting': field === 'Initial / Final Score',
                    },
                  )}
                ><ArrowDown />
                </div>
              </button>
            </div>
          )
        }
        {
          isMM && (
            <div styleName="sub-head">
              <div styleName="col-1 col">
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Final Rank',
                      sort: (field === 'Final Rank') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
                >
                  <span>Final</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Final Rank') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Final Rank',
                      },
                    )}
                  ><ArrowDown />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Provisional Rank',
                      sort: (field === 'Provisional Rank') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
                >
                  <span>Provisional</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Provisional Rank') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Provisional Rank',
                      },
                    )}
                  ><ArrowDown />
                  </div>
                </button>
              </div>
              <div styleName="col-2 col">
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Rating',
                      sort: (field === 'Rating') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
                >
                  <span>Rating</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Rating') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Rating',
                      },
                    )}
                  ><ArrowDown />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Username',
                      sort: (field === 'Username') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
                >
                  <span>Username</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Username') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Username',
                      },
                    )}
                  ><ArrowDown />
                  </div>
                </button>
              </div>
              <div styleName="col-3 col">
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Final Score',
                      sort: (field === 'Final Score') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
                >
                  <span>Final</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Final Score') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Final Score',
                      },
                    )}
                  ><ArrowDown />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Provisional Score',
                      sort: (field === 'Provisional Score') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
                >
                  <span>Provisional</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Provisional Score') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Provisional Score',
                      },
                    )}
                  ><ArrowDown />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Time',
                      sort: (field === 'Time') ? revertSort : 'desc',
                    });
                  }}
                  styleName="col header-sort"
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
              <div styleName="col-4 col" />
            </div>
          )
        }
        {
          isMM && (
            sortedSubmissions.map((submission, index) => (
              <SubmissionRow
                submissions={sortedSubmissions}
                isReviewPhaseComplete={isReviewPhaseComplete}
                isMM={isMM}
                key={submission.member}
                {...submission}
                toggleHistory={() => { toggleSubmissionHistory(index); }}
                openHistory={(submissionHistoryOpen[index.toString()] || false)}
                isLoadingSubmissionInformation={isLoadingSubmissionInformation}
                submissionInformation={submissionInformation}
                onShowPopup={this.onHandleInformationPopup}
              />
            ))
          )
        }
        {
          !isMM && (
            sortedSubmissions.map(s => (
              <div key={s.submitter + s.submissions[0].submissionTime} styleName="row">
                {
                  !isF2F && (
                    <div styleName="col-2" style={s.colorStyle}>
                      { (s.registrant && !_.isNil(s.registrant.rating)) ? s.registrant.rating : '-'}
                    </div>
                  )
                }
                <div styleName="col-3">
                  <a href={`${config.URL.BASE}/member-profile/${s.submitter}/develop`} target="_blank" rel="noopener noreferrer" styleName="handle" style={s.colorStyle}>
                    {s.submitter}
                  </a>
                </div>
                <div styleName="col-4">
                  {moment(s.submissions[0].submissionTime).format('MMM DD, YYYY HH:mm')}
                </div>
                <div styleName="col-5">
                  {s.submissions[0].initialScore ? s.submissions[0].initialScore.toFixed(2) : 'N/A'}
                  &zwnj;
                  &zwnj;/
                  &zwnj;
                  {s.submissions[0].finalScore ? s.submissions[0].finalScore.toFixed(2) : 'N/A'}
                </div>
              </div>
            ))
          )
        }
        {
          isMM && isShowInformation && (
            <SubmissionInformationModal
              isLoadingSubmissionInformation={isLoadingSubmissionInformation}
              submissionInformation={submissionInformation}
              onClose={this.onHandleInformationPopup}
              toggleTestcase={toggleSubmissionTestcase}
              openTestcase={submissionTestcaseOpen}
              clearTestcaseOpen={clearSubmissionTestcaseOpen}
              submission={modalSubmissionBasicInfo()}
              isReviewPhaseComplete={isReviewPhaseComplete}
            />
          )
        }
      </div>
    );
  }
}

SubmissionsComponent.defaultProps = {
  isLoadingSubmissionInformation: false,
  submissionInformation: null,
  submissions: [],
  submissionsSort: {},
  onSortChange: () => {},
};

SubmissionsComponent.propTypes = {
  auth: PT.shape().isRequired,
  challenge: PT.shape({
    id: PT.any,
    checkpoints: PT.arrayOf(PT.object),
    submissions: PT.arrayOf(PT.object),
    submissionViewable: PT.string,
    track: PT.string.isRequired,
    registrants: PT.any,
    allPhases: PT.any,
    subTrack: PT.any,
  }).isRequired,
  toggleSubmissionHistory: PT.func.isRequired,
  submissionHistoryOpen: PT.shape({}).isRequired,
  loadMMSubmissions: PT.func.isRequired,
  mmSubmissions: PT.arrayOf(PT.shape()).isRequired,
  loadingMMSubmissionsForChallengeId: PT.string.isRequired,
  isLoadingSubmissionInformation: PT.bool,
  submissionInformation: PT.shape(),
  loadSubmissionInformation: PT.func.isRequired,
  toggleSubmissionTestcase: PT.func.isRequired,
  clearSubmissionTestcaseOpen: PT.func.isRequired,
  submissionTestcaseOpen: PT.shape({}).isRequired,
  submissions: PT.arrayOf(PT.shape()),
  submissionsSort: PT.shape({
    field: PT.string,
    sort: PT.string,
  }),
  onSortChange: PT.func,
  notFoundCountryFlagUrl: PT.objectOf(PT.bool).isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    toggleSubmissionHistory: index => dispatch(
      challengeDetailsActions.page.challengeDetails.submissions.toggleSubmissionHistory(index),
    ),
    toggleSubmissionTestcase: index => dispatch(
      challengeDetailsActions.page.challengeDetails.submissions.toggleSubmissionTestcase(index),
    ),
    clearSubmissionTestcaseOpen: () => dispatch(
      challengeDetailsActions.page.challengeDetails.submissions.clearSubmissionTestcaseOpen(),
    ),
  };
}

function mapStateToProps(state) {
  return {
    submissionHistoryOpen: state.page.challengeDetails.submissionHistoryOpen,
    submissionTestcaseOpen: state.page.challengeDetails.submissionTestcaseOpen,
    isLoadingSubmissionInformation:
      Boolean(state.challenge.loadingSubmissionInformationForSubmissionId),
    submissionInformation: state.challenge.submissionInformation,
  };
}

const Submissions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubmissionsComponent);

export default Submissions;
