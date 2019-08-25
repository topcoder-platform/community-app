/**
 * The core search bar rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';
import { config } from 'topcoder-react-utils';

import IconFilterAll from 'assets/images/tc-edu/icon-filter-all.svg';
import IconFilterAuthor from 'assets/images/tc-edu/icon-filter-author.svg';
import IconFilterTags from 'assets/images/tc-edu/icon-filter-tags.svg';
import IconDropdown from 'assets/images/tc-edu/icon-dropdown.svg';
import IconDropdownSmall from 'assets/images/tc-edu/icon-arrow-up-small.svg';
import IconSearch from 'assets/images/tc-edu/icon-search.svg';
import IconPlay from 'assets/images/tc-edu/icon-play-video.svg';
import defaultTheme from './themes/default.scss';

const filterOptions = [
  {
    name: 'All',
    icon: IconFilterAll,
  },
  {
    name: 'Author',
    icon: IconFilterAuthor,
  },
  {
    name: 'Tags',
    icon: IconFilterTags,
  },
];

export class SearchBarInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowFilterPopup: false,
      selectedFilter: filterOptions[0],
      isShowSuggestion: false,
      suggestionList: {},
    };

    this.getDropdownPopup = this.getDropdownPopup.bind(this);
    this.getSuggestionList = this.getSuggestionList.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    // using debounce to avoid processing or requesting too much
    this.updateSuggestionListWithNewSearch = _.debounce(
      this.updateSuggestionListWithNewSearch.bind(this), 100,
    );
    this.setSearchFieldRef = this.setSearchFieldRef.bind(this);
    this.setPopupSearchResultRef = this.setPopupSearchResultRef.bind(this);
    this.updatePopupSearchResultSize = this.updatePopupSearchResultSize.bind(this);
  }

  /**
   * Set the search field ref
   */
  setSearchFieldRef(node) {
    this.searchFieldRef = node;
  }

  /**
   * Set the search field ref
   */
  setPopupSearchResultRef(node) {
    this.popupSearchResultRef = node;
    this.updatePopupSearchResultSize();
  }

  /**
   * Get dropdown popup
   * @param {Boolean} isMobile is only for mobile
   */
  getDropdownPopup(isMobile) {
    const {
      theme,
    } = this.props;

    const {
      isShowFilterPopup,
      selectedFilter,
    } = this.state;

    return (isShowFilterPopup && (
      <div
        className={`${theme['dropdown-popup']} ${isMobile ? theme['is-mobile'] : theme['is-desktop']}`}
      >
        {
          _.map(filterOptions, option => (
            <button
              type="button"
              onClick={() => {
                this.updateSuggestionListWithNewSearch(this.searchFieldRef.value);
                this.setState({ selectedFilter: option, isShowFilterPopup: false });
              }}
              key={option.name}
              className={`${theme['dropdown-item']} ${(option.name === selectedFilter.name) ? theme.selected : ''}`}
            >
              <option.icon />
              <span>{option.name}</span>
            </button>
          ))
        }
      </div>
    ));
  }

  /**
   * Get suggestion list by current filter
   */
  getSuggestionList() {
    const {
      theme,
    } = this.props;

    const {
      isShowSuggestion,
      suggestionList,
    } = this.state;

    return (suggestionList && !_.isEmpty(suggestionList) && isShowSuggestion && (
      <div
        className={theme['popup-search-result']}
        ref={this.setPopupSearchResultRef}
      >
        {suggestionList.Article && (suggestionList.Article.length > 0) && (
          <div className={`${theme['group-container']} ${theme['group-articles']}`}>
            <span className={theme['group-title']}>articles</span>
            <div className={theme['group-content']}>
              {
                _.map(suggestionList.Article, item => (
                  <div
                    key={`${item.title}-${item.content}-${item.featuredImage}`}
                    className={theme['group-cell']}
                  >
                    <img
                      className={theme['cell-image']}
                      src={item.featuredImage}
                      alt="article thumnail"
                    />
                    <span className={theme['cell-text']}>
                      {item.title}
                    </span>
                  </div>
                ))
              }

            </div>
          </div>
        )}
        {suggestionList.Video && (suggestionList.Video.length > 0) && (
          <div className={`${theme['group-container']} ${theme['group-videos']}`}>
            <span className={theme['group-title']}>videos</span>
            <div className={theme['group-content']}>
              {
                _.map(suggestionList.Video, item => (
                  <div
                    key={`${item.title}-${item.content}-${item.featuredImage}`}
                    className={theme['group-cell']}
                  >
                    <div className={theme['cell-image']}>
                      <img
                        src={item.featuredImage}
                        alt="video thumnail"
                      />
                      <IconPlay className={theme['icon-play']} />
                    </div>
                    <span className={theme['cell-text']}>
                      {item.title}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        {suggestionList['Forum post'] && (suggestionList['Forum post'].length > 0) && (
          <div className={`${theme['group-container']} ${theme['group-forum-posts']}`}>
            <span className={theme['group-title']}>forum posts</span>
            <div className={theme['group-content']}>
              {
                _.map(suggestionList['Forum post'], item => (
                  <div
                    key={`${item.title}-${item.content}-${item.featuredImage}`}
                    className={theme['group-cell']}
                  >
                    <span className={theme['cell-text']}>
                      {item.title}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        <a className={theme['view-all-results']} href="#">View all results</a>
      </div>
    ));
  }

  /**
   * Update size of popup search result
   */
  updatePopupSearchResultSize() {
    if (this.popupSearchResultRef) {
      const viewportOffset = this.popupSearchResultRef.getBoundingClientRect();
      if (viewportOffset) {
        const { top } = viewportOffset;
        this.popupSearchResultRef.style['max-height'] = `calc(100vh - ${top + 2}px)`;
      }
    }
  }

  /**
   * Update suggestion list with new search text
   * This function use debounce delay to avoid processing or requesting too much
   *
   * @param {String} searchText Search text
   */
  updateSuggestionListWithNewSearch(searchText) {
    const {
      AutoSuggestList,
    } = this.props;

    const {
      selectedFilter,
    } = this.state;

    if (searchText) {
      const suggestionList = _.groupBy(
        _.filter(
          AutoSuggestList, (item) => {
            const query = searchText.toLowerCase();
            const searchByAuthor = () => {
              for (let i = 0; i < item.contentAuthor.length; i += 1) {
                const author = item.contentAuthor[i];
                if (
                  author.name.toLowerCase().indexOf(query) >= 0
                  || author.email.toLowerCase().indexOf(query) >= 0
                  || author.TCHandle.toLowerCase().indexOf(query) >= 0
                ) {
                  return true;
                }
              }
              return false;
            };
            const searchByTags = () => {
              for (let i = 0; i < item.tags.length; i += 1) {
                const tag = item.tags[i];
                if (tag.toLowerCase().indexOf(query) >= 0) {
                  return true;
                }
              }
              return false;
            };

            switch (selectedFilter.name) {
              case 'All': {
                if (
                  searchByAuthor()
                  || searchByTags()
                  || item.title.toLowerCase().indexOf(query) >= 0
                  || item.content.toLowerCase().indexOf(query) >= 0
                ) {
                  return true;
                }
                return false;
              }
              case 'Author': {
                if (searchByAuthor()) {
                  return true;
                }
                return false;
              }
              case 'Tags': {
                if (searchByTags()) {
                  return true;
                }
                return false;
              }
              default: {
                return false;
              }
            }
          },
        ),
        'type',
      );

      _.forOwn(suggestionList, (value, key) => {
        suggestionList[key].length = Math.min(
          value.length,
          config.TC_EDU_SEARCH_BAR_MAX_RESULTS_EACH_GROUP,
        );
      });
      this.setState({ suggestionList });
    } else {
      this.setState({ suggestionList: {} });
    }
  }

  /**
   * Handle input search change
   * @param {Object} e input event
   */
  handleSearchChange(e) {
    const val = e.target.value;
    this.updateSuggestionListWithNewSearch(val);
  }

  render() {
    const {
      theme,
    } = this.props;

    const {
      isShowFilterPopup,
      selectedFilter,
    } = this.state;

    return (
      <div className={theme.container}>
        <div className={theme.content}>
          <IconSearch className={theme['icon-search']} />
          <input
            ref={this.setSearchFieldRef}
            type="text"
            placeholder="Search.."
            onBlur={() => {
              this.setState({ isShowSuggestion: false });
            }}
            onFocus={(e) => {
              this.updateSuggestionListWithNewSearch(e.target.value);
              this.setState({ isShowSuggestion: true, isShowFilterPopup: false });
            }}
            onChange={this.handleSearchChange}
          />
          <div className={theme.dropdown}>
            <button
              type="button"
              onClick={() => {
                this.setState({ isShowFilterPopup: !isShowFilterPopup });
              }}
              className={theme['dropdown-header']}
            >
              <div className={theme['dropdown-header-left']}>
                <selectedFilter.icon />
                <span>{selectedFilter.name}</span>
              </div>
              <IconDropdown className={theme['is-desktop']} />
              <IconDropdownSmall className={`${theme['is-mobile']} ${theme['icon-dropdown']}`} />
            </button>
            {this.getDropdownPopup(false)}
          </div>

          {this.getDropdownPopup(true)}
          {this.getSuggestionList()}
        </div>
      </div>
    );
  }
}

SearchBarInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    content: PT.string.isRequired,
    dropdown: PT.string.isRequired,
    selected: PT.string.isRequired,
    'dropdown-header': PT.string.isRequired,
    'dropdown-header-left': PT.string.isRequired,
    'dropdown-popup': PT.string.isRequired,
    'dropdown-item': PT.string.isRequired,
    'popup-search-result': PT.string.isRequired,
    'group-container': PT.string.isRequired,
    'group-articles': PT.string.isRequired,
    'group-videos': PT.string.isRequired,
    'group-forum-posts': PT.string.isRequired,
    'group-title': PT.string.isRequired,
    'group-content': PT.string.isRequired,
    'group-cell': PT.string.isRequired,
    'cell-image': PT.string.isRequired,
    'cell-text': PT.string.isRequired,
    'view-all-results': PT.string.isRequired,
    'icon-play': PT.string.isRequired,
    'icon-search': PT.string.isRequired,
    'is-mobile': PT.string.isRequired,
    'is-desktop': PT.string.isRequired,
    'icon-dropdown': PT.string.isRequired,
  }).isRequired,
  AutoSuggestList: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    type: PT.oneOf(['Article', 'Forum post', 'Video']).isRequired,
    content: PT.string.isRequired,
    featuredImage: PT.string.isRequired,
    tags: PT.arrayOf(PT.string).isRequired,
    contentAuthor: PT.arrayOf(PT.shape({
      TCHandle: PT.string.isRequired,
      email: PT.string.isRequired,
      name: PT.string.isRequired,
    })).isRequired,

  })).isRequired,
};

export default themr('Contentful-Blog', defaultTheme)(SearchBarInner);
