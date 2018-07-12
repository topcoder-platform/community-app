/**
 * challenge page.  Displays challenges
 * of a subtrack.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import shortId from 'shortid';

import ChallengeTile from 'components/ChallengeTile';
import SRMTile from 'components/SRMTile';
import { actions } from 'topcoder-react-lib';
import LoadingIndicator from 'components/LoadingIndicator';
import GalleryModal from './GalleryModal';
import './style.scss';

// how many challenges to query per batch
const CHALLENGE_PER_PAGE = 36;

/**
 * @static
 * @desc pre-process subtrach challenge array to prepare for rendering
 * @param {String} one raw challenge just retrieved from API
 */
const processPastChallenge = (challenge) => {
  const cloned = _.cloneDeep(challenge);
  if (cloned.userDetails) {
    // process placement for challenges having winningPlacements array in response
    if (Array.isArray(cloned.userDetails.winningPlacements)) {
      cloned.highestPlacement = _.min(cloned.userDetails.winningPlacements, 'placed').placed;
    }
    // process placement for design challenges
    if (cloned.track === 'DESIGN'
        && cloned.userDetails.submissions
        && cloned.userDetails.submissions.length > 0) {
      cloned.thumbnailId = cloned.userDetails.submissions[0].id;
    }
    // determines the user status for passing the review for one of the submissions
    if (cloned.userDetails.submissions && cloned.userDetails.submissions.length > 0) {
      cloned.passedReview = cloned.userDetails.submissions.filter(submission => submission.type === 'Contest Submission'
        && (submission.status === 'Active'
          || submission.status === 'Completed Without Win')).length > 0;
    }
    if (cloned.highestPlacement === 0) {
      cloned.highestPlacement = null;
    }
    cloned.wonFirst = cloned.highestPlacement === 1;

    cloned.userHasSubmitterRole = false;

    // determines if user has submitter role or not
    const { roles } = cloned.userDetails;
    if (roles.length > 0) {
      const submitterRole = _.findIndex(roles, (role) => {
        const lRole = role.toLowerCase();
        return lRole === 'submitter';
      });
      if (submitterRole >= 0) {
        cloned.userHasSubmitterRole = true;
      }
    }

    if (!cloned.userStatus) {
      if (cloned.userDetails.hasUserSubmittedForReview) {
        if (!cloned.passedReview) {
          cloned.userStatus = 'PASSED_SCREENING';
        } else {
          cloned.userStatus = 'PASSED_REVIEW';
        }
      } else {
        cloned.userStatus = 'NOT_FINISHED';
      }

      // if user does not has submitter role, just show Completed
      if (!cloned.userHasSubmitterRole) {
        cloned.userStatus = 'COMPLETED';
      }
    }

    // adjust submissions
    if (cloned.userDetails
        && cloned.userDetails.submissions
        && cloned.userDetails.submissions.length > 0) {
      cloned.userDetails.submissions = cloned.userDetails.submissions
        .filter(submission => submission && submission.submissionImage);
      cloned.userDetails.submissions = _.sortBy(
        cloned.userDetails.submissions,
        submission => submission.placement,
      );
    }

    if (!cloned.isPrivate
        && cloned.userDetails
        && cloned.userDetails.submissions
        && cloned.userDetails.submissions.length > 0) {
      // add attr imageURL
      cloned.imageURL = cloned.userDetails.submissions[0].submissionImage
                        && cloned.userDetails.submissions[0].submissionImage.full;
      // add numImages
      cloned.numImages = cloned.userDetails.submissions.length;
    } else {
      cloned.numImages = 0;
    }
  }
  return cloned;
};

class SubTrackChallengeView extends React.Component {
  constructor(props, context) {
    super(props, context);
    // this is current page number. starts with 0.
    // everytime we scroll at the bottom, we query from offset = pageNum * CHALLENGE_PER_PAGE
    this.state = {
      // this is current page number. starts with 0.
      // everytime we scroll at the bottom, we query from offset = pageNum * CHALLENGE_PER_PAGE
      pageNum: 0,
      // which challenge's modal should be poped. null means no modal
      challengeIndexToPopModal: null,
    };
    this.onPageChange = this.onPageChange.bind(this);
    this.onPopModal = this.onPopModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  componentDidMount() {
    const {
      handle,
      auth,
      track,
      subTrack,
      loadingSubTrackChallengesUUID,
      loadSubtrackChallenges,
      loadingSRMUUID,
      loadSRM,
      loadingMarathonUUID,
      loadMarathon,
    } = this.props;

    if (track === 'DEVELOP' || track === 'DESIGN') {
      if (!loadingSubTrackChallengesUUID) {
        loadSubtrackChallenges(handle, auth.tokenV3, track, subTrack, 0, CHALLENGE_PER_PAGE, true);
      }
    } else if (track === 'DATA_SCIENCE') {
      if (subTrack === 'SRM') {
        if (!loadingSRMUUID) {
          loadSRM(handle, auth.tokenV3, 0, CHALLENGE_PER_PAGE, true);
        }
      } else if (subTrack === 'MARATHON_MATCH') {
        if (!loadingMarathonUUID) {
          loadMarathon(handle, auth.tokenV3, 0, CHALLENGE_PER_PAGE, true);
        }
      }
    }
  }

  onPageChange() {
    const {
      handle,
      auth,
      track,
      subTrack,
      loadingSubTrackChallengesUUID,
      loadSubtrackChallenges,
      loadingSRMUUID,
      loadSRM,
      loadingMarathonUUID,
      loadMarathon,
    } = this.props;

    const {
      pageNum,
    } = this.state;

    if ((track === 'DEVELOP' || track === 'DESIGN')) {
      if (!loadingSubTrackChallengesUUID) {
        loadSubtrackChallenges(
          handle,
          auth.tokenV3,
          track,
          subTrack,
          pageNum + 1,
          CHALLENGE_PER_PAGE,
          false,
        );
        this.setState({ pageNum: pageNum + 1 });
      }
      // if loadingSubTrackChallengesUUID is set in redux-store,
      // it means there is already an ongoing query
      // same to SRM and Marathon
    } else if (track === 'DATA_SCIENCE') {
      if (subTrack === 'SRM') {
        if (!loadingSRMUUID) {
          loadSRM(handle, auth.tokenV3, pageNum + 1, CHALLENGE_PER_PAGE, false);
          this.setState({ pageNum: pageNum + 1 });
        }
      } else if (subTrack === 'MARATHON_MATCH') {
        if (!loadingMarathonUUID) {
          loadMarathon(handle, auth.tokenV3, pageNum + 1, CHALLENGE_PER_PAGE, false);
          this.setState({ pageNum: pageNum + 1 });
        }
      }
    }
  }

  onPopModal(index) {
    this.setState({ challengeIndexToPopModal: index });
  }

  onCloseModal() {
    this.setState({ challengeIndexToPopModal: null });
  }

  render() {
    const {
      pageNum,
      challengeIndexToPopModal,
    } = this.state;

    const {
      track,
      subTrack,
      loadingSubTrackChallengesUUID,
      loadingSRMUUID,
      loadingMarathonUUID,
      challenges,
      challengesHasMore,
      userSrms,
      userSrmHasMore,
      userMarathons,
      userMarathonHasMore,
      userId,
    } = this.props;

    if (pageNum === 0
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
      const challengeToRender = _.map(challenges, processPastChallenge);

      return (
        <div>
          {challengeIndexToPopModal != null
          && (
          <div>
            <GalleryModal
              onCancel={this.onCloseModal}
              challenge={challengeToRender[challengeIndexToPopModal]}
            />
          </div>
          )
            }
          <InfiniteScroll
            initialLoad={false}
            loadMore={this.onPageChange}
            hasMore={!loadingSubTrackChallengesUUID && challengesHasMore}
            loader={<LoadingIndicator key="challenge-loader" />}
            threshold={500}
          >
            <div styleName={track}>
              <section>
                <div styleName="challenges">
                  {challengeToRender.map((item, index) => (
                    <ChallengeTile
                      challenge={item}
                      onPopModal={this.onPopModal}
                      index={index}
                      key={`scroll-subtrack-challenge-${item.name}`}
                    />))}
                </div>
              </section>
            </div>
          </InfiniteScroll>
          {loadingSubTrackChallengesUUID && <LoadingIndicator />}
        </div>
      );
    } if (track === 'DATA_SCIENCE' && subTrack === 'SRM') {
      userSrms.sort((a, b) => {
        const aHasFP = a.rounds[0];
        const bHasFP = b.rounds[0];
        if (
          (a.rounds[0].userSRMDetails
           && a.rounds[0].userSRMDetails.finalPoints)
            && (b.rounds[0].userSRMDetails
           && b.rounds[0].userSRMDetails.finalPoints)
        ) {
          // sort descending
          return b.rounds[0].userSRMDetails.finalPoints - a.rounds[0].userSRMDetails.finalPoints;
        } if (bHasFP) {
          // if b has FP, b should go first
          return 1;
        } if (aHasFP) {
          return -1;
        }
        return 0;
      });

      return (
        <div>
          <InfiniteScroll
            initialLoad={false}
            loadMore={this.onPageChange}
            hasMore={!loadingSRMUUID && userSrmHasMore}
            loader={<LoadingIndicator key="srm-loader" />}
            threshold={500}
          >
            <div styleName={track}>
              <section>
                <div styleName="challenges">
                  {userSrms.map(item => <SRMTile key={`srm-${item.name}`} challenge={item} userId={userId} />)
                  }
                </div>
              </section>
            </div>
          </InfiniteScroll>
          {loadingSRMUUID && <LoadingIndicator />}
        </div>
      );
    } if (track === 'DATA_SCIENCE' && subTrack === 'MARATHON_MATCH') {
      const marathonToRender = _.map(
        userMarathons,
        item => ({
          ...item,
          submissionEndDate: _.get(item, 'rounds.0.systemTestEndAt'),
          pointTotal: _.get(item, 'rounds.0.userMMDetails.pointTotal'),
        }),
      );
      return (
        <div>
          <InfiniteScroll
            initialLoad={false}
            loadMore={this.onPageChange}
            hasMore={!loadingMarathonUUID && userMarathonHasMore}
            loader={<LoadingIndicator key="marathon-loader" />}
            threshold={500}
          >
            <div styleName={track}>
              <section>
                <div styleName="challenges">
                  {marathonToRender.map(item => <ChallengeTile key={`marathon-${item.name}`} challenge={item} />)
                  }
                </div>
              </section>
            </div>
          </InfiniteScroll>
          {loadingMarathonUUID && <LoadingIndicator />}
        </div>
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
    loadSubtrackChallenges: (handle, tokenV3, track, subTrack, pageNum, pageSize, refresh) => {
      const uuid = shortId();
      dispatch(action.getSubtrackChallengesInit(handle, uuid));
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
    loadMarathon: (handle, tokenV3, pageNum, pageSize, refresh) => {
      const uuid = shortId();
      dispatch(action.getUserMarathonInit(handle, uuid));
      dispatch(action.getUserMarathonDone(uuid, handle, tokenV3, pageNum, pageSize, refresh));
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
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubTrackChallengeView);

export default Container;
