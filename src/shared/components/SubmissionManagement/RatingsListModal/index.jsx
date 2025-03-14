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
  getReviewTypesList,
  getChallengeResources,
  getSubmissionInformation,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const enrichSources = useCallback(async (submissionReviews, reviewSummation) => {
    const reviewTypes = await getReviewTypesList();
    const resources = await getChallengeResources(challengeId);

    const finalReview = {
      reviewType: 'Final score',
      reviewer: '',
      score: reviewSummation ? reviewSummation.aggregateScore : 'N/A',
      isPassing: reviewSummation ? reviewSummation.isPassing : undefined,
    };

    return [...submissionReviews.map((review) => {
      const reviewType = reviewTypes.find(rt => rt.id === review.typeId);
      const reviewer = resources
        .find(resource => resource.memberHandle === review.reviewerId) || SystemReviewers.Default;
      return {
        ...review,
        reviewType: reviewType ? reviewType.name : '',
        reviewer,
      };
    }), finalReview];
  }, [challengeId, getReviewTypesList, getChallengeResources]);

  const getSubmission = useCallback(async () => {
    const submissionInfo = await getSubmissionInformation(submissionId);
    setReviews(await enrichSources(submissionInfo.review, submissionInfo.reviewSummation[0]));
    setLoading(false);
  }, [submissionId, getSubmissionInformation, enrichSources]);

  useEffect(() => {
    setLoading(true);
    getSubmission();
  }, [submissionId, getSubmission]);

  return (
    <Modal onCancel={() => onCancel()} theme={theme}>
      <div className={styles.container}>
        <div className={styles["modal-header"]}>
          <h2 className={styles["modal-title"]}>Submission Details</h2>
          <div className={styles["icon"]}role="presentation" onClick={() => onCancel()}>
            <IconClose />
          </div>
        </div>
        <div className={styles["list"]}>
          <div className={styles["header"]}>
            <div className={styles["header-item"]}>Review Type</div>
            <div className={styles["header-item"]}>Reviewer</div>
            <div className={styles["header-item"]}>Score</div>
            <div className={styles["header-item"]}>Status</div>
          </div>
          {reviews.map((review) => {
            const { isPassing } = review;
            const isFailed = isPassing === false;
            const isPassed = isPassing === true;
            const statusIsDefined = isPassed || isFailed;
            const status = isPassing ? 'Passed' : 'Failed';

            return (
              <div className={styles["list-item"]}>
                <div className={styles["list-col-item"]}>
                  {review.reviewType}
                </div>
                <div className={styles["list-col-item"]}>
                  <strong>{review.reviewer}</strong>
                </div>
                <div className={styles["list-col-item"]}>
                  {review.score}
                </div>
                <div className={styles["list-col-item"]}>
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
      <div className={styles["buttons-container"]}>
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
  getReviewTypesList: _.noop,
  getChallengeResources: _.noop,
  getSubmissionInformation: _.noop,
};

RatingsListModal.propTypes = {
  onCancel: PropTypes.func,
  submissionId: PropTypes.string,
  challengeId: PropTypes.string,
  getReviewTypesList: PropTypes.func,
  getChallengeResources: PropTypes.func,
  getSubmissionInformation: PropTypes.func,
};

export default RatingsListModal;
