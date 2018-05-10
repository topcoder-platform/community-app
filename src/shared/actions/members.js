/**
 * Actions related to members data.
 */

import { createActions } from 'redux-actions';
import { getService } from 'services/members';
import { getService as getUserService } from 'services/user';

/**
 * Payload creator for the action that drops all loaded information about
 * a member.
 * @param {String} handle
 * @return {String}
 */
function drop(handle) {
  return handle;
}

/**
 * Payload creator for the action that drops all loaded information about
 * members.
 */
function dropAll() {}

/**
 * Payload creator for the action that inits the loading of member achievements.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
function getAchievementsInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that loads member achievements.
 * @param {String} handle
 * @param {String} uuid
 * @return {Promise} Payload.
 */
async function getAchievementsDone(handle, uuid) {
  let data;
  try {
    data = await getUserService().getAchievements(handle);
  } catch (e) {
    data = [];
  }
  return { data, handle, uuid };
}

/**
 * Payload creator for the action that initializes loading of financial
 * information about a member.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
function getFinancesInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that actually loads financial information
 * about a member.
 * @param {String} handle
 * @param {String} uuid
 * @param {String} tokenV3
 * @return {Object} Payload.
 */
async function getFinancesDone(handle, uuid, tokenV3) {
  const data = await getService(tokenV3).getMemberFinances(handle);
  return { data, handle, uuid };
}

/**
 * Payload creator for the action that inits the loading of member stats.
 * @param {String} handle
 * @param {String} uuid
 * @return {Object} Payload.
 */
async function getStatsInit(handle, uuid) {
  return { handle, uuid };
}

/**
 * Payload creator for the action that loads the member stats.
 * @param {String} handle
 * @param {String} uuid
 * @param {String} tokenV3
 * @return {Object} Payload
 */
async function getStatsDone(handle, uuid, tokenV3) {
  // const data = await getService(tokenV3).getStats(handle);
  const data= JSON.parse('{"id":"117674b5:163478e9228:-2acf","result":{"success":true,"status":200,"metadata":null,"content":{"userId":40309246,"handle":"thomaskranitsas","handleLower":"thomaskranitsas","maxRating":{"rating":1526,"track":"DEVELOP","subTrack":"UI_PROTOTYPE_COMPETITION"},"challenges":215,"wins":128,"DEVELOP":{"challenges":211,"wins":127,"subTracks":[{"id":120,"name":"BUG_HUNT","challenges":1,"wins":0,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":1,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"passedReview":1,"reviewSuccessRate":1.0,"appeals":0,"appealSuccessRate":0.0,"maxScore":70.0,"minScore":70.0,"avgScore":70.0,"avgPlacement":5.0,"winPercent":0.0},"mostRecentEventDate":"2016-07-07T05:00:43.000Z","mostRecentSubmission":"2016-07-08T09:29:00.000Z"},{"id":125,"name":"ASSEMBLY_COMPETITION","challenges":1,"wins":0,"rank":{"rating":1108,"activePercentile":0.0,"activeRank":0,"activeCountryRank":0,"activeSchoolRank":0,"overallPercentile":65.5123,"overallRank":239,"overallCountryRank":1,"overallSchoolRank":0,"volatility":385,"reliability":1.0,"maxRating":1108,"minRating":1108},"submissions":{"numInquiries":1,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"passedReview":1,"reviewSuccessRate":1.0,"appeals":3,"appealSuccessRate":0.0,"maxScore":92.04,"minScore":92.04,"avgScore":92.04,"avgPlacement":5.0,"winPercent":0.0},"mostRecentEventDate":"2016-12-24T04:59:58.000Z","mostRecentSubmission":"2016-12-27T10:07:00.000Z"},{"id":130,"name":"UI_PROTOTYPE_COMPETITION","challenges":17,"wins":2,"rank":{"rating":1526,"activePercentile":0.0,"activeRank":0,"activeCountryRank":0,"activeSchoolRank":0,"overallPercentile":92.1225,"overallRank":36,"overallCountryRank":1,"overallSchoolRank":0,"volatility":433,"reliability":0.7333,"maxRating":1608,"minRating":980},"submissions":{"numInquiries":17,"submissions":14,"submissionRate":0.8235294117647058,"passedScreening":14,"screeningSuccessRate":1.0,"passedReview":11,"reviewSuccessRate":0.7857142857142857,"appeals":93,"appealSuccessRate":0.07526881720430108,"maxScore":93.63,"minScore":74.89,"avgScore":83.82083333333334,"avgPlacement":2.4166666666666665,"winPercent":0.14285714285714285},"mostRecentEventDate":"2017-04-26T23:00:01.000Z","mostRecentSubmission":"2017-05-02T21:35:00.000Z"},{"id":149,"name":"FIRST_2_FINISH","challenges":120,"wins":104,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":120,"submissions":117,"submissionRate":0.975,"passedScreening":104,"screeningSuccessRate":0.8888888888888888,"passedReview":104,"reviewSuccessRate":0.8888888888888888,"appeals":0,"appealSuccessRate":0.0,"maxScore":100.0,"minScore":0.0,"avgScore":99.36904761904762,"avgPlacement":1.0,"winPercent":0.8888888888888888},"mostRecentEventDate":"2018-04-03T19:20:01.000Z","mostRecentSubmission":"2018-04-03T19:20:00.000Z"},{"id":150,"name":"CODE","challenges":71,"wins":21,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":71,"submissions":66,"submissionRate":0.9295774647887324,"passedScreening":66,"screeningSuccessRate":1.0,"passedReview":62,"reviewSuccessRate":0.9393939393939394,"appeals":191,"appealSuccessRate":0.13089005235602094,"maxScore":100.0,"minScore":20.0,"avgScore":89.55454545454545,"avgPlacement":2.712121212121212,"winPercent":0.3181818181818182},"mostRecentEventDate":"2018-01-04T04:10:15.000Z","mostRecentSubmission":"2018-01-06T17:02:00.000Z"},{"id":151,"name":"DESIGN_FIRST_2_FINISH","challenges":1,"wins":0,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":1,"submissions":1,"submissionRate":1.0,"passedScreening":0,"screeningSuccessRate":0.0,"passedReview":0,"reviewSuccessRate":0.0,"appeals":0,"appealSuccessRate":0.0,"maxScore":0.0,"minScore":0.0,"avgScore":0.0,"avgPlacement":0.0,"winPercent":0.0},"mostRecentEventDate":"2017-08-01T17:53:51.000Z","mostRecentSubmission":"2017-08-01T17:53:00.000Z"}],"mostRecentEventDate":"2018-04-03T19:20:01.000Z","mostRecentSubmission":"2018-04-03T19:20:00.000Z"},"DESIGN":{"challenges":2,"wins":1,"subTracks":[{"id":20,"name":"LOGO_DESIGN","numInquiries":1,"challenges":1,"wins":0,"winPercent":0.0,"avgPlacement":11.0,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"mostRecentEventDate":"2016-01-13T16:02:25.000Z","mostRecentSubmission":"2016-01-14T11:11:00.000Z"},{"id":40,"name":"DESIGN_FIRST_2_FINISH","numInquiries":1,"challenges":1,"wins":1,"winPercent":1.0,"avgPlacement":1.0,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"mostRecentEventDate":"2017-08-01T17:53:51.000Z","mostRecentSubmission":"2017-08-01T17:53:00.000Z"}],"mostRecentEventDate":"2017-08-01T17:53:51.000Z","mostRecentSubmission":"2017-08-01T17:53:00.000Z"},"DATA_SCIENCE":{"challenges":2,"wins":0,"mostRecentEventName":"SRM 720","mostRecentEventDate":"2017-08-24T00:00:00.000Z","mostRecentSubmission":"2016-04-15T16:14:10.872Z","SRM":{"challenges":2,"wins":0,"rank":{"rating":753,"percentile":0.0,"rank":0,"countryRank":0,"schoolRank":0,"volatility":366.0,"maximumRating":920,"minimumRating":753,"defaultLanguage":"Python","competitions":2},"challengeDetails":[{"levelName":"Level Three","challenges":1,"failedChallenges":1},{"levelName":"Level Two","challenges":2,"failedChallenges":2},{"levelName":"Level One","challenges":0,"failedChallenges":0}],"division1":null,"division2":[{"levelName":"Level One","problemsSubmitted":1,"problemsFailed":0,"problemsSysByTest":0},{"levelName":"Level Three","problemsSubmitted":1,"problemsFailed":1,"problemsSysByTest":0},{"levelName":"Level Two","problemsSubmitted":1,"problemsFailed":1,"problemsSysByTest":0}],"mostRecentEventName":"SRM 720","mostRecentEventDate":"2017-08-24T00:00:00.000Z","mostRecentSubmission":"2016-04-15T16:14:10.872Z"},"MARATHON_MATCH":{"challenges":0,"wins":0,"rank":{"rating":0,"competitions":0,"avgRank":0,"avgNumSubmissions":0,"bestRank":0,"topFiveFinishes":0,"topTenFinishes":0,"rank":0,"percentile":0.0,"volatility":0.0,"minimumRating":0,"maximumRating":0,"countryRank":0,"schoolRank":0,"defaultLanguage":"Python"}}},"COPILOT":{"contests":266,"projects":20,"failures":4,"reposts":0,"activeContests":4,"activeProjects":4,"fulfillment":98.5},"updatedAt":null,"createdAt":null,"createdBy":null,"updatedBy":null}},"version":"v3"}');
  return { data, handle, uuid };
}

export default createActions({
  MEMBERS: {
    DROP: drop,
    DROP_ALL: dropAll,
    GET_ACHIEVEMENTS_INIT: getAchievementsInit,
    GET_ACHIEVEMENTS_DONE: getAchievementsDone,
    GET_FINANCES_INIT: getFinancesInit,
    GET_FINANCES_DONE: getFinancesDone,
    GET_STATS_INIT: getStatsInit,
    GET_STATS_DONE: getStatsDone,
  },
});
