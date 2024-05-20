/**
 * ChallengesFeed component
 */
import React from 'react';
import _ from 'lodash';
import PT from 'prop-types';
import ChallengesFeed from 'components/Dashboard/Challenges';
import { connect } from 'react-redux';
import actions from '../../actions/dashboard';

class ChallengesFeedContainer extends React.Component {
  componentDidMount() {
    const {
      getChallenges, challenges, itemCount, tags,
      includeAllTags, projectId, excludeTags, title, tracks,
    } = this.props;

    if (!challenges || challenges.length === 0) {
      getChallenges(
        title,
        _.omitBy({
          page: 1,
          perPage: excludeTags && excludeTags.length ? undefined : itemCount,
          types: ['CH', 'F2F', 'MM'],
          tracks,
          status: 'Active',
          sortBy: 'updated',
          sortOrder: 'desc',
          isLightweight: true,
          currentPhaseName: 'Registration',
          tags: tags && tags.length ? tags : undefined,
          includeAllTags: !!includeAllTags || undefined,
          projectId: projectId || undefined,
        }, _.isUndefined),
      );
    }
  }

  render() {
    const {
      theme, loading, excludeTags, itemCount, title, challengeListingQuery,
    } = this.props;
    let { challenges } = this.props;

    // this is a workaround for excluding challenges by tags
    // there is no API support for this, so we have to do it manually
    // in taht case we load more challenges, not limited to itemCount and filter out by tags
    // default value for perPage is 20 when not specified
    if (excludeTags && excludeTags.length) {
      // filter out by excluded tags
      challenges = challenges.filter(c => !c.tags.some(t => excludeTags.includes(t)));
      // limit to itemCount
      challenges = challenges.slice(0, itemCount);
    }

    return (
      <ChallengesFeed
        challenges={challenges}
        theme={theme}
        loading={loading}
        title={title}
        challengeListingQuery={challengeListingQuery}
      />
    );
  }
}

ChallengesFeedContainer.defaultProps = {
  itemCount: 5,
  challenges: [],
  loading: true,
  theme: 'light',
  tags: [],
  includeAllTags: false,
  projectId: null,
  excludeTags: [],
  title: 'Opportunities',
  challengeListingQuery: undefined,
  tracks: ['DES', 'DEV', 'DS', 'QA'],
};

ChallengesFeedContainer.propTypes = {
  challenges: PT.arrayOf(PT.shape()),
  itemCount: PT.number,
  getChallenges: PT.func.isRequired,
  loading: PT.bool,
  theme: PT.oneOf(['dark', 'light']),
  tags: PT.arrayOf(PT.string),
  includeAllTags: PT.bool,
  projectId: PT.number,
  excludeTags: PT.arrayOf(PT.string),
  title: PT.string,
  challengeListingQuery: PT.shape(),
  tracks: PT.arrayOf(PT.string),
};

function mapStateToProps(state, ownProps) {
  const { dashboard } = state;
  const id = ownProps.title || 'Opportunities';

  if (dashboard[id]) {
    return {
      challenges: dashboard[id].challenges,
      loading: dashboard[id].loading,
    };
  }

  return state;
}

const mapDispatchToProps = dispatch => ({
  getChallenges: (title, query) => {
    const a = actions.dashboard;

    dispatch(a.fetchChallengesInit(title));
    dispatch(a.fetchChallengesDone(title, query));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengesFeedContainer);
