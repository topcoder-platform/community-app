/**
 * Container for the challenge search bar.
 */

import actions from 'actions/challenge-listing/filter-panel';
import challengeListingActions from 'actions/challenge-listing';
import ChallengeSearchBar from 'components/challenge-listing/Filters/ChallengeSearchBar';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

export class Container extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch = _.debounce(this.onSearch.bind(this), 1000);
  }

  onSearch(text) {
    const {
      setFilterState,
      filterState,
    } = this.props;

    setFilterState({ ..._.clone(filterState), search: text.trim() });
  }

  render() {
    const {
      searchText,
      setSearchText,
    } = this.props;
    return (
      <ChallengeSearchBar
        onSearch={(text) => {
          setSearchText(text);
          this.onSearch(text);
        }}
        placeholder="Search Tags"
        query={searchText}
      />
    );
  }
}

Container.defaultProps = {
  searchText: '',
};

Container.propTypes = {
  filterState: PT.shape().isRequired,
  setFilterState: PT.func.isRequired,
  searchText: PT.string,
  setSearchText: PT.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  const a = actions.challengeListing.filterPanel;
  const cla = challengeListingActions.challengeListing;
  return {
    setSearchText: text => dispatch(a.setSearchText(text)),
    setFilterState: s => dispatch(cla.setFilter(s)),
  };
}

function mapStateToProps(state) {
  const cl = state.challengeListing;
  return {
    filterState: cl.filter,
    searchText: state.challengeListing.filterPanel.searchText,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
