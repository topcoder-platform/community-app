import _ from 'lodash';
import challengeListingActions from 'actions/challenge-listing';
import communityActions from 'actions/tc-communities';
import Home from 'components/tc-communities/communities/cognitive/Home';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import resourcesActions from 'actions/page/communities/cognitive/resources';
import shortId from 'shortid';
import { USER_GROUP_MAXAGE } from 'config';
import { updateChallengeType } from 'utils/challenge';

import { connect } from 'react-redux';
import { challenge as challengeUtils } from 'topcoder-react-lib';

/* Holds cache time [ms] for the data demanded by this container. */
const MAXAGE = 30 * 60 * 1000;

const Filter = challengeUtils.filter;

class HomeContainer extends React.Component {
  componentDidMount() {
    const {
      activeChallengesTimestamp,
      auth,
      communitiesList,
      getAllActiveChallenges,
      getCommunitiesList,
      loadingActiveChallenges,
    } = this.props;
    if (Date.now() - activeChallengesTimestamp > MAXAGE
    && !loadingActiveChallenges) {
      getAllActiveChallenges(auth.tokenV3);
    }
    if (Date.now() - communitiesList.timestamp > USER_GROUP_MAXAGE
    && !communitiesList.loadingUuid) {
      getCommunitiesList(auth);
    }
  }

  render() {
    const {
      activeChallenges,
      allFaqItemsClosedInResourcesPage,
      baseUrl,
      closeAllFaqItemsInResourcesPage,
      communitiesList,
      member,
      toggleFaqItemInResourcesPage,
    } = this.props;

    let challenges;
    let filter = communitiesList.data.find(x => x.communityId === 'cognitive');
    if (filter) {
      filter = Filter.getFilterFunction(filter.challengeFilter);
      challenges = activeChallenges
        .filter(x => x.status === 'ACTIVE')
        .filter(filter)
        .sort((a, b) => moment(a.registrationStartDate).diff(b.registrationStartDate));
    }

    return (
      <Home
        allFaqItemsClosedInResourcesPage={allFaqItemsClosedInResourcesPage}
        baseUrl={baseUrl}
        challenges={challenges}
        closeAllFaqItemsInResourcesPage={closeAllFaqItemsInResourcesPage}
        member={member}
        toggleFaqItemInResourcesPage={toggleFaqItemInResourcesPage}
      />
    );
  }
}

HomeContainer.propTypes = {
  activeChallenges: PT.arrayOf(PT.shape({
    registrationStartDate: PT.string.isRequired,
    status: PT.string.isRequired,
  })).isRequired,
  activeChallengesTimestamp: PT.number.isRequired,
  auth: PT.shape({
    tokenV3: PT.string,
  }).isRequired,
  allFaqItemsClosedInResourcesPage: PT.bool.isRequired,
  baseUrl: PT.string.isRequired,
  closeAllFaqItemsInResourcesPage: PT.func.isRequired,
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.object).isRequired,
    timestamp: PT.number.isRequired,
    loadingUuid: PT.any,
  }).isRequired,
  getAllActiveChallenges: PT.func.isRequired,
  getCommunitiesList: PT.func.isRequired,
  loadingActiveChallenges: PT.bool.isRequired,
  member: PT.bool.isRequired,
  toggleFaqItemInResourcesPage: PT.func.isRequired,
};

function mapStateToProps(state) {
  updateChallengeType(
    state.challengeListing.challenges, state.challengeListing.challengeTypesMap,
  );
  return {
    auth: state.auth,
    activeChallenges: state.challengeListing.challenges,
    activeChallengesTimestamp:
      state.challengeListing.lastUpdateOfActiveChallenges,
    allFaqItemsClosedInResourcesPage:
      _.isEmpty(state.page.communities.cognitive.resources.shownFaqItems),
    communitiesList: state.tcCommunities.list,
    loadingActiveChallenges:
      Boolean(state.challengeListing.loadingActiveChallengesUUID),
  };
}

function mapDispatchToActions(dispatch) {
  const ca = communityActions.tcCommunity;
  const cla = challengeListingActions.challengeListing;
  const ra = resourcesActions.page.communities.cognitive.resources;
  return {
    closeAllFaqItemsInResourcesPage: () => dispatch(ra.closeAllFaqItems()),
    getAllActiveChallenges: (tokenV3) => {
      const uuid = shortId();
      dispatch(cla.getAllActiveChallengesInit(uuid));
      dispatch(cla.getAllActiveChallengesDone(uuid, tokenV3));
    },
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    toggleFaqItemInResourcesPage:
      (index, show) => dispatch(ra.toggleFaqItem(index, show)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(HomeContainer);
