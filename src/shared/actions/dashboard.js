import { createActions } from 'redux-actions';
import { getService } from '../services/dashboard';

const service = getService();

function fetchChallengesInit(title) {
  return title;
}

async function fetchChallenges(title, query) {
  const challenges = await service.getChallenges(query);

  return {
    challenges,
    title,
  };
}

export default createActions({
  DASHBOARD: {
    FETCH_CHALLENGES_INIT: fetchChallengesInit,
    FETCH_CHALLENGES_DONE: fetchChallenges,
  },
});
