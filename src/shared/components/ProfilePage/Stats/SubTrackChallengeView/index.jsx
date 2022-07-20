/**
 * challenge page.  Displays challenges
 * of a subtrack.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import shortId from 'shortid';

import { actions } from 'topcoder-react-lib';
import LoadingIndicator from 'components/LoadingIndicator';
import ChallengeTable from './ChallengeTable';
import './style.scss';

// how many challenges to query per batch
const CHALLENGE_PER_PAGE = 10;

class SubTrackChallengeView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      // this is current page number. starts with 1.
      // everytime we scroll at the bottom, we query from offset = pageNum * CHALLENGE_PER_PAGE
      pageNum: 1,
    };
  }

  componentDidMount() {
    const {
      handle,
      auth,
      track,
      subTrack,
      loadSubtrackChallenges,
      loadingSRMUUID,
      loadSRM,
      loadingMarathonUUID,
      loadMarathon,
      userId,
      isAlreadyLoadChallenge,
    } = this.props;

    const {
      pageNum,
    } = this.state;

    if (!isAlreadyLoadChallenge.current && (track === 'DEVELOP' || track === 'DESIGN')) {
      loadSubtrackChallenges(
        handle,
        auth.tokenV3,
        track, subTrack,
        pageNum,
        CHALLENGE_PER_PAGE,
        true,
        userId,
      );
      isAlreadyLoadChallenge.current = true;
    } else if (!isAlreadyLoadChallenge.current && track === 'DATA_SCIENCE') {
      if (subTrack === 'SRM') {
        if (!loadingSRMUUID) {
          // pageNum - 1 to match with v4 offset
          loadSRM(handle, auth.tokenV3, pageNum - 1, CHALLENGE_PER_PAGE, true);
          isAlreadyLoadChallenge.current = true;
        }
      } else if (subTrack === 'MARATHON_MATCH') {
        if (!loadingMarathonUUID) {
          loadMarathon(handle, userId, auth.tokenV3, pageNum, CHALLENGE_PER_PAGE, true);
          isAlreadyLoadChallenge.current = true;
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      pageNum,
    } = this.state;

    const {
      handle,
      auth,
      loadSubtrackChallenges,
      loadSRM,
      loadMarathon,
      userId,

      track,
      subTrack,
      challenges,
      challengesHasMore,
      loadingSRMUUID,
      userSrms,
      userSrmHasMore,
      loadingMarathonUUID,
      userMarathons,
      userMarathonHasMore,
    } = this.props;

    const isEqLen = (prevArr, arr) => (prevArr && prevArr.length) === (arr && arr.length);

    if (track === 'DEVELOP' || track === 'DESIGN') {
      if (!isEqLen(prevProps.challenges, challenges)) {
        // NOTE: Loaded successful, nothing todo
        if (challengesHasMore) {
          loadSubtrackChallenges(
            handle,
            auth.tokenV3,
            track,
            subTrack,
            pageNum + 1,
            CHALLENGE_PER_PAGE,
            false,
            userId,
          );
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ pageNum: pageNum + 1 });
        }
      }
    }

    if (track === 'DATA_SCIENCE' && subTrack === 'SRM') {
      if (!loadingSRMUUID) {
        if (!isEqLen(prevProps.userSrms, userSrms)) {
          // NOTE: Loaded successful, nothing todo
          if (userSrmHasMore) {
            loadSRM(handle, auth.tokenV3, pageNum, CHALLENGE_PER_PAGE, false);
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ pageNum: pageNum + 1 });
          }
        }
      }
    }

    if (track === 'DATA_SCIENCE' && subTrack === 'MARATHON_MATCH') {
      if (!loadingMarathonUUID) {
        if (!isEqLen(prevProps.userMarathons, userMarathons)) {
          // NOTE: Loaded successful, nothing todo
          if (userMarathonHasMore) {
            loadMarathon(handle, userId, auth.tokenV3, pageNum + 1, CHALLENGE_PER_PAGE, false);
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ pageNum: pageNum + 1 });
          }
        }
      }
    }
  }

  render() {
    const {
      pageNum,
    } = this.state;

    const {
      track,
      subTrack,
      loadingSubTrackChallengesUUID,
      loadingSRMUUID,
      loadingMarathonUUID,
      challenges,
      userSrms,
      userMarathons,
      handle,
    } = this.props;

    if (pageNum === 1
        && (loadingSubTrackChallengesUUID || loadingSRMUUID || loadingMarathonUUID)) {
      return <LoadingIndicator />;
    }

    if (
      ((track === 'DEVELOP' || track === 'DESIGN') && (!challenges || challenges.length === 0))
      || ((track === 'DATA_SCIENCE' && subTrack === 'SRM') && (!userSrms || userSrms.length === 0))
      || ((track === 'DATA_SCIENCE' && subTrack === 'MARATHON_MATCH')
       && (!userMarathons || userMarathons.length === 0))
    ) {
      return (
        <div styleName={track}>
          <section>
            <div styleName="challenges">
              <div styleName="no-challenges">
                Sorry, no successful challenges found.
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (track === 'DEVELOP' || track === 'DESIGN') {
      //  const challengeToRender = _.map(challenges, processPastChallenge);

      return (
        <React.Fragment>
          <ChallengeTable challenges={challenges} handle={handle} />
          { loadingSubTrackChallengesUUID && <LoadingIndicator /> }
        </React.Fragment>
      );
    } if (track === 'DATA_SCIENCE' && subTrack === 'SRM') {
      userSrms.sort((a, b) => {
        const aDate = a.startDate;
        const bDate = b.startDate;
        if (aDate > bDate) {
          return -1;
        } if (aDate < bDate) {
          return 1;
        }
        return 0;
      });

      return (
        <React.Fragment>
          <ChallengeTable challenges={userSrms} handle={handle} hideChallengeResult />
          { loadingSRMUUID && <LoadingIndicator /> }
        </React.Fragment>
      );
    } if (track === 'DATA_SCIENCE' && subTrack === 'MARATHON_MATCH') {
      const marathonToRender = _.map(
        userMarathons,
        item => ({
          ...item,
          pointTotal: _.get(item, 'rounds.0.userMMDetails.pointTotal'),
        }),
      );

      return (
        <React.Fragment>
          <ChallengeTable challenges={marathonToRender} handle={handle} hideChallengeResult />
          { loadingMarathonUUID && <LoadingIndicator /> }
        </React.Fragment>
      );
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => ({
  handle: ownProps.handle,
  auth: state.auth,
  track: ownProps.track,
  subTrack: ownProps.subTrack,

  challenges: state.members[ownProps.handle]
    ? state.members[ownProps.handle].subtrackChallenges : null,
  challengesHasMore: state.members[ownProps.handle]
    ? state.members[ownProps.handle].subtrackChallengesHasMore : null,
  loadingSubTrackChallengesUUID: state.members[ownProps.handle]
    ? state.members[ownProps.handle].loadingSubTrackChallengesUUID : null,

  loadingSRMUUID: state.members[ownProps.handle]
    ? state.members[ownProps.handle].loadingSRMUUID : null,
  userSrms: state.members[ownProps.handle] ? state.members[ownProps.handle].userSRMs : null,
  userSrmHasMore: state.members[ownProps.handle]
    ? state.members[ownProps.handle].userSRMHasMore : null,

  loadingMarathonUUID: state.members[ownProps.handle]
    ? state.members[ownProps.handle].loadingMarathonUUID : null,
  userMarathons: state.members[ownProps.handle]
    ? state.members[ownProps.handle].userMarathons : null,
  userMarathonHasMore: state.members[ownProps.handle]
    ? state.members[ownProps.handle].userMarathonHasMore : null,

  userId: ownProps.userId,
});

function mapDispatchToProps(dispatch) {
  const action = actions.members;

  return {
    loadSubtrackChallenges: (
      handle,
      tokenV3,
      track,
      subTrack,
      pageNum,
      pageSize,
      refresh,
    ) => {
      const uuid = shortId();
      dispatch(action.getSubtrackChallengesInit(handle, uuid, pageNum));
      dispatch(action.getSubtrackChallengesDone(
        uuid,
        handle,
        tokenV3,
        track,
        subTrack,
        pageNum,
        pageSize,
        refresh,
      ));
    },
    loadSRM: (handle, tokenV3, pageNum, pageSize, refresh) => {
      const uuid = shortId();
      dispatch(action.getUserSrmInit(handle, uuid));
      dispatch(action.getUserSrmDone(uuid, handle, tokenV3, pageNum, pageSize, refresh));
    },
    loadMarathon: (handle, memberId, tokenV3, pageNum, pageSize, refresh) => {
      const uuid = shortId();
      dispatch(action.getUserMarathonInit(handle, uuid));
      dispatch(action.getUserMarathonDone(
        uuid,
        handle,
        memberId,
        tokenV3,
        pageNum,
        pageSize,
        refresh,
      ));
    },
  };
}

SubTrackChallengeView.defaultProps = {
  challenges: null,
  challengesHasMore: null,
  loadingSubTrackChallengesUUID: null,

  userSrms: null,
  loadingSRMUUID: null,
  userSrmHasMore: null,

  loadingMarathonUUID: null,
  userMarathons: null,
  userMarathonHasMore: null,

  isAlreadyLoadChallenge: {
    current: false,
  },
};

SubTrackChallengeView.propTypes = {
  handle: PT.string.isRequired,
  auth: PT.shape().isRequired,
  track: PT.string.isRequired,
  subTrack: PT.string.isRequired,
  userId: PT.number.isRequired,

  challenges: PT.arrayOf(PT.shape()),
  challengesHasMore: PT.bool,
  loadingSubTrackChallengesUUID: PT.string,

  userSrms: PT.arrayOf(PT.shape()),
  loadingSRMUUID: PT.string,
  userSrmHasMore: PT.bool,

  loadingMarathonUUID: PT.string,
  userMarathons: PT.arrayOf(PT.shape()),
  userMarathonHasMore: PT.bool,

  loadSubtrackChallenges: PT.func.isRequired,
  loadSRM: PT.func.isRequired,
  loadMarathon: PT.func.isRequired,
  isAlreadyLoadChallenge: PT.shape({
    current: PT.bool,
  }),
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubTrackChallengeView);

export default Container;
