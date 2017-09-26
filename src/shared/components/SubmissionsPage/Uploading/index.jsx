import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RobotHappy from 'assets/images/robot-happy.svg';
import RobotSad from 'assets/images/robot-embarassed.svg';
import { PrimaryButton, Button } from 'components/buttons';
import './styles.scss';

const Uploading = ({
  isSubmitting,
  submitDone,
  challengeName,
  challengeId,
  reset,
  error,
  retry,
}) => (
  <div styleName="container">
    <div styleName="uploading">
      {
        isSubmitting &&
          <h3>UPLOADING SUBMISSION FOR</h3>
      }
      {
        submitDone &&
        <h3>SUBMISSION COMPLETED FOR</h3>
      }
      {
        error &&
          <h3>ERROR SUBMITTING FOR</h3>
      }
      {
        isSubmitting &&
          <h3>{challengeName}</h3>
      }
      {
        (submitDone || error) &&
          <Link to={`/challenges/${challengeId}`}>{challengeName}</Link>
      }
      {
        (isSubmitting || submitDone) &&
          <RobotHappy />
      }
      {
        error &&
          <RobotSad />
      }
      {
        isSubmitting && !submitDone &&
          <p styleName="submitting">Submitting...</p>
      }
      {
        isSubmitting &&
          <p>Hey, your work is AWESOME! Please don&#39;t close this window while I&#39;m
            working, you&#39;ll lose all files!
          </p>
      }
      {
        error &&
          <p>Oh, that’s embarrassing! The file couldn’t be
             uploaded, I’m so sorry.
          </p>
      }
      {
        error &&
          <div styleName="error-msg">
            {error}
          </div>
      }
      {
        error &&
          <div styleName="button-container">
            <Button
              onClick={() => reset()}
            >Cancel</Button>
            <PrimaryButton
              onClick={() => retry()}
            >Try Again</PrimaryButton>
          </div>
      }
      {
        submitDone && !error &&
          <p>Thanks for participating! We’ve received your submission and will
            send you an email shortly to confirm and explain what happens next.
          </p>
      }
      {
        submitDone && !error &&
          <div styleName="button-container">
            <Button
              onClick={() => reset()}
            >Add Another Design</Button>
            <PrimaryButton
              to={`/challenges/${challengeId}/my-submissions`}
            >View My Submissions</PrimaryButton>
          </div>
      }
    </div>
  </div>
);

Uploading.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  submitDone: PropTypes.bool.isRequired,
  challengeName: PropTypes.string.isRequired,
  challengeId: PropTypes.number.isRequired,
  reset: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  retry: PropTypes.func.isRequired,
};

export default Uploading;
