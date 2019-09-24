import React, { Component } from 'react';
import moment from 'moment';
import SearchPageFilter from 'components/Contentful/SearchPageFilter/SearchPageFilter';

import Categories from 'assets/mock-data/search-page-filter-mock-category-list.json';
import './style.scss';

export default class SearchPageFilterExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFilter: true,
    };
  }

  render() {
    const { isShowFilter } = this.state;
    return (
      <div styleName="container">
        <div styleName="header">
          <h1>
          SearchPageFilter Preview
          </h1>
          <button
            type="button"
            styleName="show-hide-filter is-mobile"
            onClick={() => { this.setState({ isShowFilter: !isShowFilter }); }}
          >
            {isShowFilter ? 'Hide filter' : 'Show filter'}
          </button>
        </div>
        <SearchPageFilter
          isShowInMobile={isShowFilter}
          styleName="search-page-filter-container"
          onClose={() => { this.setState({ isShowFilter: false }); }}
          selectedAuthor="All authors"
          authorList={[
            'All authors',
            'Author 1',
            'Author 2',
            'Author 3',
            'Author 4',
            'Author 5',
            'Author 6',
          ]}
          tags={[
            'tag 1',
            'tag 2',
            'tag 3',
          ]}
          startDate={moment()}
          endDate={moment()}
          selectedCategory="Programming"
          categories={Categories}
        />
      </div>
    );
  }
}

SearchPageFilterExample.propTypes = {
};
