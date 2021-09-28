/**
 * Container for dashboard announcement.
 */

import GigsFeed from 'components/Dashboard/GigsFeed';
import PT from 'prop-types';
import React from 'react';
import actions from 'actions/recruitCRM';
import { connect } from 'react-redux';


class GigsFeedContainer extends React.Component {
  componentDidMount() {
    const {
      getGigs,
      gigs,
      itemCount,
    } = this.props;

    // This gets all jobs.
    if (!gigs || gigs.length === 0) {
      getGigs({
        perPage: itemCount,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'sourcing',
        isApplicationPageActive: true,
      });
    }
  }

  render() {
    const {
      gigs,
      theme,
      loading,
    } = this.props;

    return (
      <GigsFeed gigs={gigs} theme={theme} loading={loading} />
    );
  }
}

GigsFeedContainer.defaultProps = {
  itemCount: 10,
  gigs: [],
  loading: true,
  theme: 'light',
};

GigsFeedContainer.propTypes = {
  gigs: PT.arrayOf(PT.shape()),
  itemCount: PT.number,
  getGigs: PT.func.isRequired,
  loading: PT.bool,
  theme: PT.oneOf(['dark', 'light']),
};

function mapStateToProps(state) {
  const data = state.recruitCRM;
  return {
    gigs: data ? data.gigs : [],
    loading: data ? data.gigsLoading : true,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.recruit;
  return {
    getGigs: (ownProps) => {
      dispatch(a.getGigsInit(ownProps));
      dispatch(a.getGigsDone(ownProps));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GigsFeedContainer);
