/**
 * This component will render the entire assemly of submissions table.
 * It receives via props the array of submission data objects;
 * a showDetails set with submission IDs for which details panel
 * should be shown; and type property (design or develop) to know
 * whether the screening status column should be rendered.
 *
 * Also it will receive a bunch of callbacks which should be properly
 * wired to the children components:
 * onDelete(submissionId) – to delete specified submission;
 * onDownload(submissionId) – to download the specified submission;
 * onOpenOnlineReview(submissionId);
 * onHelp(submissionId);
 * onShowDetails(submissionId).
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import shortid from 'shortid';
import moment from 'moment';
import { COMPETITION_TRACKS } from 'utils/tc';
import Submission from '../Submission';
import ScreeningDetails from '../ScreeningDetails';
import './styles.scss';

export default function SubmissionsTable(props) {
  const {
    challenge,
    submissionObjects,
    showDetails,
    track,
    onDelete,
    onlineReviewUrl,
    helpPageUrl,
    onDownload,
    onShowDetails,
    status,
    submissionPhaseStartDate,
  } = props;

  const submissionsWithDetails = [];
  if (!submissionObjects || submissionObjects.length === 0) {
    submissionsWithDetails.push((
      <tr key={999} styleName="submission-row">
        <td colSpan="6" styleName="no-submission">
          You have no submission uploaded so far.
        </td>
      </tr>
    ));
  } else {
    submissionObjects.forEach((subObject) => {
      // submissionPhaseStartDate will be the start date of
      // the current submission/checkpoint or empty string if any other phase
      const allowDelete = submissionPhaseStartDate
        && moment(subObject.submissionDate).isAfter(submissionPhaseStartDate);

      const submission = (
        <Submission
          challenge={challenge}
          submissionObject={subObject}
          showScreeningDetails={showDetails[subObject.id]}
          track={track}
          onShowDetails={onShowDetails}
          onDelete={onDelete}
          onDownload={onDownload}
          status={status}
          key={shortid.generate()}
          allowDelete={allowDelete}
        />
      );
      submissionsWithDetails.push(submission);

      const submissionDetail = (
        <tr key={subObject.id} styleName="submission-row">
          {showDetails[subObject.id]
            && (
            <td colSpan="6" styleName="dev-details">
              <ScreeningDetails
                screeningObject={subObject.screening}
                helpPageUrl={helpPageUrl}
                onlineReviewUrl={onlineReviewUrl}
                submissionId={subObject.id}
              />
            </td>
            )}
        </tr>
      );
      submissionsWithDetails.push(submissionDetail);
    });
  }

  return (
    <div styleName="submissions-table">
      <table>
        <thead>
          <tr>
            <th>
              ID
            </th>
            <th>
              Type
            </th>
            <th>
              Submission Date
            </th>
            {track === COMPETITION_TRACKS.DES && (
            <th styleName="status">
              Screening Status
            </th>
            )}
            <th styleName="actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {submissionsWithDetails}
        </tbody>
      </table>
    </div>
  );
}

const SubShape = PT.shape({
  id: PT.string,
  warpreviewnings: PT.string,
  screening: PT.shape({
    status: PT.string,
  }),
  submitted: PT.string,
  track: PT.string,
});

SubmissionsTable.defaultProps = {
  submissionObjects: [],
  onDelete: _.noop,
  onDownload: _.noop,
  onShowDetails: _.noop,
  onlineReviewUrl: '',
  helpPageUrl: '',
};

SubmissionsTable.propTypes = {
  challenge: PT.shape().isRequired,
  submissionObjects: PT.arrayOf(SubShape),
  showDetails: PT.shape().isRequired,
  track: PT.string.isRequired,
  onDelete: PT.func,
  onlineReviewUrl: PT.string,
  helpPageUrl: PT.string,
  onDownload: PT.func,
  onShowDetails: PT.func,
  status: PT.string.isRequired,
  submissionPhaseStartDate: PT.string.isRequired,
};
