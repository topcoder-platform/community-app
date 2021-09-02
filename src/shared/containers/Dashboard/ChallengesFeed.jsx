import React from 'react';
import PT from 'prop-types';
import ChallengesFeed from 'components/Dashboard/Challenges';

import { config } from 'topcoder-react-utils';
import { connect } from 'react-redux';

import actions from '../../actions/dashboard';

class ChallengesFeedContainer extends React.Component {
  componentDidMount() {
    const { getChallenges, challenges, itemCount } = this.props;

    if (!challenges || challenges.length === 0) {
      getChallenges({
        page: 1,
        perPage: itemCount,
        types: ['CH', 'F2F', 'TSK'],
        tracks: ['DES', 'DEV', 'DEV', 'DS', 'QA'],
        status: 'Active',
        sortBy: 'updated',
        sortOrder: 'desc',
        isLightweight: true,
        tPhaseName: 'Registration',
      });
    }
  }

  render() {
    const { challenges, theme, loading } = this.props;

    return (
      <ChallengesFeed challenges={challenges} theme={theme} loading={loading} />
    );
  }
}

ChallengesFeedContainer.defaultProps = {
  itemCount: config.DASHBOARD.NUM_CHALLENGES || 5,
  challenges: [],
  loading: true,
  theme: 'light',
};

ChallengesFeedContainer.propTypes = {
  challenges: PT.arrayOf(PT.shape()),
  itemCount: PT.number,
  getChallenges: PT.func.isRequired,
  loading: PT.bool,
  theme: PT.oneOf(['dark', 'light']),
};

const mapStateToProps = state => ({
  challenges: state.dashboard.challenges,
  loading: state.dashboard.loading,
});

const mapDispatchToProps = dispatch => ({
  getChallenges: (query) => {
    const a = actions.dashboard;

    dispatch(a.fetchChallengesInit());
    dispatch(a.fetchChallengesDone(query));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengesFeedContainer);
