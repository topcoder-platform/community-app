/**
 * This component receives via props a single submission data object,
 * and showScreeningDetails boolean property, which should tell whether
 * the Screening Details component should be rendered or not
 * (and also to choose the proper orientation of arrow icon).
 *
 * Also, this component will receive the following callbacks to be triggered
 * when user clicks on buttons/icons/links:
 * onDelete() (to be triggered by delete icon),
 * onDownload() (to be triggered by download icon),
 * onShowDetails() (to be triggered by details arrow icon, and also by screening status component).
 */

import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { config } from 'topcoder-react-utils';

import PT from 'prop-types';

import DeleteIcon from '../Icons/IconTrashSimple.svg';
import DownloadIcon from '../Icons/IconSquareDownload.svg';
import ExpandIcon from '../Icons/IconMinimalDown.svg';
import ScreeningStatus from '../ScreeningStatus';

import './styles.scss';

export default function Submission(props) {
  const {
    submissionObject,
    showScreeningDetails,
    type,
    onDelete,
    onShowDetails,
    status,
    allowDelete,
  } = props;
  const formatDate = date => moment(+new Date(date)).format('MMM DD, YYYY hh:mm A');

  return (
    <tr styleName="submission-row">
      <td styleName="preview-col">
        <img
          alt="preview"
          styleName={type === 'DESIGN' ? 'design-img' : 'dev-img'}
          src={
            submissionObject.preview
            || `${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${submissionObject.submissionId}&sbt=tiny&sfi=1`
          }
        />
      </td>
      <td styleName="id-col">
        {submissionObject.submissionId}
      </td>
      <td>
        {submissionObject.submissionType}
      </td>
      <td styleName="date-col">
        {formatDate(submissionObject.submissionDate)}
      </td>
      {
        type === 'DESIGN' && (
          <td styleName="status-col">
            {submissionObject.screening
              && (
              <ScreeningStatus
                screeningObject={submissionObject.screening}
                onShowDetails={onShowDetails}
                submissionId={submissionObject.submissionId}
              />
              )}
          </td>
        )
      }
      <td styleName="action-col">
        <div>
          <a
            href={
              type === 'DESIGN'
                ? `${config.URL.STUDIO}?module=DownloadSubmission&sbmid=${submissionObject.submissionId}&sbt=original`
                : submissionObject.download
            }
          >
            <DownloadIcon />
          </a>
          { /*
            TODO: At the moment we just fetch downloads from the legacy
              Topcoder Studio API, and we don't need any JS code to this.
              It may change soon, as we move to the new TC API for
              downloads. Then we'll use this commented out code or
              remove it for good.
          <button
            onClick={() => onDownload(submissionObject.submissionId)}
          ><DownloadIcon /></button>
          */ }
          {status !== 'COMPLETED'
            && (
            <button
              styleName="delete-icon"
              onClick={() => onDelete(submissionObject.submissionId)}
              disabled={!allowDelete}
              type="button"
            >
              <DeleteIcon />
            </button>
            )
          }
          <button
            styleName={`expand-icon ${(showScreeningDetails ? 'expanded' : '')}`}
            onClick={() => onShowDetails(submissionObject.submissionId)}
            type="button"
          >
            <ExpandIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

Submission.defaultProps = {
  submissionObject: {},
  showScreeningDetails: false,
  onShowDetails: _.noop,
};

Submission.propTypes = {
  submissionObject: PT.shape({
    submissionId: PT.number,
    warpreviewnings: PT.string,
    screening: PT.shape({
      status: PT.string,
    }),
    submitted: PT.string,
    type: PT.string,
  }),
  showScreeningDetails: PT.bool,
  type: PT.string.isRequired,
  onDelete: PT.func.isRequired,
  onShowDetails: PT.func,
  status: PT.string.isRequired,
  allowDelete: PT.bool.isRequired,
};
