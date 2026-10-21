import _ from 'lodash';
import PT from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Modal } from 'topcoder-react-ui-kit';
import LoadingIndicator from 'components/LoadingIndicator';
import Tooltip from 'components/Tooltip';
import { CHALLENGE_STATUS, getRatingLevel } from 'utils/tc';
import IconClose from 'assets/images/icon-close-green.svg';
import DownloadIcon from 'components/challenge-detail/Submissions/SubmissionHistoryModal/DownloadArtifactIcon.svg';
import modal from 'components/challenge-detail/Submissions/SubmissionHistoryModal/style.scss';
import style from './style.scss';

/**
 * Lists authorized artifacts for Submission Management and MM submission dialogs.
 * Active MMs show only example; completed MMs also offer one ZIP of all artifacts.
 * @param {Object} props Submission identity, challenge status, and async download callbacks.
 * @returns {React.Element} Artifact modal with loading, empty, and error states.
 * @throws No errors escape; request failures are displayed in the modal.
 */
export default function DownloadArtifactsModal({
  submissionId, onCancel, getSubmissionArtifacts, onDownloadArtifacts,
  onDownloadAllArtifacts, isMM, challengeStatus, handle, rating,
}) {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const completed = challengeStatus === CHALLENGE_STATUS.COMPLETED;
  const visibleArtifacts = isMM && !completed
    ? artifacts.filter(artifact => artifact.toLowerCase() === 'example') : artifacts;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setArtifacts([]);
    Promise.resolve().then(() => getSubmissionArtifacts(submissionId))
      .then((response) => {
        if (!cancelled) {
          setArtifacts(Array.isArray(response.artifacts) ? response.artifacts : []);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load artifacts. Please try again.');
      })
      .then(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [submissionId, getSubmissionArtifacts]);

  /**
   * Runs an individual or bulk download and displays any failure without closing.
   * @param {String|String[]} ids Artifact ID, or IDs to include in the ZIP.
   * @returns {Promise<void>} Resolves once the callback settles; errors are displayed.
   */
  const download = async (ids) => {
    setDownloading(true);
    setError('');
    try {
      const callback = Array.isArray(ids) ? onDownloadAllArtifacts : onDownloadArtifacts;
      await callback(submissionId, ids);
    } catch (e) {
      setError('Unable to download artifacts. Please try again.');
    }
    setDownloading(false);
  };

  return (
    <Modal onCancel={onCancel} theme={{ container: `${modal.modal} ${style.modalContainer}` }}>
      <div role="dialog" aria-modal="true" aria-label="Submission Artifacts">
        <div className={modal.header}>
          <h2>Submission Artifacts</h2>
          <button type="button" aria-label="Close artifacts" className={`${modal['icon-button']} ${modal['close-icon']}`} onClick={onCancel}>
            <IconClose />
          </button>
        </div>
        <div className={modal.metadata}>
          <span><strong>Submission ID:</strong> {submissionId}</span>
          {handle && <span><strong>Handle:</strong> <span className={modal[`level-${getRatingLevel(rating)}`]}>{handle}</span></span>}
        </div>
        <div className={modal['table-scroll']}>
          <table className={modal.table}>
            <thead><tr><th scope="col">Artifact ID</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {!loading && visibleArtifacts.map(item => (
                <tr key={item}>
                  <td>{item}</td>
                  <td>
                    <Tooltip content="Download artifact" className={modal.tooltip} trigger={['hover', 'focus']} suppressDiv>
                      <button
                        onClick={() => download(item)}
                        type="button"
                        aria-label={`Download ${item}`}
                        disabled={downloading}
                        className={modal['icon-button']}
                      >
                        <DownloadIcon />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <LoadingIndicator />}
        {!loading && !error && !visibleArtifacts.length && (
          <p className={modal.message}>No artifacts found</p>
        )}
        {error && <p role="alert" className={modal.message}>{error}</p>}
        <div className={modal.footer}>
          <button type="button" onClick={onCancel} className={modal.button}>Close</button>
          {isMM && completed && !loading && visibleArtifacts.length > 0
            && onDownloadAllArtifacts && (
            <button type="button" onClick={() => download(visibleArtifacts)} disabled={downloading} className={`${modal.button} ${modal.primary}`}>
              {downloading ? 'Downloading...' : 'Download all'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

DownloadArtifactsModal.defaultProps = {
  onCancel: _.noop,
  submissionId: '',
  getSubmissionArtifacts: _.noop,
  onDownloadArtifacts: _.noop,
  onDownloadAllArtifacts: null,
  isMM: false,
  challengeStatus: '',
  handle: '',
  rating: null,
};

DownloadArtifactsModal.propTypes = {
  onCancel: PT.func,
  submissionId: PT.string,
  getSubmissionArtifacts: PT.func,
  onDownloadArtifacts: PT.func,
  onDownloadAllArtifacts: PT.func,
  isMM: PT.bool,
  challengeStatus: PT.string,
  handle: PT.string,
  rating: PT.number,
};
