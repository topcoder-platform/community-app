import React, { useEffect } from 'react';
import ChallengeHistoryModal from 'components/Leaderboard/ChallengeHistoryModal';
import PT from 'prop-types';
import actions from 'actions/leaderboard';
import { connect } from 'react-redux';

function ChallengeHistoryModalContainer({
  dataUrl,
  challenges,
  competitor,
  getChallengesHistory,
  onCancel,
  loading,
  isCopilot,
  isAlgo,
  themeName,
}) {
  useEffect(() => {
    getChallengesHistory(dataUrl, competitor);
  }, [competitor]);

  return (
    <ChallengeHistoryModal
      onCancel={onCancel}
      challenges={challenges}
      competitor={competitor}
      loading={loading}
      isCopilot={isCopilot}
      isAlgo={isAlgo}
      themeName={themeName}
    />
  );
}

ChallengeHistoryModalContainer.defaultProps = {
  dataUrl: 'http://www.mocky.io/v2/5bbec82f3400006e006fcba6?mocky-delay=5000ms',
  challenges: null,
  loading: false,
  isCopilot: false,
  isAlgo: false,
  themeName: 'Default',
};

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

ChallengeHistoryModalContainer.propTypes = {
  dataUrl: PT.string,
  challenges: CHALLENGES_TYPE,
  competitor: CompetitorShape.isRequired,
  getChallengesHistory: PT.func.isRequired,
  onCancel: PT.func.isRequired,
  loading: PT.bool,
  isAlgo: PT.bool,
  isCopilot: PT.bool,
  themeName: PT.string,
};

function mapStateToProps(state, ownProps) {
  const { challenges, loading } = state.leaderboard[ownProps.dataUrl] || {};
  return {
    challenges: ownProps.challenges || challenges,
    loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getChallengesHistory: (url, competitor) => {
      dispatch(actions.leaderboard.getTcoHistoryChallengesInit(url));
      dispatch(actions.leaderboard.getTcoHistoryChallengesDone(url, competitor));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeHistoryModalContainer);
