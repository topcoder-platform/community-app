/**
 * A block that fetches (if necessary) and renders a few cards with active
 * challenges. It originates from Veterans community's Home page. Spawned
 * to a separate component, to expose it to Contentful. Should be further
 * enhanced for usability in other places.
 */
import _ from 'lodash';
import { actions, challenge as challengeUtil } from 'topcoder-react-lib';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import ChallengesBlock from 'components/ChallengesBlock';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';
import { connect } from 'react-redux';


const { BUCKETS } = challengeUtil.buckets;

/* Holds cache time [ms] for the data demanded by this container. */
const MAXAGE = 30 * 60 * 1000;

class ChallengesBlockContiner extends React.Component {
  componentDidMount() {
    const {
      getAllActiveChallenges,
      lastUpdateOfActiveChallenges,
      loadingActiveChallenges,
      tokenV3,
    } = this.props;
    if (Date.now() - lastUpdateOfActiveChallenges > MAXAGE
      && !loadingActiveChallenges) getAllActiveChallenges(tokenV3);
  }

  render() {
    const {
      baseUrl,
      challenges,
      loadingActiveChallenges,
      setChallengeListingFilter,
    } = this.props;

    const activeChallenges = challenges.filter(x => x.status === 'ACTIVE')
      .sort((a, b) => moment(b.registrationStartDate).diff(a.registrationStartDate));

    if (loadingActiveChallenges && (
      !activeChallenges || !activeChallenges.length
    )) {
      return <LoadingIndicator />;
    }

    return (
      <ChallengesBlock
        challenges={activeChallenges}
        baseUrl={baseUrl}
        loadingActiveChallenges={loadingActiveChallenges}
        setChallengeListingFilter={setChallengeListingFilter}
      />
    );
  }
}

ChallengesBlockContiner.defaultProps = {
  tokenV3: null,
};

ChallengesBlockContiner.propTypes = {
  baseUrl: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  getAllActiveChallenges: PT.func.isRequired,
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingActiveChallenges: PT.bool.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  tokenV3: PT.string,
};

function mapStateToProps(state) {
  return {
    challenges: !_.isEmpty(state.challengeListing.challenges[BUCKETS.ALL])
      ? state.challengeListing.challenges[BUCKETS.ALL] : [],
    lastUpdateOfActiveChallenges:
    state.challengeListing.lastUpdateOfActiveChallenges,
    loadingActiveChallenges:
      Boolean(state.challengeListing.loadingActiveChallengesUUID),
    tokenV3: state.auth.tokenV3,
  };
}

function mapDispatchToActions(dispatch) {
  const cla = actions.challengeListing;
  const clsa = challengeListingSidebarActions.challengeListingFrontend.sidebar;
  return {
    getAllActiveChallenges: (tokenV3) => {
      const uuid = shortId();
      dispatch(cla.getAllActiveChallengesInit(uuid));
      dispatch(cla.getAllActiveChallengesDone(uuid, tokenV3));
    },
    setChallengeListingFilter: (filter) => {
      dispatch(cla.setFilter(filter));
      dispatch(clsa.selectBucket(BUCKETS.ALL));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(ChallengesBlockContiner);
