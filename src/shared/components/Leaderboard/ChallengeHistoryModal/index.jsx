import React from 'react';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { config } from 'topcoder-react-utils';
import theme from './styles.scss';
import PodiumSpot from '../PodiumSpot';


function ChallengeHistoryModal({
  challenges,
  competitor,
  onCancel,
  loading,
  isCopilot,
  isAlgo,
}) {
  return (
    <Modal onCancel={onCancel} theme={theme}>
      <h1>
Completed Challenges History
      </h1>
      <div styleName="podium-spot-wrapper">
        <PodiumSpot
          competitor={competitor}
          isCopilot={isCopilot}
          isAlgo={isAlgo}
        />
      </div>
      <div styleName="head">
        <div styleName="col-1">
Challenge Name
        </div>
        {
          !isCopilot ? (
            <div styleName="col-2">Placement</div>
          ) : null
        }
        <div styleName="col-3">
TCO Points
        </div>
      </div>
      <div styleName="body">
        {
          challenges.map(challenge => (
            <div styleName="row" key={`${challenge.challenge_id}`}>
              <div styleName="col-1">
                <a href={`${config.URL.BASE}/challenges/${challenge.challenge_id}/`} styleName="link" target="_blank" rel="noopener noreferrer">
                  {challenge.challenge_name || challenge.challenge_id}
                </a>
              </div>
              {
                !isCopilot ? (
                  <div styleName="col-2">{challenge.place}</div>
                ) : null
              }
              <div styleName="col-3">
                {challenge.points}
              </div>
            </div>
          ))
        }
      </div>
      {
        loading ? <LoadingIndicator /> : null
      }
      <div styleName="buttons">
        <PrimaryButton onClick={onCancel}>
Close
        </PrimaryButton>
      </div>
    </Modal>
  );
}

const CHALLENGES_TYPE = PT.arrayOf(PT.shape({
  challenge_name: PT.string.isRequired,
  place: PT.number,
  points: PT.number.isRequired,
}));

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatar: PT.string,
  handle: PT.string.isRequired,
  challengecount: PT.number.isRequired,
  points: PT.number.isRequired,
});

ChallengeHistoryModal.defaultProps = {
  isCopilot: false,
  isAlgo: false,
};

ChallengeHistoryModal.propTypes = {
  challenges: CHALLENGES_TYPE.isRequired,
  competitor: CompetitorShape.isRequired,
  onCancel: PT.func.isRequired,
  loading: PT.bool.isRequired,
  isAlgo: PT.bool,
  isCopilot: PT.bool,
};

export default ChallengeHistoryModal;
