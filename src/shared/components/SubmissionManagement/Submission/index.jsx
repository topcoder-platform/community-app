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
import moment from 'moment-timezone';
import React from 'react';
import PT from 'prop-types';

import DownloadIcon from '../Icons/IconSquareDownload.svg';
import DeleteIcon from '../Icons/IconTrashSimple.svg';
import ExpandIcon from '../Icons/IconMinimalDown.svg';
import ScreeningStatus from '../ScreeningStatus';

import './styles.scss';

export default function Submission(props) {
  const {
    submissionObject,
    showScreeningDetails,
    type,
    onDelete,
    onDownload,
    onShowDetails,
  } = props;
  const formatDate = date => moment(+new Date(date)).tz('America/Indiana/Indianapolis').format('MMM DD, YYYY hh:mm A');

  return (
    <tr styleName="submission-row">
      <td styleName="preview-col">
        <img
          alt="preview"
          styleName={type === 'design' ? 'design-img' : 'dev-img'}
          src={submissionObject.preview || 'http://placehold.it/90/a01230'}
        />
      </td>
      <td styleName="id-col">{submissionObject.submissionId}</td>
      <td>{submissionObject.submissionType}</td>
      <td styleName="date-col">{formatDate(submissionObject.submissionDate)}</td>
      {type === 'design' && <td styleName="status-col">
        {submissionObject.screening &&
          <ScreeningStatus
            screeningObject={submissionObject.screening}
            onShowDetails={onShowDetails}
            submissionId={submissionObject.submissionId}
          />}
      </td>}
      <td>
        <div styleName="action-col">
          <button
            onClick={() => onDownload(submissionObject.submissionId)}
          ><DownloadIcon /></button>
          <button
            styleName="delete-icon"
            onClick={() => onDelete(submissionObject.submissionId)}
          ><DeleteIcon /></button>
          <button
            styleName={`expand-icon ${(showScreeningDetails ? 'expanded' : '')}`}
            onClick={() => onShowDetails(submissionObject.submissionId)}
          ><ExpandIcon /></button>
        </div>
      </td>
    </tr>
  );
}

Submission.defaultProps = {
  submissionObject: {},
  showScreeningDetails: false,
  type: 'design',
  onDelete: _.noop,
  onDownload: _.noop,
  onShowDetails: _.noop,
};

Submission.propTypes = {
  submissionObject: PT.shape(
    {
      id: PT.string,
      warpreviewnings: PT.string,
      screening: PT.shape({
        status: PT.string,
      }),
      submitted: PT.string,
      type: PT.string,
    },
  ),
  showScreeningDetails: PT.bool,
  type: PT.string,
  onDelete: PT.func,
  onDownload: PT.func,
  onShowDetails: PT.func,
};
