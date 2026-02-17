/* eslint jsx-a11y/no-static-element-interactions:0 */
/**
 * Submissions tab component.
 */

import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import {
  isMM as checkIsMM,
  isRDM as checkIsRDM,
  getTrackName,
  getTypeName,
} from 'utils/challenge';
import _ from 'lodash';
import { connect } from 'react-redux';
import { config } from 'topcoder-react-utils';
import { submission as submissionUtils, services } from 'topcoder-react-lib';
import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import cn from 'classnames';
import { Button } from 'topcoder-react-ui-kit';
import DateSortIcon from 'assets/images/icon-date-sort.svg';
import SortIcon from 'assets/images/icon-sort.svg';
import { getSubmissionId } from 'utils/submissions';
import { compressFiles } from 'utils/files';

import sortList from 'utils/challenge-detail/sort';
import challengeDetailsActions from 'actions/page/challenge-details';
import LoadingIndicator from 'components/LoadingIndicator';
import { goToLogin, getRatingLevel, CHALLENGE_STATUS } from 'utils/tc';
import Lock from '../icons/lock.svg';
import ViewAsListActive from '../icons/view-as-list-active.svg';
import ViewAsListInactive from '../icons/view-as-list-inactive.svg';
import ViewAsTableActive from '../icons/view-as-table-active.svg';
import ViewAsTableInactive from '../icons/view-as-table-inactive.svg';
import SubmissionRow from './SubmissionRow';
import SubmissionInformationModal from './SubmissionInformationModal';
import style from './style.scss';

const { getProvisionalScore, getFinalScore } = submissionUtils;

const { getService } = services.submissions;

/**
 * Groups submissions by member
 * @param {Array} submissions all submissions
 * @return {Array} grouped submissions by member
 */
function groupSubmissionsByMember(submissions) {
  if (!Array.isArray(submissions)) {
    return [];
  }

  const memberMap = new Map();

  submissions.forEach((submission) => {
    const memberHandle = _.get(submission, 'registrant.memberHandle', '');
    if (!memberHandle) {
      return;
    }

    if (!memberMap.has(memberHandle)) {
      memberMap.set(memberHandle, {
        member: memberHandle,
        registrant: submission.registrant,
        submissions: [],
        rating: submission.rating,
      });
    }

    const memberEntry = memberMap.get(memberHandle);
    memberEntry.submissions.push(submission);
    // Update rating to the latest
    if (submission.rating !== undefined) {
      memberEntry.rating = submission.rating;
    }
  });

  // Convert map to array and sort submissions within each member by date (newest first)
  return Array.from(memberMap.values()).map(memberGroup => ({
    ...memberGroup,
    submissions: memberGroup.submissions.sort((a, b) => {
      const timeA = new Date(a.created || a.createdAt).getTime();
      const timeB = new Date(b.created || b.createdAt).getTime();
      return timeB - timeA; // Newest first
    }),
  }));
}

class SubmissionsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInformation: false,
      memberOfModal: '',
      sortedSubmissions: [],
      ratingClicked: false,
      usernameClicked: false,
      dateClicked: false,
      initialScoreClicked: false,
      finalScoreClicked: false,
      finalRankClicked: false,
      provisionalRankClicked: false,
      provisionalScoreClicked: false,
      downloadingAll: false,
    };
    this.onHandleInformationPopup = this.onHandleInformationPopup.bind(this);
    this.getSubmissionsSortParam = this.getSubmissionsSortParam.bind(this);
    this.getFlagFirstTry = this.getFlagFirstTry.bind(this);
    this.updateSortedSubmissions = this.updateSortedSubmissions.bind(this);
    this.sortSubmissions = this.sortSubmissions.bind(this);
    this.checkIsReviewPhaseComplete = this.checkIsReviewPhaseComplete.bind(this);
  }

  componentDidMount() {
    const { challenge, loadMMSubmissions, auth } = this.props;
    const isMM = this.isMM();

    // Check auth token, go to login page if invalid
    if (isMM && (_.isEmpty(auth) || _.isEmpty(auth.tokenV3) || isTokenExpired(auth.tokenV3))) {
      goToLogin('community-app-main');
      return;
    }

    if (isMM) {
      loadMMSubmissions(challenge.id, auth.tokenV3);
    }
    this.updateSortedSubmissions();
  }

  componentDidUpdate(prevProps) {
    const isMM = this.isMM();

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
    const { loadSubmissionInformation, auth, challenge } = this.props;
    this.setState({
      isShowInformation: status,
      memberOfModal: member,
    });

    if (status) {
      loadSubmissionInformation(challenge.id, submissionId, auth.tokenV3);
    }
  }

  /**
   * Returns the value of the "Initial Score" shown on the submissions tab
   * We have to check a couple things because sometimes we're running code challenges that
   * likely should be marathon matches (PS-295), so the logic is a bit more complex.
   *
   * We want to show provisional scores _during_ Innovation Challenges, even if run
   * as a code challenge, with MM scoring, but for a normal code challenge we don't
   * want to show provisional review scores until the challenge completes, so that
   * competitors don't have access to scores during appeals.
   *
   * @param {Object} submission The submission to return the score for
   */
  getInitialScore(submission) {
    let score = 'N/A';
    const { challenge } = this.props;
    const parsedScore = Number(_.get(submission, 'initialScore'));
    const hasScore = Number.isFinite(parsedScore);
    if (hasScore
          && (challenge.status === 'COMPLETED'
          || (_.includes(challenge.tags, 'Innovation Challenge') && _.find(challenge.metadata, { name: 'show_data_dashboard' })))) {
      score = parsedScore.toFixed(2);
    }
    return score;
  }

  getFinalScoreDisplay(submission) {
    const { challenge } = this.props;
    if (challenge.status !== CHALLENGE_STATUS.COMPLETED) {
      return 'N/A';
    }

    const parsedScore = Number(_.get(submission, 'finalScore'));
    if (!Number.isFinite(parsedScore)) {
      return 'N/A';
    }

    return parsedScore.toFixed(2);
  }

  /**
     * Check if it have flag for first try
     * @param {Object} registrant registrant info
     */
  getFlagFirstTry(registrant) {
    const { notFoundCountryFlagUrl } = this.props;
    if (!registrant.countryInfo || notFoundCountryFlagUrl[registrant.countryInfo.countryCode]) {
      return null;
    }

    return registrant.countryInfo.countryFlag;
  }

  /**
     * Get submission sort parameter
     */
  getSubmissionsSortParam(isMM, isReviewPhaseComplete) {
    const {
      submissionsSort,
    } = this.props;
    let { field, sort } = submissionsSort;
    if (!field) {
      field = 'Submission Date'; // default field for submission sorting
      if (isMM) {
        if (isReviewPhaseComplete) {
          field = 'Final Rank';
        } else {
          field = 'Provisional Rank';
        }
      }
    }

    if (!sort) {
      sort = 'asc'; // default order for submission sorting
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
    const isMM = this.isMM();
    const { submissions, mmSubmissions } = this.props;
    const source = isMM ? mmSubmissions : submissions;
    const sourceList = Array.isArray(source) ? source : [];

    let sortedSubmissions = _.cloneDeep(sourceList);

    // Group submissions by member for non-MM challenges
    if (!isMM) {
      sortedSubmissions = groupSubmissionsByMember(sortedSubmissions);
    }

    this.sortSubmissions(sortedSubmissions);
    this.setState({ sortedSubmissions });
  }

  /**
     * Sort array of submission
     * @param {Array} submissions array of submission
     */
  sortSubmissions(submissions) {
    if (!Array.isArray(submissions) || !submissions.length) {
      return;
    }
    const isMM = this.isMM();
    const isReviewPhaseComplete = this.checkIsReviewPhaseComplete();
    const { field, sort } = this.getSubmissionsSortParam(isMM, isReviewPhaseComplete);

    // For non-MM submissions that are grouped by member, we need to adjust the sorting logic
    const isGrouped = !isMM && submissions.length > 0 && submissions[0].submissions;

    let hasFinalScore = false;
    if (!isGrouped && (field === 'Initial Score' || field === 'Final Score')) {
      hasFinalScore = _.some(
        submissions,
        s => Number.isFinite(Number(_.get(s, 'finalScore'))),
      );
    } else if (isGrouped && (field === 'Initial Score' || field === 'Final Score')) {
      // For grouped submissions, check in the submissions array
      hasFinalScore = _.some(
        submissions,
        group => _.some(
          group.submissions,
          s => Number.isFinite(Number(_.get(s, 'finalScore'))),
        ),
      );
    }

    const toSubmissionTime = (entry) => {
      const entrySubmissions = entry.submissions || [entry];
      const latest = _.get(entrySubmissions, [0]);
      if (!latest) {
        return null;
      }
      const { submissionTime } = latest;
      if (!submissionTime) {
        return null;
      }
      const timestamp = new Date(submissionTime).getTime();
      return Number.isFinite(timestamp) ? timestamp : null;
    };

    const toRankValue = rank => (_.isFinite(rank) ? rank : Number.MAX_SAFE_INTEGER);
    const toScoreValue = (score) => {
      const numeric = Number(score);
      return Number.isFinite(numeric) ? numeric : null;
    };

    sortList(submissions, field, sort, (a, b) => {
      let valueA = 0;
      let valueB = 0;
      let valueIsString = false;

      const getPrimarySubmission = (entry) => {
        if (isGrouped) {
          return _.get(entry, ['submissions', 0]);
        }
        return entry;
      };

      const primaryA = getPrimarySubmission(a);
      const primaryB = getPrimarySubmission(b);

      switch (field) {
        case 'Country': {
          valueA = a.registrant ? a.registrant.countryCode : '';
          valueB = b.registrant ? b.registrant.countryCode : '';
          valueIsString = true;
          break;
        }
        case 'Rating': {
          valueA = a.rating || (a.registrant ? a.registrant.rating : 0);
          valueB = b.rating || (b.registrant ? b.registrant.rating : 0);
          break;
        }
        case 'Username': {
          if (isMM || isGrouped) {
            valueA = `${a.member || ''}`.toLowerCase();
            valueB = `${b.member || ''}`.toLowerCase();
          } else {
            valueA = _.get(a.registrant, 'memberHandle', '').toLowerCase();
            valueB = _.get(b.registrant, 'memberHandle', '').toLowerCase();
          }
          valueIsString = true;
          break;
        }
        case 'Time':
          valueA = toSubmissionTime(a);
          valueB = toSubmissionTime(b);
          break;
        case 'Submission Date': {
          const createdA = primaryA ? (primaryA.created || primaryA.createdAt) : null;
          const createdB = primaryB ? (primaryB.created || primaryB.createdAt) : null;
          valueA = createdA ? new Date(createdA).getTime() : null;
          valueB = createdB ? new Date(createdB).getTime() : null;
          break;
        }
        case 'Initial Score': {
          if (hasFinalScore) {
            valueA = toScoreValue(_.get(primaryA, 'finalScore'));
            valueB = toScoreValue(_.get(primaryB, 'finalScore'));
          } else {
            valueA = toScoreValue(_.get(primaryA, 'initialScore'));
            valueB = toScoreValue(_.get(primaryB, 'initialScore'));
          }
          break;
        }
        case 'Final Rank': {
          if (isReviewPhaseComplete) {
            valueA = toRankValue(_.get(a, 'finalRank'));
            valueB = toRankValue(_.get(b, 'finalRank'));
          }
          break;
        }
        case 'Provisional Rank': {
          valueA = toRankValue(_.get(a, 'provisionalRank'));
          valueB = toRankValue(_.get(b, 'provisionalRank'));
          break;
        }
        case 'Final Score': {
          valueA = toScoreValue(getFinalScore(primaryA));
          valueB = toScoreValue(getFinalScore(primaryB));
          break;
        }
        case 'Provisional Score': {
          valueA = toScoreValue(getProvisionalScore(primaryA));
          valueB = toScoreValue(getProvisionalScore(primaryB));
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

  isMM() {
    const { challenge } = this.props;
    return checkIsMM(challenge);
  }

  /**
     * Check if review phase complete
     */
  checkIsReviewPhaseComplete() {
    const {
      challenge,
    } = this.props;

    const allPhases = challenge.phases || [];

    let isReviewPhaseComplete = false;
    _.forEach(allPhases, (phase) => {
      if (phase.name === 'Review' && !phase.isOpen && moment(phase.scheduledStartDate).isBefore()) {
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
      onGetFlagImageFail,
      onSortChange,
      hasRegistered,
      submissionEnded,
      unregistering,
      isLegacyMM,
      challengesUrl,
      viewAsTable,
      setViewAsTable,
      numWinners,
      auth,
    } = this.props;
    const {
      checkpoints,
      id: challengeId,
      track,
      type,
      tags,
    } = challenge;
    const trackName = getTrackName(track);
    const typeName = getTypeName(type);
    // todo: hide download button until update submissions API
    const hideDownloadForMMRDM = true;

    const isMM = this.isMM();
    const isRDM = checkIsRDM(challenge);
    const isLoggedIn = !_.isEmpty(auth.tokenV3);
    const isReviewPhaseComplete = this.checkIsReviewPhaseComplete();

    const { field, sort } = this.getSubmissionsSortParam(isMM, isReviewPhaseComplete);
    const revertSort = (sort === 'desc') ? 'asc' : 'desc';

    const {
      isShowInformation,
      memberOfModal,
      sortedSubmissions,
      ratingClicked,
      usernameClicked,
      dateClicked,
      initialScoreClicked,
      finalScoreClicked,
      finalRankClicked,
      provisionalRankClicked,
      provisionalScoreClicked,
      downloadingAll,
    } = this.state;

    const sortOptionClicked = {
      ratingClicked: false,
      usernameClicked: false,
      dateClicked: false,
      initialScoreClicked: false,
      finalScoreClicked: false,
      finalRankClicked: false,
      provisionalRankClicked: false,
      provisionalScoreClicked: false,
    };

    const modalSubmissionBasicInfo = () => _.find(mmSubmissions,
      item => item.member === memberOfModal);

    const renderSubmission = s => (
      <div styleName="submission" key={s.id}>
        <a
          href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt=""
            src={`${config.URL.STUDIO}/studio.jpg?module=DownloadSubmission&sbmid=${s.id}&sbt=small&sfi=1`}
          />
        </a>
        <div styleName="bottom-info">
          <div styleName="links">
            <a
              href={`${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${s.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`#${s.id}`}
            </a>
            <a
              href={`${window.origin}/members/${_.get(s.registrant, 'memberHandle', '')}`}
              target={`${_.includes(window.origin, 'www') ? '_self' : '_blank'}`}
              rel="noopener noreferrer"
              styleName={`level-${getRatingLevel(_.get(s.registrant, 'rating', 0))}`}
            >
              {_.get(s.registrant, 'memberHandle', '')}
            </a>
          </div>
          <div>
            {moment(s.submissionTime)
              .format('MMM DD,YYYY HH:mm')}
          </div>
        </div>
      </div>
    );

    const isF2F = typeName === 'First2Finish';
    const isBugHunt = _.includes(tags, 'Bug Hunt');

    // copy colorStyle from registrants to submissions
    _.forEach(sortedSubmissions, (s) => {
      if (s.registrant && s.registrant.colorStyle && !s.colorStyle) {
        const { colorStyle } = s.registrant;
        /* eslint-disable no-param-reassign */
        s.colorStyle = JSON.parse(colorStyle.replace(/(\w+):\s*([^;]*)/g, '{"$1": "$2"}'));
        /* eslint-enable no-param-reassign */
      }

      if (s.registrant && s.registrant.rating && !s.rating) {
        const { rating } = s.registrant;
        /* eslint-disable no-param-reassign */
        s.rating = rating;
        /* eslint-enable no-param-reassign */
      }
    });

    if ((trackName || '').toLowerCase() === 'design') {
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
            <div styleName="lock-title">
              Private Challenge
            </div>
            <div styleName="lock-subtitle">
              Submissions are not viewable for this challenge
            </div>
            <span styleName="lock-desc">
              There are many reason why the submissions may not be viewable, such
              as the allowance of stock art, or a client&apos;s desire to keep the work private.
            </span>
          </div>
        );
    }

    if (!_.isEmpty(loadingMMSubmissionsForChallengeId)) {
      return <div styleName="loading"><LoadingIndicator /></div>;
    }

    return (
      <div styleName={`container dev ${isMM ? 'mm' : 'non-mm'}`}>
        {
          isMM ? (
            <div styleName="view-as">
              <span styleName="title">View as</span>
              {
                viewAsTable ? (
                  <React.Fragment>
                    <ViewAsListInactive styleName="list-icon" onClick={() => setViewAsTable(false)} />
                    <ViewAsTableActive styleName="table-icon" onClick={() => setViewAsTable(true)} />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <ViewAsListActive styleName="list-icon" onClick={() => setViewAsTable(false)} />
                    <ViewAsTableInactive styleName="table-icon" onClick={() => setViewAsTable(true)} />
                  </React.Fragment>
                )
              }
            </div>
          ) : null
        }
        <div styleName={`${viewAsTable ? 'view-as-table' : ''}`}>
          {
            (!hideDownloadForMMRDM
            && (numWinners > 0 || challenge.status === CHALLENGE_STATUS.COMPLETED)
            && (isMM || isRDM) && isLoggedIn) && (
              <div styleName="block-download-all">
                <button
                  disabled={downloadingAll}
                  styleName="download MM"
                  onClick={() => {
                    // download submission
                    this.setState({
                      downloadingAll: true,
                    });
                    const submissionsService = getService(auth.m2mToken);
                    const allFiles = [];
                    let downloadedFile = 0;
                    const checkToCompressFiles = () => {
                      if (downloadedFile === sortedSubmissions.length) {
                        if (downloadedFile > 0) {
                          compressFiles(allFiles, 'all-submissions.zip', () => {
                            this.setState({
                              downloadingAll: false,
                            });
                          });
                        } else {
                          this.setState({
                            downloadingAll: false,
                          });
                        }
                      }
                    };
                    checkToCompressFiles();
                    _.forEach(sortedSubmissions, (submission) => {
                      const mmSubmissionId = submission.submissions
                        ? getSubmissionId(submission.submissions) : submission.id;
                      submissionsService.downloadSubmission(mmSubmissionId)
                        .then((blob) => {
                          const file = new File([blob], `submission-${mmSubmissionId}.zip`);
                          allFiles.push(file);
                          downloadedFile += 1;
                          checkToCompressFiles();
                        }).catch(() => {
                          downloadedFile += 1;
                          checkToCompressFiles();
                        });
                    });
                  }}
                  type="button"
                >
                  Download All
                </button>
              </div>
            )
          }
          {
            !isMM && (
              <div styleName="head">
                {
                  !isF2F && !isBugHunt && (
                    <button
                      type="button"
                      onClick={() => {
                        onSortChange({
                          field: 'Rating',
                          sort: (field === 'Rating') ? revertSort : 'desc',
                        });
                        this.setState({ ...sortOptionClicked, ratingClicked: true });
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
                      >{ ratingClicked ? <DateSortIcon /> : <SortIcon /> }
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
                    this.setState({ ...sortOptionClicked, usernameClicked: true });
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
                  >{ usernameClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Submission Date',
                      sort: (field === 'Submission Date') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, dateClicked: true });
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
                  >{ dateClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Initial Score',
                      sort: (field === 'Initial Score') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, initialScoreClicked: true });
                  }}
                  styleName="col-5 header-sort"
                >
                  <span>Initial Score</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Initial Score') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Initial Score',
                      },
                    )}
                  >{ initialScoreClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange({
                      field: 'Final Score',
                      sort: (field === 'Final Score') ? revertSort : 'desc',
                    });
                    this.setState({ ...sortOptionClicked, finalScoreClicked: true });
                  }}
                  styleName="col-6 header-sort"
                >
                  <span>Final Score</span>
                  <div
                    styleName={cn(
                      'col-arrow',
                      {
                        'col-arrow-sort-asc': (field === 'Final Score') && (sort === 'asc'),
                        'col-arrow-is-sorting': field === 'Final Score',
                      },
                    )}
                  >{ finalScoreClicked ? <DateSortIcon /> : <SortIcon /> }
                  </div>
                </button>
                <div styleName="col-8">
                  <span>Actions</span>
                </div>
              </div>
            )
          }
          {
            isMM && (
              <div styleName={`sub-head ${viewAsTable ? 'sub-head-table' : ''}`}>
                <div styleName="col-1 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Final Rank',
                        sort: (field === 'Final Rank') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, finalRankClicked: true });
                    }}
                    styleName="col header-sort"
                  >
                    <span>FINAL RANK</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Final Rank') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Final Rank',
                        },
                      )}
                    >{finalRankClicked ? <DateSortIcon /> : <SortIcon />}
                    </div>
                  </button>
                </div>
                <div styleName="col-2 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Provisional Rank',
                        sort: (field === 'Provisional Rank') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, provisionalRankClicked: true });
                    }}
                    styleName="col header-sort"
                  >
                    <span>PROVISIONAL RANK</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Provisional Rank') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Provisional Rank',
                        },
                      )}
                    >{provisionalRankClicked ? <DateSortIcon /> : <SortIcon /> }
                    </div>
                  </button>
                </div>
                <div styleName="col-3 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Rating',
                        sort: (field === 'Rating') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, ratingClicked: true });
                    }}
                    styleName="header-sort"
                  >
                    <span>RATING</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Rating') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Rating',
                        },
                      )}
                    >{ ratingClicked ? <DateSortIcon /> : <SortIcon /> }
                    </div>
                  </button>
                </div>
                <div styleName="col-4 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Username',
                        sort: (field === 'Username') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, usernameClicked: true });
                    }}
                    styleName="col header-sort"
                  >
                    <span>USERNAME</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Username') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Username',
                        },
                      )}
                    >{ usernameClicked ? <DateSortIcon /> : <SortIcon /> }
                    </div>
                  </button>
                </div>
                <div styleName="col-5 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Final Score',
                        sort: (field === 'Final Score') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, finalScoreClicked: true });
                    }}
                    styleName="col header-sort"
                  >
                    <span>FINAL SCORE</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Final Score') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Final Score',
                        },
                      )}
                    >{ finalScoreClicked ? <DateSortIcon /> : <SortIcon /> }
                    </div>
                  </button>
                </div>
                <div styleName="col-6 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Provisional Score',
                        sort: (field === 'Provisional Score') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, provisionalScoreClicked: true });
                    }}
                    styleName="col header-sort"
                  >
                    <span>PROVISIONAL SCORE</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Provisional Score') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Provisional Score',
                        },
                      )}
                    >{ provisionalScoreClicked ? <DateSortIcon /> : <SortIcon /> }
                    </div>
                  </button>
                </div>
                <div styleName="col-7 col">
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange({
                        field: 'Time',
                        sort: (field === 'Time') ? revertSort : 'desc',
                      });
                      this.setState({ ...sortOptionClicked, dateClicked: true });
                    }}
                    styleName="col header-sort"
                  >
                    <span>TIME</span>
                    <div
                      styleName={cn(
                        'col-arrow',
                        {
                          'col-arrow-sort-asc': (field === 'Time') && (sort === 'asc'),
                          'col-arrow-is-sorting': field === 'Time',
                        },
                      )}
                    >{ dateClicked ? <DateSortIcon /> : <SortIcon /> }
                    </div>
                  </button>
                </div>
                <div styleName="col-8 col">
                  <span>ACTIONS</span>
                </div>
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
                  isRDM={isRDM}
                  key={submission.member}
                  {...submission}
                  challengeStatus={challenge.status}
                  toggleHistory={() => { toggleSubmissionHistory(index); }}
                  openHistory={(submissionHistoryOpen[index.toString()] || false)}
                  isLoadingSubmissionInformation={isLoadingSubmissionInformation}
                  submissionInformation={submissionInformation}
                  onShowPopup={this.onHandleInformationPopup}
                  getFlagFirstTry={this.getFlagFirstTry}
                  onGetFlagImageFail={onGetFlagImageFail}
                  submissionDetail={submission}
                  viewAsTable={viewAsTable}
                  numWinners={numWinners}
                  auth={auth}
                  isLoggedIn={isLoggedIn}
                />
              ))
            )
          }
          {
            !isMM && (
              sortedSubmissions.map((memberGroup, index) => (
                <SubmissionRow
                  submissions={memberGroup.submissions}
                  isReviewPhaseComplete={isReviewPhaseComplete}
                  isMM={isMM}
                  isRDM={isRDM}
                  key={memberGroup.member}
                  member={memberGroup.member}
                  rating={memberGroup.rating}
                  challengeStatus={challenge.status}
                  toggleHistory={() => { toggleSubmissionHistory(index); }}
                  openHistory={(submissionHistoryOpen[index.toString()] || false)}
                  isLoadingSubmissionInformation={isLoadingSubmissionInformation}
                  submissionInformation={submissionInformation}
                  onShowPopup={this.onHandleInformationPopup}
                  getFlagFirstTry={this.getFlagFirstTry}
                  onGetFlagImageFail={onGetFlagImageFail}
                  submissionDetail={memberGroup}
                  viewAsTable={viewAsTable}
                  numWinners={numWinners}
                  auth={auth}
                  isLoggedIn={isLoggedIn}
                />
              ))
            )
          }
          {
          isMM && <div styleName="bottom-line" />
        }
        </div>
        {isMM && (
          <div styleName="btn-add-submission">
            <Button
              disabled={!hasRegistered || unregistering || submissionEnded || isLegacyMM}
              theme={{ button: style.challengeAction }}
              to={`${challengesUrl}/${challengeId}/submit`}
            >
              Add Submission
            </Button>
          </div>
        )}
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
  onGetFlagImageFail: () => {},
};

SubmissionsComponent.propTypes = {
  auth: PT.shape().isRequired,
  challenge: PT.shape({
    id: PT.any,
    checkpoints: PT.arrayOf(PT.object),
    submissions: PT.arrayOf(PT.object),
    submissionViewable: PT.string,
    track: PT.string.isRequired,
    type: PT.string.isRequired,
    tags: PT.arrayOf(PT.string),
    registrants: PT.any,
    status: PT.string.isRequired,
    phases: PT.any,
    metadata: PT.arrayOf(PT.object),
  }).isRequired,
  toggleSubmissionHistory: PT.func.isRequired,
  submissionHistoryOpen: PT.shape({}).isRequired,
  loadMMSubmissions: PT.func.isRequired,
  mmSubmissions: PT.arrayOf(PT.shape()).isRequired,
  loadingMMSubmissionsForChallengeId: PT.oneOfType([
    PT.string,
    PT.oneOf([null]),
  ]).isRequired,
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
  onGetFlagImageFail: PT.func,
  hasRegistered: PT.bool.isRequired,
  unregistering: PT.bool.isRequired,
  submissionEnded: PT.bool.isRequired,
  isLegacyMM: PT.bool.isRequired,
  challengesUrl: PT.string.isRequired,
  viewAsTable: PT.bool.isRequired,
  setViewAsTable: PT.func.isRequired,
  numWinners: PT.number.isRequired,
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
