import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import tc from 'components/buttons/themed/tc.scss';

import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import LoadingIndicator from 'components/LoadingIndicator';
import IconClose from 'assets/images/icon-close-green.svg';


import styles from './styles.scss';

const theme = {
  container: styles.modalContainer,
  overlay: styles.modalOverlay,
};

const buttonThemes = {
  tc,
};

const SystemReviewers = {
  Default: 'TC System',
};

const RatingsListModal = ({
  onCancel,
  submissionId,
  challengeId,
  getSubmissionScores,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatScoreValue = useCallback((value) => {
    if (_.isNil(value)) {
      return 'N/A';
    }
    if (Number.isFinite(value)) {
      return Number.isInteger(value) ? `${value}` : value.toFixed(2);
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return Number.isInteger(numeric) ? `${numeric}` : numeric.toFixed(2);
    }
    return `${value}`;
  }, []);

  const loadScores = useCallback(async () => {
    if (!submissionId) {
      setReviews([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getSubmissionScores(submissionId, challengeId);
      const normalized = Array.isArray(response) ? response : [];
      const decorated = normalized.map((entry, index) => ({
        id: entry.id || `${submissionId}-${index}`,
        reviewType: entry.label || entry.reviewType || 'Score',
        reviewer: entry.reviewer || SystemReviewers.Default,
        score: formatScoreValue(entry.score),
        isPassing: typeof entry.isPassing === 'boolean' ? entry.isPassing : null,
      }));
      setReviews(decorated);
    } catch (error) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [submissionId, challengeId, getSubmissionScores, formatScoreValue]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  return (
    <Modal onCancel={() => onCancel()} theme={theme}>
      <div className={styles.container}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Submission Details</h2>
          <div className={styles.icon} role="presentation" onClick={() => onCancel()}>
            <IconClose />
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.header}>
            <div className={styles['header-item']}>Review Type</div>
            <div className={styles['header-item']}>Reviewer</div>
            <div className={styles['header-item']}>Score</div>
            <div className={styles['header-item']}>Status</div>
          </div>
          {reviews.map((review) => {
            const { isPassing } = review;
            const isFailed = isPassing === false;
            const isPassed = isPassing === true;
            const statusIsDefined = isPassed || isFailed;
            const status = isPassing ? 'Passed' : 'Failed';

            return (
              <div className={styles['list-item']}>
                <div className={styles['list-col-item']}>
                  {review.reviewType}
                </div>
                <div className={styles['list-col-item']}>
                  <strong>{review.reviewer}</strong>
                </div>
                <div className={styles['list-col-item']}>
                  {review.score}
                </div>
                <div className={styles['list-col-item']}>
                  {statusIsDefined ? status : 'N/A'}
                </div>
              </div>
            );
          })}
          {
            loading && <LoadingIndicator />
          }
        </div>
      </div>
      <div className={styles['buttons-container']}>
        <PrimaryButton
          onClick={() => onCancel()}
          theme={{
            button: buttonThemes.tc['primary-green-md'],
          }}
        >
          Close
        </PrimaryButton>
      </div>
    </Modal>
  );
};

RatingsListModal.defaultProps = {
  onCancel: () => {},
  submissionId: '',
  challengeId: '',
  getSubmissionScores: _.noop,
};

RatingsListModal.propTypes = {
  onCancel: PropTypes.func,
  submissionId: PropTypes.string,
  challengeId: PropTypes.string,
  getSubmissionScores: PropTypes.func,
};

export default RatingsListModal;
