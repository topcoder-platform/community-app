import _ from 'lodash';
import actions from 'actions/engagements';
import headerActions from 'actions/topcoder_header';
import React from 'react';
import PT from 'prop-types';
import shortId from 'shortid';
import { connect } from 'react-redux';
import EngagementListing from 'components/engagement-listing';
import MetaTags from 'components/MetaTags';

import ogImage from '../../../assets/images/social.png';

class EngagementListingContainer extends React.Component {
  componentDidMount() {
    const {
      auth,
      filter,
      getEngagements,
      markHeaderMenu,
    } = this.props;

    markHeaderMenu();
    getEngagements(0, filter, auth.tokenV3);
  }

  componentDidUpdate(prevProps) {
    const {
      auth,
      dropEngagements,
      filter,
      getEngagements,
    } = this.props;

    const filterChanged = !_.isEqual(prevProps.filter, filter);
    const tokenChanged = prevProps.auth.tokenV3 !== auth.tokenV3;

    if (filterChanged || tokenChanged) {
      dropEngagements();
      getEngagements(0, filter, auth.tokenV3);
    }
  }

  componentWillUnmount() {
    const { dropEngagements } = this.props;
    dropEngagements();
  }

  loadMore = () => {
    const {
      allEngagementsLoaded,
      auth,
      filter,
      getEngagements,
      lastRequestedPage,
      loadingEngagementsUUID,
    } = this.props;

    if (loadingEngagementsUUID || allEngagementsLoaded) return;

    const nextPage = lastRequestedPage + 1;
    getEngagements(nextPage, filter, auth.tokenV3);
  };

  render() {
    const {
      engagements,
      filter,
      auth,
      history,
      location,
      loadingEngagementsUUID,
      setFilter,
      allEngagementsLoaded,
    } = this.props;

    return (
      <React.Fragment>
        <MetaTags
          description="Browse temporary contract work opportunities (engagements) on Topcoder. Find short-term projects that match your skills."
          image={ogImage}
          siteName="Topcoder"
          title="Topcoder Engagements | Temporary Contract Work | Topcoder Community"
        />
        <EngagementListing
          engagements={engagements}
          loading={Boolean(loadingEngagementsUUID)}
          loadMore={this.loadMore}
          filter={filter}
          setFilter={setFilter}
          allEngagementsLoaded={allEngagementsLoaded}
          auth={auth}
          history={history}
          location={location}
        />
      </React.Fragment>
    );
  }
}

EngagementListingContainer.defaultProps = {
  engagements: [],
  loadingEngagementsUUID: '',
  lastRequestedPage: -1,
  allEngagementsLoaded: false,
  meta: {
    totalCount: 0,
  },
};

EngagementListingContainer.propTypes = {
  auth: PT.shape({
    tokenV3: PT.string,
  }).isRequired,
  engagements: PT.arrayOf(PT.shape()),
  loadingEngagementsUUID: PT.string,
  lastRequestedPage: PT.number,
  allEngagementsLoaded: PT.bool,
  meta: PT.shape({
    totalCount: PT.number,
  }),
  filter: PT.shape({
    status: PT.string,
    skills: PT.arrayOf(PT.string),
    location: PT.string,
    search: PT.string,
    sortBy: PT.string,
  }).isRequired,
  getEngagements: PT.func.isRequired,
  dropEngagements: PT.func.isRequired,
  setFilter: PT.func.isRequired,
  markHeaderMenu: PT.func.isRequired,
  history: PT.shape({
    push: PT.func,
  }).isRequired,
  location: PT.shape({
    pathname: PT.string,
    search: PT.string,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const engagementsState = state.engagements || {};

  return {
    engagements: engagementsState.engagements || [],
    loadingEngagementsUUID: engagementsState.loadingEngagementsUUID || '',
    lastRequestedPage: Number.isFinite(engagementsState.lastRequestedPage)
      ? engagementsState.lastRequestedPage
      : -1,
    allEngagementsLoaded: engagementsState.allEngagementsLoaded || false,
    filter: engagementsState.filter || {
      status: 'open',
      skills: [],
      location: '',
      search: '',
      sortBy: 'createdAt',
    },
    meta: engagementsState.meta || {
      totalCount: 0,
    },
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  const a = actions.engagements;
  const ah = headerActions.topcoderHeader;

  return {
    getEngagements: (page, filters, tokenV3) => {
      const uuid = shortId();
      dispatch(a.getEngagementsInit(uuid, page, filters));
      dispatch(a.getEngagementsDone(uuid, page, filters, tokenV3));
    },
    dropEngagements: () => dispatch(a.dropEngagements()),
    setFilter: filter => dispatch(a.setFilter(filter)),
    markHeaderMenu: () => dispatch(ah.setCurrentNav('Compete', 'Engagements')),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EngagementListingContainer);
