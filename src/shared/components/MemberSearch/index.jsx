import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import MemberSearchView from './MemberSearchView';
import { isEndOfScreen } from './helpers';

export default class MemberSearch extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    const { location, loadMemberSearch } = this.props;

    this.searchTermFromQuery = qs.parse(location.search, { ignoreQueryPrefix: true }).q || '';
    loadMemberSearch(this.searchTermFromQuery);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const {
      moreMatchesAvailable, usernameMatches, loadingMore, pageLoaded, loadMemberSearch,
    } = this.props;

    if (pageLoaded && !loadingMore && moreMatchesAvailable && usernameMatches.length > 10) {
      isEndOfScreen(loadMemberSearch, this.searchTermFromQuery);
    }
  }

  render() {
    return (
      <MemberSearchView {...this.props} />
    );
  }
}

MemberSearch.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,

  pageLoaded: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,

  usernameMatches: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  moreMatchesAvailable: PropTypes.bool.isRequired,
  totalCount: PropTypes.number.isRequired,
  topMembers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

  previousSearchTerm: PropTypes.string,
  searchTermTag: PropTypes.shape({}),

  loadMemberSearch: PropTypes.func.isRequired,
};

MemberSearch.defaultProps = {
  previousSearchTerm: null,
  searchTermTag: null,
};
