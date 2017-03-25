/**
 * This component should render the entire page assembly,
 * but not yet implement the logic behind user actions.
 * It still receives submissions and challenge data, all callbacks, etc. from its parent container
 *
 * Namely, it receives via props: the mock data object (provided along with this specs),
 * the showDetails set, and config object holding all necessary callbacks:
 * onBack() - to trigger when user clicks Back button under the challenge name;
 * onDelete(submissionId);
 * onDownload() (to be triggered by download icon)
 * onOpenOnlineReview(submissionId); onHelp(submissionId);
 * onShowDetails(submissionId);
 * onSubmit() - to trigger when user clicks Add Submission button.
 */

import _ from 'lodash';
import Button from 'components/Button';
import React, { PropTypes as PT } from 'react';
import SubmissionsTable from '../SubmissionsTable';
import './styles.scss';

export default function SubmissionManagement(props) {
  const {
    mockObject,
    showDetails,
    onDelete,
    onOpenOnlineReview,
    onHelp,
    onDownload,
    onShowDetails,
    onBack,
    onSubmit,
  } = props;

  const isDesign = mockObject.challenge.type === 'design';
  const isDevelop = mockObject.challenge.type === 'develop';

  const config = {
    onDelete,
    onHelp,
    onDownload,
    onOpenOnlineReview,
    onShowDetails,
  };
  return (
    <div styleName="submission-management">
      <div styleName="submission-management-header">
        <div styleName="left-col">
          <h4 styleName="name">{mockObject.challenge.name}</h4>
          <button styleName="back-btn" onClick={() => onBack()}>
            &lt; Back
          </button>
        </div>
        <div styleName="right-col">
          <p styleName="round">{mockObject.challenge.phase}</p>
          <p styleName="time-left">2H 10M</p>
          <p styleName="left-label">left to submit</p>
        </div>
      </div>
      <div styleName="submission-management-content">
        <div styleName="content-head">
          <p styleName="title">Manage your submissions</p>
          {isDesign && <p styleName="round-ends">
            <span styleName="ends-label">Round 2 Ends:</span> Friday 08/24/16 10:00 AM EDT</p>}
        </div>
        {isDesign && <p styleName="recommend-info">
          We always recommend to download your submission to check you uploaded the correct
           zip files and also verify the photos and fonts declarations.
           If you don’t want to see a submission, simply delete. If you have a new submission,
           use the Upload Submission button to add one at the top of the list.</p>}
        {isDevelop && <p styleName="recommend-info">
          We always recommend to download your submission to check you uploaded
           the correct zip file.
           If you don’t want to see the submission, simply delete.
           If you have a new submission, use the Upload Submission button to
            overwrite the current one.</p>}
        <SubmissionsTable
          submissionObjects={mockObject.submissions}
          showDetails={showDetails}
          type={mockObject.challenge.type}
          {...config}
        />
      </div>
      {/* TODO: These two button elements should be merged in one, which will
        * work both for design and dev submission pages. */
        isDevelop &&
        <Button
          className="tc-btn-primary tc-btn-md"
          onClick={onSubmit}
          styleName="add-sub-btn"
        >
          {(!mockObject.submissions || mockObject.submissions.length === 0)
            ? 'Add Submission' : 'Update Submission'}
        </Button>}
      {isDesign &&
        <Button
          className="tc-btn-primary tc-btn-md"
          onClick={onSubmit}
          styleName="add-sub-btn"
        >Add Submission</Button>}
    </div>
  );
}

SubmissionManagement.defaultProps = {
  mockObject: {},
  onDelete: _.noop,
  onShowDetails: _.noop,
  showDetails: new Set(),
  onOpenOnlineReview: _.noop,
  onHelp: _.noop,
  onDownload: _.noop,
  onBack: _.noop,
  onSubmit: _.noop,
};

SubmissionManagement.propTypes = {
  mockObject: PT.shape({
    challenge: PT.object,
    submissions: PT.array,
  }),
  showDetails: PT.instanceOf(Set),
  onDelete: PT.func,
  onOpenOnlineReview: PT.func,
  onHelp: PT.func,
  onDownload: PT.func,
  onShowDetails: PT.func,
  onBack: PT.func,
  onSubmit: PT.func,
};
