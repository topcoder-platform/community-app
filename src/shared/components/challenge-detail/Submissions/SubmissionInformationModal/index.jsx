/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import ArrowUp from 'assets/images/icon-arrow-up.svg';
import ArrowDown from 'assets/images/icon-arrow-down.svg';
import LoadingIndicator from 'components/LoadingIndicator';

import modal from './style.scss';

class SubmissionInformationModal extends React.Component {
  constructor(props) {
    super(props);

    this.getTestCaseOpen = this.getTestCaseOpen.bind(this);
    this.getSubmissionBasicInfo = this.getSubmissionBasicInfo.bind(this);
    this.getTestcases = this.getTestcases.bind(this);
  }

  componentWillUnmount() {
    const { clearTestcaseOpen } = this.props;
    clearTestcaseOpen();
  }

  getTestCaseOpen(index) {
    const { openTestcase } = this.props;
    return openTestcase[index.toString()] || false;
  }


  getSubmissionBasicInfo() {
    const { submission, submissionInformation } = this.props;
    return _.find(submission.submissions, item => item.submissionId === submissionInformation.id);
  }

  getTestcases() {
    const { submissionInformation } = this.props;

    let list = [];
    _.forEach(submissionInformation.review, (item) => {
      if (_.has(item, 'metadata.public.testcases') && item.metadata.public.testcases.length > 0) {
        list = list.concat(item.metadata.public.testcases);
      }
    });

    return list;
  }

  /* eslint-disable class-methods-use-this */
  renderCase(key, value) {
    return (
      <React.Fragment>
        <span>{key}</span>
        <span>{value}</span>
      </React.Fragment>
    );
  }

  render() {
    const {
      toggleTestcase, onClose, isLoadingSubmissionInformation,
      submissionInformation, isReviewPhaseComplete,
    } = this.props;
    const submissionBasicInfo = isLoadingSubmissionInformation
      ? null : this.getSubmissionBasicInfo();
    const testcases = isLoadingSubmissionInformation ? [] : this.getTestcases();

    return (
      <Modal theme={{ container: modal.container }} onCancel={() => onClose(false)}>
        {
          !isLoadingSubmissionInformation && (
            <React.Fragment>
              <div styleName="modal.submission-information-title">Advanced Details</div>
              {
                submissionBasicInfo ? (
                  <div styleName="modal.submission-information-details">
                    <div styleName="modal.submission-information-details-row1">
                      <span styleName="modal.submission-information-details-title">Submission:&nbsp;</span>
                      <span styleName="modal.submission-information-details-id">{submissionInformation.id}</span>
                    </div>
                    <div styleName="modal.submission-information-details-row2">
                      <div styleName="modal.details-header">
                        <div styleName="modal.header-item">Final Score</div>
                        <div styleName="modal.header-item">Provissional Score</div>
                        <div styleName="modal.header-item">Time</div>
                      </div>
                      <div styleName="modal.details-grid">
                        <div
                          styleName="modal.details-item"
                        >
                          {(!submissionBasicInfo.finalScore && submissionBasicInfo.finalScore !== 0) || !isReviewPhaseComplete ? '-' : submissionBasicInfo.finalScore}
                        </div>
                        <div
                          styleName="modal.details-item"
                        >
                          {(!submissionBasicInfo.provisionalScore && submissionBasicInfo.provisionalScore !== 0) ? '-' : submissionBasicInfo.provisionalScore}
                        </div>
                        <div styleName="modal.details-item">
                          {moment(submissionBasicInfo.submissionTime)
                            .format('DD MMM YYYY')} {moment(submissionBasicInfo.submissionTime)
                              .format('HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div styleName="modal.submission-information-error">
                    You don&#39;t have permission to view the advanced details for this submission
                  </div>
                )
              }
              {
                testcases.length > 0 && (
                  <React.Fragment>
                    <div styleName="modal.testcase-title">
                      Test cases executed
                    </div>
                    {
                      _.map(testcases, (item, index) => (
                        <div styleName="modal.testcase-items" key={`Test case #${index + 1}`}>
                          <div styleName="modal.testcase-header">
                            <div>Test case #{index + 1}</div>
                            <span onClick={() => toggleTestcase(index)} role="button" tabIndex={0}>
                              {
                                 this.getTestCaseOpen(index) ? <ArrowUp /> : <ArrowDown />
                              }
                            </span>
                          </div>
                          {
                            _.keys(item).length > 0 && (
                              <div styleName={`modal.testcase-grid ${this.getTestCaseOpen(index) ? 'active' : ''}`}>
                                {
                                  _.map(_.keys(item), (key, caseIndex) => (
                                    <div styleName="modal.testcase-row" key={`case-${caseIndex}-${key}`}>
                                      {
                                        this.renderCase(key, item[key])
                                      }
                                    </div>
                                  ))
                                }
                              </div>
                            )
                          }
                        </div>
                      ))
                    }
                  </React.Fragment>
                )
              }
              <div styleName="modal.submission-information-buttons">
                <div styleName="modal.submission-information-button-close">
                  <PrimaryButton onClick={() => onClose(false)}>Dismiss</PrimaryButton>
                </div>
              </div>
            </React.Fragment>
          )
        }
        {
          isLoadingSubmissionInformation && (
            <LoadingIndicator />
          )
        }
      </Modal>
    );
  }
}

SubmissionInformationModal.defaultProps = {
  isLoadingSubmissionInformation: false,
  submissionInformation: null,
};

SubmissionInformationModal.propTypes = {
  isLoadingSubmissionInformation: PT.bool,
  submissionInformation: PT.shape(),
  onClose: PT.func.isRequired,
  toggleTestcase: PT.func.isRequired,
  openTestcase: PT.shape({}).isRequired,
  clearTestcaseOpen: PT.func.isRequired,
  submission: PT.shape().isRequired,
  isReviewPhaseComplete: PT.bool.isRequired,
};

export default SubmissionInformationModal;
