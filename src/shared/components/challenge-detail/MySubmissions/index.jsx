import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import moment from 'moment';
import cn from 'classnames';
import { submission as submissionUtils } from 'topcoder-react-lib';
import style from './style.scss';
import ArrowDown from '../../../../assets/images/arrow-down.svg';

const { getProvisionalScore } = submissionUtils;

function renderEmptyTable() {
  return (
    <div styleName="empty">
      No submission uploaded so far.
    </div>
  );
}

export class MySubmissionsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      field: 'submissionId',
      asc: true,
    };
  }

  renderTableRow = (submission, challengeId) => {
    const {
      submissionId,
      submissionTime,
      submissionStatus,
    } = submission;
    return (
      <div styleName="row">
        <div styleName="col">
          <a href={`/challenges/${challengeId}/submissions/${submissionId}`}>{submissionId}</a>
        </div>
        <div styleName="col">
          C++
        </div>
        <div styleName="col">
          {submissionStatus}
        </div>
        <div styleName="col">
          {this.getFinalScore(submission)}
        </div>
        <div styleName="col">
          {getProvisionalScore(submission)}
        </div>
        <div styleName="col time">
          {moment(submissionTime).format('DD MMM YYYY')} {moment(submissionTime).format('HH:mm:ss')}
        </div>
        <div styleName="col">
          <a href={`/challenges/${challengeId}/submissions/${submissionId}`}>View Details</a>
        </div>
      </div>
    );
  }

  getFinalScore = (finalScore) => {
    const {
      isReviewPhaseComplete,
    } = this.props;
    if (true && finalScore && finalScore > -1 && isReviewPhaseComplete) {
      return finalScore;
    }
    return '-';
  };

  renderTable = () => {
    const {
      mySubmissions,
      challengeId,
    } = this.props;
    const { field, asc } = this.state;
    // eslint-disable-next-line arrow-body-style
    mySubmissions.sort((a, b) => {
      return asc ? a[field] - b[field] : b[field] - a[field];
    });

    return (
      <div styleName="container dev">
        {this.renderTableHead()}
        {!mySubmissions.length && renderEmptyTable()}
        {mySubmissions.map(submission => this.renderTableRow(submission, challengeId))}
      </div>
    );
  }

  renderTableHead = () => {
    const { asc, field } = this.state;
    return (
      <React.Fragment>
        <div styleName="head">
          <div styleName="col-1 col">
            Submission
          </div>
          <div styleName="col-3 col">
            Score
          </div>
        </div>
        <div styleName="sub-head">
          <div styleName="col">
            <button
              type="button"
              onClick={() => {
                this.setState({
                  field: 'submissionId',
                  asc: !asc,
                });
              }}
              styleName="col header-sort"
            >
              <span>Submission ID</span>
              <div
                styleName={cn(
                  'col-arrow',
                  {
                    'col-arrow-sort-asc': (field === 'submissionId') && asc,
                    'col-arrow-is-sorting': field === 'submissionId',
                  },
                )}
              ><ArrowDown />
              </div>
            </button>
          </div>
          <div styleName="col">
            <button
              type="button"
              onClick={() => {
                // language is not supported yet
              }}
              styleName="col header-sort"
            >
              <span>Language</span>
              <div
                styleName={cn(
                  'col-arrow',
                  {
                    'col-arrow-sort-asc': (field === 'language') && asc,
                    'col-arrow-is-sorting': field === 'language',
                  },
                )}
              ><ArrowDown />
              </div>
            </button>
          </div>
          <div styleName="col">
            <button
              type="button"
              onClick={() => {
                this.setState({
                  field: 'submissionStatus',
                  asc: !asc,
                });
              }}
              styleName="col header-sort"
            >
              <span>Status</span>
              <div
                styleName={cn(
                  'col-arrow',
                  {
                    'col-arrow-sort-asc': (field === 'submissionStatus') && asc,
                    'col-arrow-is-sorting': field === 'submissionStatus',
                  },
                )}
              ><ArrowDown />
              </div>
            </button>
          </div>
          <div styleName="col">
            <button
              type="button"
              onClick={() => {
                this.setState({
                  field: 'finalScore',
                  asc: !asc,
                });
              }}
              styleName="col header-sort"
            >
              <span>Final</span>
              <div
                styleName={cn(
                  'col-arrow',
                  {
                    'col-arrow-sort-asc': (field === 'finalScore') && asc,
                    'col-arrow-is-sorting': field === 'finalScore',
                  },
                )}
              ><ArrowDown />
              </div>
            </button>
          </div>
          <div styleName="col">
            <button
              type="button"
              onClick={() => {
                this.setState({
                  field: 'initialScore',
                  asc: !asc,
                });
              }}
              styleName="col header-sort"
            >
              <span>Provision</span>
              <div
                styleName={cn(
                  'col-arrow',
                  {
                    'col-arrow-sort-asc': (field === 'initialScore') && asc,
                    'col-arrow-is-sorting': field === 'initialScore',
                  },
                )}
              ><ArrowDown />
              </div>
            </button>
          </div>
          <div styleName="col time">
            <button
              type="button"
              onClick={() => {
                this.setState({
                  field: 'submissionTime',
                  asc: !asc,
                });
              }}
              styleName="col header-sort"
            >
              <span>Time</span>
              <div
                styleName={cn(
                  'col-arrow',
                  {
                    'col-arrow-sort-asc': (field === 'submissionTime') && asc,
                    'col-arrow-is-sorting': field === 'submissionTime',
                  },
                )}
              ><ArrowDown />
              </div>
            </button>
          </div>
          <div styleName="col" />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const {
      hasRegistered,
      unregistering,
      submissionEnded,
      isLegacyMM,
      challengesUrl,
      challengeId,
    } = this.props;
    return (
      <div styleName="container main">
        <div styleName="title">My Submission</div>
        <div styleName="subtitle">
          We always recommend to download your submission to
          check you uploaded the correct zip file.
          If you don&apos;t wanna see the submission, simply delete.
          If you have a new submission, use the
          Upload Submission button to overwrite the current one.
        </div>
        {this.renderTable()}
        <PrimaryButton
          disabled={!hasRegistered || unregistering || submissionEnded || isLegacyMM}
          theme={{ button: style.submitBtn }}
          to={`${challengesUrl}/${challengeId}/submit`}
        >
          Add Submission
        </PrimaryButton>
      </div>
    );
  }
}

function mapDispatchToProps() {
  return {
  };
}

function mapStateToProps() {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MySubmissionsComponent);


MySubmissionsComponent.propTypes = {
  challenge: PT.shape({
    id: PT.number.isRequired,
    drPoints: PT.any,
    name: PT.any,
    subTrack: PT.any,
    pointPrizes: PT.any,
    events: PT.any,
    technologies: PT.any,
    platforms: PT.any,
    prizes: PT.any,
    numberOfCheckpointsPrizes: PT.any,
    topCheckPointPrize: PT.any,
    reliabilityBonus: PT.any,
    userDetails: PT.any,
    currentPhases: PT.any,
    numRegistrants: PT.any,
    numSubmissions: PT.any,
    status: PT.any,
    appealsEndDate: PT.any,
    allPhases: PT.any,
    track: PT.any,
    roundId: PT.any,
  }).isRequired,
  challengesUrl: PT.string.isRequired,
  hasRegistered: PT.bool.isRequired,
  unregistering: PT.bool.isRequired,
  isLegacyMM: PT.bool.isRequired,
  submissionEnded: PT.bool.isRequired,
  challengeId: PT.number.isRequired,
  mySubmissions: PT.arrayOf(PT.shape()).isRequired,
  isReviewPhaseComplete: PT.bool.isRequired,
};
