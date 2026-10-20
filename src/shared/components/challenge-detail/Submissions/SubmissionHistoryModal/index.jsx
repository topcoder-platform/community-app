import React, { useCallback, useState } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { Modal } from 'topcoder-react-ui-kit';
import { getRatingLevel } from 'utils/tc';
import { getSubmissionArtifacts } from 'services/submissions';
import downloadArtifacts from 'utils/challenge-detail/artifacts';
import LoadingIndicator from 'components/LoadingIndicator';
import Tooltip from 'components/Tooltip';
import DownloadArtifactsModal from 'components/SubmissionManagement/DownloadArtifactsModal';
import IconClose from 'assets/images/icon-close-green.svg';
import ArrowDown from 'assets/images/icon-arrow-down.svg';
import ArtifactIcon from './ArtifactIcon.svg';
import style from './style.scss';

/**
 * Formats a history score, preserving precision and treating absent values as missing.
 * @param {Number|String|null} value API score.
 * @returns {Number|String} Original score, zero for negative scores, or a dash.
 * @throws This function does not throw.
 */
function displayScore(value) {
  if (value == null || value === '' || value === '-' || !Number.isFinite(Number(value))) return '-';
  return Number(value) < 0 ? 0 : value;
}

/**
 * Displays MM attempt IDs, dates, scores, and artifact actions in a sortable table.
 * Artifact details replace history temporarily so only one modal backdrop is shown.
 * @param {Object} props Member, submissions, access context, and close callback.
 * @returns {React.Element} History or the selected submission's artifact dialog.
 * @throws No errors directly; artifact request failures are handled by its dialog.
 */
export default function SubmissionHistoryModal({
  member, rating, submissions, challengeStatus, auth, isLoggedIn,
  loadingHistory, showFinalResults, onCancel,
}) {
  const [ascending, setAscending] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const loadArtifacts = useCallback(id => getSubmissionArtifacts(auth.tokenV3, id), [auth.tokenV3]);
  const onDownload = useCallback(
    (id, ids) => downloadArtifacts(auth.tokenV3, id, ids), [auth.tokenV3],
  );
  const sorted = [...submissions].sort((a, b) => {
    const difference = moment(a.submissionTime || a.created || a.createdAt).valueOf()
      - moment(b.submissionTime || b.created || b.createdAt).valueOf();
    return ascending ? difference : -difference;
  });

  if (selectedSubmission) {
    return (
      <DownloadArtifactsModal
        submissionId={selectedSubmission}
        handle={member}
        rating={rating}
        isMM
        challengeStatus={challengeStatus}
        getSubmissionArtifacts={loadArtifacts}
        onDownloadArtifacts={onDownload}
        onDownloadAllArtifacts={onDownload}
        onCancel={() => setSelectedSubmission(null)}
      />
    );
  }

  return (
    <Modal onCancel={onCancel} theme={{ container: style.modal }}>
      <div role="dialog" aria-modal="true" aria-label="Submission History">
        <div className={style.header}>
          <h2>Submission History</h2>
          <button type="button" aria-label="Close submission history" className={`${style['icon-button']} ${style['close-icon']}`} onClick={onCancel}>
            <IconClose />
          </button>
        </div>
        <div className={style.metadata}>
          <span><strong>Handle:</strong> <span className={style[`level-${getRatingLevel(rating)}`]}>{member}</span></span>
        </div>
        <div className={style['table-scroll']}>
          <table className={style.table}>
            <thead>
              <tr>
                <th scope="col">Submission ID</th>
                <th scope="col" aria-sort={ascending ? 'ascending' : 'descending'}>
                  <button type="button" className={style['sort-button']} onClick={() => setAscending(!ascending)}>
                    Submission Date <ArrowDown className={ascending ? style.ascending : ''} />
                  </button>
                </th>
                <th scope="col">Provisional Score</th>
                <th scope="col">Final Score</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loadingHistory && sorted.map((submission) => {
                const id = submission.submissionId || submission.id;
                const date = submission.submissionTime
                  || submission.created || submission.createdAt;
                const failed = submission.status === 'failed'
                  || Number(submission.provisionalScore) < 0;
                let provisional = displayScore(submission.provisionalScore);
                if (submission.status === 'in-review') provisional = 'In review';
                if (submission.status === 'queued') provisional = 'Queued';
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{date ? moment(date).format('D MMM YYYY, H:mm') : '-'}</td>
                    <td>{failed ? <span className={style.failed}>Failed</span> : provisional}</td>
                    <td>{showFinalResults ? displayScore(submission.finalScore) : '-'}</td>
                    <td>
                      {isLoggedIn && (
                        <Tooltip content="View artifact" className={style.tooltip} trigger={['hover', 'focus']} suppressDiv>
                          <button type="button" aria-label={`View artifacts for ${id}`} className={style['icon-button']} onClick={() => setSelectedSubmission(id)}>
                            <ArtifactIcon />
                          </button>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {loadingHistory && <LoadingIndicator />}
        {!loadingHistory && !submissions.length && (
          <p className={style.message}>No submissions found</p>
        )}
        <div className={style.footer}>
          <button type="button" className={style.button} onClick={onCancel}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

SubmissionHistoryModal.defaultProps = {
  rating: null,
  isLoggedIn: false,
  loadingHistory: false,
  showFinalResults: false,
};

SubmissionHistoryModal.propTypes = {
  member: PT.string.isRequired,
  rating: PT.number,
  submissions: PT.arrayOf(PT.shape()).isRequired,
  challengeStatus: PT.string.isRequired,
  auth: PT.shape().isRequired,
  isLoggedIn: PT.bool,
  loadingHistory: PT.bool,
  showFinalResults: PT.bool,
  onCancel: PT.func.isRequired,
};
