/*
  Component renders my submission detail
*/

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import sortList from 'utils/challenge-detail/sort';
import { getSubmissionStatus } from 'utils/challenge-detail/submission-status';
import Tooltip from 'components/Tooltip';
import IconClose from 'assets/images/icon-close-green.svg';

import ArrowDown from '../../../../../assets/images/arrow-down.svg';
import IconFail from '../../icons/failed.svg';
import './styles.scss';


class SubmissionsDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedSubmissions: [],
    };
    this.sortSubmissions = this.sortSubmissions.bind(this);
    this.getSubmissionsSortParam = this.getSubmissionsSortParam.bind(this);
    this.updateSortedSubmissions = this.updateSortedSubmissions.bind(this);
    this.getReviewName = this.getReviewName.bind(this);
  }

  componentDidMount() {
    this.updateSortedSubmissions();
  }

  componentDidUpdate(prevProps) {
    const { submission: { review }, submissionsSort } = this.props;
    if (
      !_.isEqual(prevProps.submission.review, review)
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
    let { sort } = submissionsSort;
    const { field } = submissionsSort;
    if (!field) {
      return {
        field: null,
        sort: null,
      };
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
   * Get review name
   * @param {Object} review review object
   */
  getReviewName(review) {
    const { reviewTypes } = this.props;
    const reviewType = _.find(reviewTypes, { id: review.typeId });
    if (reviewType) {
      return reviewType.name;
    }
    return '';
  }

  /**
   * Update sorted submission array
   */
  updateSortedSubmissions() {
    const { submission: { review } } = this.props;
    const sortedSubmissions = _.cloneDeep(review || []);
    this.sortSubmissions(sortedSubmissions);
    this.setState({ sortedSubmissions });
  }

  /**
   * Sort array of submission
   * @param {Array} submissions array of submission
   */
  sortSubmissions(submissions) {
    const { field, sort } = this.getSubmissionsSortParam();
    if (!field) {
      return submissions;
    }
    return sortList(submissions, field, sort, (a, b) => {
      let valueA = 0;
      let valueB = 0;
      let valueIsString = false;
      switch (field) {
        case 'Review Type': {
          valueA = this.getReviewName(a);
          valueB = this.getReviewName(b);
          break;
        }
        case 'Reviewer': {
          valueA = 'TC System';
          valueB = 'TC System';
          break;
        }
        case 'Score': {
          valueA = a.score;
          valueB = b.score;
          break;
        }
        case 'Status': {
          valueA = a.status;
          valueB = b.status;
          valueIsString = true;
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
    const { onCancel, submission, onSortChange } = this.props;
    let { finalScore } = submission;
    const { sortedSubmissions } = this.state;
    const { isAccepted } = getSubmissionStatus(submission);
    const finalStatusStyleName = isAccepted ? 'status-complete' : 'status-in-queue';
    const finalStatusLabel = isAccepted ? 'Complete' : 'In Queue';

    const { field, sort } = this.getSubmissionsSortParam();
    const revertSort = (sort === 'desc') ? 'asc' : 'desc';

    if (_.isNumber(finalScore)) {
      if (finalScore > 0) {
        finalScore = finalScore.toFixed(2);
      }
    } else {
      finalScore = '-';
    }
    return (
      <div styleName="wrapper">
        <div styleName="header">
          <h2 styleName="title">Submission Details</h2>
          <div styleName="icon" role="presentation" onClick={() => onCancel()}>
            <IconClose />
          </div>
        </div>
        <hr styleName="hr" />
        <div styleName="inner-content">
          <div styleName="sub-header">
            <span>Submission: </span>
            <span styleName="title-detail">{submission.id} ({submission.submissionId})</span>
          </div>
          <div styleName="table-row table-content-header">
            <div
              styleName={cn(
                'table-column column-1',
              )}
            >
              <button
                type="button"
                styleName="header-sort"
                onClick={() => {
                  onSortChange({
                    field: 'Review Type',
                    sort: (field === 'Review Type') ? revertSort : 'desc',
                  });
                }}
              >
                <span>Review Type</span>
                {
                  field === 'Review Type' && (
                    <div
                      styleName={cn(
                        'col-arrow',
                        'col-arrow-is-sorting',
                        {
                          'col-arrow-sort-asc': (sort === 'asc'),
                        },
                      )}
                    ><ArrowDown />
                    </div>
                  )
                }
              </button>
            </div>
            <div
              styleName={cn(
                'table-column',
              )}
            >
              <button
                type="button"
                styleName="header-sort"
                onClick={() => {
                  onSortChange({
                    field: 'Reviewer',
                    sort: (field === 'Reviewer') ? revertSort : 'desc',
                  });
                }}
              >
                <span>Reviewer</span>
                {
                  field === 'Reviewer' && (
                    <div
                      styleName={cn(
                        'col-arrow',
                        'col-arrow-is-sorting',
                        {
                          'col-arrow-sort-asc': (sort === 'asc'),
                        },
                      )}
                    ><ArrowDown />
                    </div>
                  )
                }
              </button>
            </div>
            <div
              styleName={cn(
                'table-column',
              )}
            >
              <button
                type="button"
                styleName="header-sort"
                onClick={() => {
                  onSortChange({
                    field: 'Score',
                    sort: (field === 'Score') ? revertSort : 'desc',
                  });
                }}
              >
                <span>Score</span>
                {
                  field === 'Score' && (
                    <div
                      styleName={cn(
                        'col-arrow',
                        'col-arrow-is-sorting',
                        {
                          'col-arrow-sort-asc': (sort === 'asc'),
                        },
                      )}
                    ><ArrowDown />
                    </div>
                  )
                }
              </button>
            </div>
            <div
              styleName={cn(
                'table-column',
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
                {
                  field === 'Status' && (
                    <div
                      styleName={cn(
                        'col-arrow',
                        'col-arrow-is-sorting',
                        {
                          'col-arrow-sort-asc': (sort === 'asc'),
                        },
                      )}
                    ><ArrowDown />
                    </div>
                  )
                }
              </button>
            </div>
          </div>
          {
            sortedSubmissions.map((review) => {
              let { score } = review;
              if (_.isNumber(score)) {
                if (score > 0) {
                  score = score.toFixed(2);
                }
              } else {
                score = '-';
              }
              return (
                <div key={review.id} styleName="table-row">
                  <div
                    styleName={cn(
                      'table-column column-1',
                    )}
                  >
                    <div styleName="mobile-header">Review Type</div>
                    <span>{this.getReviewName(review)}</span>
                  </div>
                  <div
                    styleName={cn(
                      'table-column',
                    )}
                  >
                    <div styleName="mobile-header">Reviewer</div>
                    <span>TC System</span>
                  </div>
                  <div
                    styleName={cn(
                      'table-column',
                    )}
                  >
                    <div styleName="mobile-header">Score</div>

                    {(score < 0) ? (
                      <Tooltip content="Failed Submission" className="toolTipPadding">
                        <IconFail />
                      </Tooltip>
                    ) : (<span>{score}</span>)}
                  </div>
                  <div
                    styleName={cn(
                      'table-column',
                    )}
                  >
                    <div styleName="mobile-header">Status</div>

                    {(review.status === 'completed') ? (
                      <span styleName="status-complete">Complete</span>
                    ) : (
                      <span styleName="status-failed">Failed</span>
                    )}
                  </div>
                </div>
              );
            })
          }
          <div styleName="table-row table-content-footer">
            <div styleName="table-column column-1">
              <div styleName="mobile-header">Review Type</div>
              <span>Final Score</span>
            </div>
            <div styleName="table-column">
              <div styleName="mobile-header">Reviewer</div>
              <span>N/A</span>
            </div>
            <div styleName="table-column">
              <div styleName="mobile-header">Score</div>
              <span>{finalScore || 'N/A'}</span>
            </div>
            <div styleName="table-column">
              <div styleName="mobile-header">Status</div>
              <span styleName={finalStatusStyleName}>{finalStatusLabel}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SubmissionsDetailView.defaultProps = {
  onCancel: () => {},
  onSortChange: () => {},
};

SubmissionsDetailView.propTypes = {
  onCancel: PT.func,
  submission: PT.shape({
    id: PT.number,
    finalScore: PT.any,
    submissionId: PT.string,
    provisionalScoringIsCompleted: PT.bool,
    review: PT.arrayOf(PT.shape()),
  }).isRequired,
  reviewTypes: PT.arrayOf(PT.shape()).isRequired,
  submissionsSort: PT.shape({
    field: PT.string,
    sort: PT.string,
  }).isRequired,
  onSortChange: PT.func,
};

export default SubmissionsDetailView;
