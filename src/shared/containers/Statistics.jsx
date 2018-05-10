/**
 * Connects the Redux store to the Profile display components.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import actions from 'actions/profile';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import StatisticsPage from 'components/StatisticsPage';
import queryString from 'query-string';

var parsed = {}
var track = ""
var subTrack = ""
var tab = ""

class StatisticsContainer extends React.Component {
  componentDidMount() {
    const {
      handleParam,
      profileForHandle,
      loadProfile,
    } = this.props;

    if (handleParam !== profileForHandle) {
      loadProfile(handleParam);
    }
    parsed = queryString.parse(this.props.location.search);
    console.log("parsed: ", parsed)
    console.log("COPILOT: ")
    track = parsed.track
    subTrack = parsed.subTrack
    tab = parsed.tab
  }

  componentWillReceiveProps(nextProps) {
    const {
      handleParam,
      profileForHandle,
      loadProfile,
    } = nextProps;

    if (handleParam !== profileForHandle) {
      loadProfile(handleParam);
    }
  }

  render() {
    const {
      achievements,
      info,
      loadingError,
      skills,
      stats,
    } = this.props;

    if (loadingError) {
      return <Error404 />;
    }
    console.log("stats: ", stats)
    return achievements && info && skills && stats ?
      <StatisticsPage
          track={track}
          subTrack={subTrack}
          tab={tab}
          {...this.props}
      /> : <LoadingIndicator />;
  }
}

StatisticsContainer.defaultProps = {
  achievements: null,
  copilot: false,
  country: '',
  externalAccounts: null,
  externalLinks: null,
  info: null,
  profileForHandle: '',
  skills: null,
  stats: null,
};

StatisticsContainer.propTypes = {
  achievements: PT.arrayOf(PT.shape()),
  copilot: PT.bool,
  country: PT.string,
  externalAccounts: PT.shape(),
  externalLinks: PT.arrayOf(PT.shape()),
  handleParam: PT.string,
  info: PT.shape(),
  loadingError: PT.bool,
  loadProfile: PT.func,
  profileForHandle: PT.string,
  skills: PT.shape(),
  stats: PT.shape(),
  skillsHistory: PT.shape(),
};

const dummyStats = {"id":"117674b5:163478e9228:-2acf","result":{"success":true,"status":200,"metadata":null,"content":{"userId":40309246,"handle":"thomaskranitsas","handleLower":"thomaskranitsas","maxRating":{"rating":1526,"track":"DEVELOP","subTrack":"UI_PROTOTYPE_COMPETITION"},"challenges":215,"wins":128,"DEVELOP":{"challenges":211,"wins":127,"subTracks":[{"id":120,"name":"BUG_HUNT","challenges":1,"wins":0,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":1,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"passedReview":1,"reviewSuccessRate":1.0,"appeals":0,"appealSuccessRate":0.0,"maxScore":70.0,"minScore":70.0,"avgScore":70.0,"avgPlacement":5.0,"winPercent":0.0},"mostRecentEventDate":"2016-07-07T05:00:43.000Z","mostRecentSubmission":"2016-07-08T09:29:00.000Z"},{"id":125,"name":"ASSEMBLY_COMPETITION","challenges":1,"wins":0,"rank":{"rating":1108,"activePercentile":0.0,"activeRank":0,"activeCountryRank":0,"activeSchoolRank":0,"overallPercentile":65.5123,"overallRank":239,"overallCountryRank":1,"overallSchoolRank":0,"volatility":385,"reliability":1.0,"maxRating":1108,"minRating":1108},"submissions":{"numInquiries":1,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"passedReview":1,"reviewSuccessRate":1.0,"appeals":3,"appealSuccessRate":0.0,"maxScore":92.04,"minScore":92.04,"avgScore":92.04,"avgPlacement":5.0,"winPercent":0.0},"mostRecentEventDate":"2016-12-24T04:59:58.000Z","mostRecentSubmission":"2016-12-27T10:07:00.000Z"},{"id":130,"name":"UI_PROTOTYPE_COMPETITION","challenges":17,"wins":2,"rank":{"rating":1526,"activePercentile":0.0,"activeRank":0,"activeCountryRank":0,"activeSchoolRank":0,"overallPercentile":92.1225,"overallRank":36,"overallCountryRank":1,"overallSchoolRank":0,"volatility":433,"reliability":0.7333,"maxRating":1608,"minRating":980},"submissions":{"numInquiries":17,"submissions":14,"submissionRate":0.8235294117647058,"passedScreening":14,"screeningSuccessRate":1.0,"passedReview":11,"reviewSuccessRate":0.7857142857142857,"appeals":93,"appealSuccessRate":0.07526881720430108,"maxScore":93.63,"minScore":74.89,"avgScore":83.82083333333334,"avgPlacement":2.4166666666666665,"winPercent":0.14285714285714285},"mostRecentEventDate":"2017-04-26T23:00:01.000Z","mostRecentSubmission":"2017-05-02T21:35:00.000Z"},{"id":149,"name":"FIRST_2_FINISH","challenges":120,"wins":104,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":120,"submissions":117,"submissionRate":0.975,"passedScreening":104,"screeningSuccessRate":0.8888888888888888,"passedReview":104,"reviewSuccessRate":0.8888888888888888,"appeals":0,"appealSuccessRate":0.0,"maxScore":100.0,"minScore":0.0,"avgScore":99.36904761904762,"avgPlacement":1.0,"winPercent":0.8888888888888888},"mostRecentEventDate":"2018-04-03T19:20:01.000Z","mostRecentSubmission":"2018-04-03T19:20:00.000Z"},{"id":150,"name":"CODE","challenges":71,"wins":21,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":71,"submissions":66,"submissionRate":0.9295774647887324,"passedScreening":66,"screeningSuccessRate":1.0,"passedReview":62,"reviewSuccessRate":0.9393939393939394,"appeals":191,"appealSuccessRate":0.13089005235602094,"maxScore":100.0,"minScore":20.0,"avgScore":89.55454545454545,"avgPlacement":2.712121212121212,"winPercent":0.3181818181818182},"mostRecentEventDate":"2018-01-04T04:10:15.000Z","mostRecentSubmission":"2018-01-06T17:02:00.000Z"},{"id":151,"name":"DESIGN_FIRST_2_FINISH","challenges":1,"wins":0,"rank":{"rating":null,"activePercentile":null,"activeRank":null,"activeCountryRank":null,"activeSchoolRank":null,"overallPercentile":null,"overallRank":null,"overallCountryRank":null,"overallSchoolRank":null,"volatility":null,"reliability":null,"maxRating":null,"minRating":null},"submissions":{"numInquiries":1,"submissions":1,"submissionRate":1.0,"passedScreening":0,"screeningSuccessRate":0.0,"passedReview":0,"reviewSuccessRate":0.0,"appeals":0,"appealSuccessRate":0.0,"maxScore":0.0,"minScore":0.0,"avgScore":0.0,"avgPlacement":0.0,"winPercent":0.0},"mostRecentEventDate":"2017-08-01T17:53:51.000Z","mostRecentSubmission":"2017-08-01T17:53:00.000Z"}],"mostRecentEventDate":"2018-04-03T19:20:01.000Z","mostRecentSubmission":"2018-04-03T19:20:00.000Z"},"DESIGN":{"challenges":2,"wins":1,"subTracks":[{"id":20,"name":"LOGO_DESIGN","numInquiries":1,"challenges":1,"wins":0,"winPercent":0.0,"avgPlacement":11.0,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"mostRecentEventDate":"2016-01-13T16:02:25.000Z","mostRecentSubmission":"2016-01-14T11:11:00.000Z"},{"id":40,"name":"DESIGN_FIRST_2_FINISH","numInquiries":1,"challenges":1,"wins":1,"winPercent":1.0,"avgPlacement":1.0,"submissions":1,"submissionRate":1.0,"passedScreening":1,"screeningSuccessRate":1.0,"mostRecentEventDate":"2017-08-01T17:53:51.000Z","mostRecentSubmission":"2017-08-01T17:53:00.000Z"}],"mostRecentEventDate":"2017-08-01T17:53:51.000Z","mostRecentSubmission":"2017-08-01T17:53:00.000Z"},"DATA_SCIENCE":{"challenges":2,"wins":0,"mostRecentEventName":"SRM 720","mostRecentEventDate":"2017-08-24T00:00:00.000Z","mostRecentSubmission":"2016-04-15T16:14:10.872Z","SRM":{"challenges":2,"wins":0,"rank":{"rating":753,"percentile":0.0,"rank":0,"countryRank":0,"schoolRank":0,"volatility":366.0,"maximumRating":920,"minimumRating":753,"defaultLanguage":"Python","competitions":2},"challengeDetails":[{"levelName":"Level Three","challenges":1,"failedChallenges":1},{"levelName":"Level Two","challenges":2,"failedChallenges":2},{"levelName":"Level One","challenges":0,"failedChallenges":0}],"division1":null,"division2":[{"levelName":"Level One","problemsSubmitted":1,"problemsFailed":0,"problemsSysByTest":0},{"levelName":"Level Three","problemsSubmitted":1,"problemsFailed":1,"problemsSysByTest":0},{"levelName":"Level Two","problemsSubmitted":1,"problemsFailed":1,"problemsSysByTest":0}],"mostRecentEventName":"SRM 720","mostRecentEventDate":"2017-08-24T00:00:00.000Z","mostRecentSubmission":"2016-04-15T16:14:10.872Z"},"MARATHON_MATCH":{"challenges":0,"wins":0,"rank":{"rating":0,"competitions":0,"avgRank":0,"avgNumSubmissions":0,"bestRank":0,"topFiveFinishes":0,"topTenFinishes":0,"rank":0,"percentile":0.0,"volatility":0.0,"minimumRating":0,"maximumRating":0,"countryRank":0,"schoolRank":0,"defaultLanguage":"Python"}}},"COPILOT":{"contests":266,"projects":20,"failures":4,"reposts":0,"activeContests":4,"activeProjects":4,"fulfillment":98.5},"updatedAt":null,"createdAt":null,"createdBy":null,"updatedBy":null}},"version":"v3"}

const dummyStatsHistory =
{"id":"-34f74681:1634797d124:942","result":{"success":true,"status":200,"metadata":null,"content":{"userId":40309246,"handle":"thomaskranitsas","handleLower":"thomaskranitsas","DEVELOP":{"subTracks":[{"id":125,"name":"ASSEMBLY_COMPETITION","history":[{"challengeId":30056024,"challengeName":"Living Progress - Build - POL - Fix Defects","ratingDate":"2016-12-28T04:59:00.000Z","newRating":1108}]},{"id":130,"name":"UI_PROTOTYPE_COMPETITION","history":[{"challengeId":30052548,"challengeName":"John Hancock  - Office 365 Signature Add In UI Prototype Challenge","ratingDate":"2016-01-01T09:00:00.000Z","newRating":980},{"challengeId":30052585,"challengeName":"Dinnaco Car Tax UI Prototype","ratingDate":"2016-02-06T09:00:00.000Z","newRating":1030},{"challengeId":30053173,"challengeName":"Pillar to Post - Quote Tool Responsive UI Prototype Challenge","ratingDate":"2016-03-09T13:30:00.000Z","newRating":1001},{"challengeId":30053255,"challengeName":"Appirio 50/50 Responsive Landing Page UI Prototype Challenge","ratingDate":"2016-03-20T03:33:00.000Z","newRating":1169},{"challengeId":30053726,"challengeName":"Hercules Release Note UI Prototype Challenge","ratingDate":"2016-04-12T19:02:00.000Z","newRating":1272},{"challengeId":30053765,"challengeName":"Hercules Release Note UI Design V2 Prototype Update Challenge","ratingDate":"2016-04-19T01:17:00.000Z","newRating":1390},{"challengeId":30053791,"challengeName":"IBM Castle - Preferences UI Prototype Challenge","ratingDate":"2016-04-23T06:01:00.000Z","newRating":1430},{"challengeId":30054179,"challengeName":"Eager Properties Responsive HTML5 UI Prototype Challenge","ratingDate":"2016-05-19T13:07:00.000Z","newRating":1385},{"challengeId":30055134,"challengeName":"GE Brilliant Career - SASS it Up!","ratingDate":"2016-09-08T09:58:00.000Z","newRating":1473},{"challengeId":30055738,"challengeName":"NASA PAM - Web Application  Prototype","ratingDate":"2017-02-05T05:29:00.000Z","newRating":1405},{"challengeId":30056965,"challengeName":"Hubs - Responsive Engagement Site ReactJS UI Prototype Challenge","ratingDate":"2017-04-04T09:02:00.000Z","newRating":1608},{"challengeId":30057452,"challengeName":"AutoGuys Responsive Updates UI Prototype Challenge 4","ratingDate":"2017-05-02T23:05:00.000Z","newRating":1526}]}]},"DATA_SCIENCE":{"SRM":{"history":[{"challengeId":16957,"challengeName":"SRM 720","date":"2017-08-24T00:00:00.000Z","rating":753.0,"placement":3249,"percentile":13.8882},{"challengeId":16709,"challengeName":"SRM 688","date":"2016-04-15T00:00:00.000Z","rating":920.0,"placement":3567,"percentile":37.3771}]},"MARATHON_MATCH":{"history":[]}},"updatedAt":null,"createdAt":null,"createdBy":null,"updatedBy":null}},"version":"v3"}

const mapStateToProps = (state, ownProps) => ({
  achievements: state.profile.achievements,
  copilot: state.profile.copilot,
  country: state.profile.country,
  externalAccounts: state.profile.externalAccounts,
  externalLinks: state.profile.externalLinks,
  handleParam: ownProps.match.params.handle,
  info: state.profile.info,
  loadingError: state.profile.loadingError,
  profileForHandle: state.profile.profileForHandle,
  skills: state.profile.skills,
  stats: dummyStats.result.content,
  statsHistory: dummyStatsHistory.result.content,
});

function mapDispatchToProps(dispatch) {
  const a = actions.profile;
  console.log("actions.profile: ", a.getStatsHistoryDone());
  return {
    loadProfile: (handle) => {
      dispatch(a.loadProfile(handle));
      dispatch(a.getAchievementsInit());
      dispatch(a.getExternalAccountsInit());
      dispatch(a.getExternalLinksInit());
      dispatch(a.getInfoInit());
      dispatch(a.getSkillsInit());
      dispatch(a.getStatsInit());
      dispatch(a.getAchievementsDone(handle));
      dispatch(a.getExternalAccountsDone(handle));
      dispatch(a.getExternalLinksDone(handle));
      dispatch(a.getInfoDone(handle));
      dispatch(a.getSkillsDone(handle));
      dispatch(a.getStatsDone(handle));
      dispatch(a.getStatsHistoryDone(handle));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatisticsContainer);

export default Container;
