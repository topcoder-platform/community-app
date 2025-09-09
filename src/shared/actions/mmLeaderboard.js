import { redux, config } from 'topcoder-react-utils';
import Service from 'services/mmLeaderboard';
import _ from 'lodash';


/**
 * Fetch init
 */
function getMMLeaderboardInit(id) {
  return { id };
}

/**
 * Fetch done
 */
async function getMMLeaderboardDone(id) {
  const ss = new Service();
  const res = await ss.getMMLeaderboard(id);
  let data = [];
  if (res) {
    const groupedData = _.groupBy(res.subs, 'createdBy');
    _.each(groupedData, (subs, handle) => {
      // filter member subs from reviewIds
      const filteredSubs = _.map(subs, (sub) => {
        // eslint-disable-next-line no-param-reassign
        sub.review = _.filter(sub.review, r => res.reviewIds.indexOf(r.typeId) === -1);
        return sub;
      });
      const sortedSubs = _.orderBy(filteredSubs, ['updated'], ['desc']);
      const scores = _.orderBy(_.compact(sortedSubs[0].review), ['updated'], ['desc']);
      data.push({
        createdBy: handle,
        updated: sortedSubs[0].submittedDate,
        id: sortedSubs[0].id,
        score: scores && scores.length ? scores[0].score : '...',
      });
    });
    data = _.orderBy(data, [d => (Number(d.score) ? Number(d.score) : 0), d => new Date(d.updated) - new Date()], ['desc']).map((r, i) => ({
      ...r,
      rank: i + 1,
      score: r.score % 1 ? Number(r.score).toFixed(5) : r.score,
    }));
    // Fetch member photos and rating for top 10
    const results = await Promise.all(
      _.take(data, 10).map(d => fetch(`${config.API.V6}/members/${d.createdBy}`)),
    );
    const memberData = await Promise.all(results.map(r => r.json()));
    // merge with data
    // eslint-disable-next-line array-callback-return
    memberData.map((member, indx) => {
      data[indx].photoUrl = member.photoURL;
      data[indx].rating = member.maxRating && member.maxRating.rating;
    });
  }
  return {
    id,
    data,
  };
}

export default redux.createActions({
  MMLEADERBOARD: {
    GET_MML_INIT: getMMLeaderboardInit,
    GET_MML_DONE: getMMLeaderboardDone,
  },
});
