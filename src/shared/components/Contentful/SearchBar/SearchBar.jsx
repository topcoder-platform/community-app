/**
 * The core search bar rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';
import { config } from 'topcoder-react-utils';
import { getService } from 'services/contentful';
import qs from 'qs';

import IconFilterTitle from 'assets/images/tc-edu/icon-filter-title.svg';
import IconFilterAll from 'assets/images/tc-edu/icon-filter-all.svg';
import IconFilterAuthor from 'assets/images/tc-edu/icon-filter-author.svg';
import IconFilterTags from 'assets/images/tc-edu/icon-filter-tags.svg';
import IconDropdown from 'assets/images/tc-edu/icon-dropdown.svg';
import IconDropdownSmall from 'assets/images/tc-edu/icon-arrow-up-small.svg';
import IconSearch from 'assets/images/tc-edu/icon-search.svg';
import IconPlay from 'assets/images/tc-edu/icon-play-video.svg';
import defaultTheme from './themes/default.scss';

const RESULT_IMAGE_PLACEHOLDER = 'https://images.ctfassets.net/piwi0eufbb2g/838SkGfa1WgtwLY9NK03c/8501550a85be07f220b09ad903a5e575/image-placeholder.png';

const filterOptions = [
  {
    name: 'Title',
    icon: IconFilterTitle,
  },
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
      selectedFilter: filterOptions[props.inputSelectedFilter],
      isShowSuggestion: false,
      suggestionList: {},
      inputlVal: props.inputlVal,
    };

    this.getDropdownPopup = this.getDropdownPopup.bind(this);
    this.getSuggestionList = this.getSuggestionList.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    // using debounce to avoid processing or requesting too much
    this.updateSuggestionListWithNewSearch = _.debounce(
      this.updateSuggestionListWithNewSearch.bind(this), 400,
    );
    this.setSearchFieldRef = this.setSearchFieldRef.bind(this);
    this.setPopupSearchResultRef = this.setPopupSearchResultRef.bind(this);
    this.updatePopupSearchResultSize = this.updatePopupSearchResultSize.bind(this);
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onKeyDown(e) {
    const { inputlVal, selectedFilter } = this.state;
    if (_.trim(inputlVal) && e.which === 13) {
      const searchQuery = {};
      if (this.searchFieldRef && this.searchFieldRef.value) {
        if (selectedFilter.name === 'Tags') {
          searchQuery.tags = [this.searchFieldRef.value];
        }
        if (selectedFilter.name === 'All') {
          searchQuery.phrase = this.searchFieldRef.value;
        }
        if (selectedFilter.name === 'Title') {
          searchQuery.title = this.searchFieldRef.value;
        }
      }
      if (selectedFilter.name !== 'Author') {
        window.location.href = `${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify(searchQuery)}`;
      } else {
        window.location.href = `${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?author=${_.trim(inputlVal)}`;
      }
    }
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
      selectedFilter,
      noResults,
    } = this.state;

    const searchQuery = {};
    if (this.searchFieldRef && this.searchFieldRef.value) {
      if (selectedFilter.name === 'Tags') {
        searchQuery.tags = [this.searchFieldRef.value];
      }
      if (selectedFilter.name === 'All') {
        searchQuery.phrase = this.searchFieldRef.value;
      }
      if (selectedFilter.name === 'Title') {
        searchQuery.title = this.searchFieldRef.value;
      }
    }

    // eslint-disable-next-line no-nested-ternary
    return suggestionList && !_.isEmpty(suggestionList) && isShowSuggestion ? (
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
                    role="button"
                    tabIndex="0"
                    key={`${item.title}-${item.content}-${item.featuredImage}`}
                    className={theme['group-cell']}
                    onClick={() => {
                      window.location.href = (item.externalArticle && item.contentUrl)
                        ? item.contentUrl : `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.slug || item.title}`;
                    }}
                    onKeyPress={_.noop}
                  >
                    <a
                      className={theme.articleLink}
                      href={(item.externalArticle && item.contentUrl) ? item.contentUrl : `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.slug || item.title}`}
                      target={(item.externalArticle && item.contentUrl) ? '_blank' : '_self'}
                      rel="noreferrer"
                      onClick={(e) => {
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                      }}
                    >
                      {
                        item.featuredImage ? (
                          <img
                            className={theme.fImage}
                            src={item.featuredImage}
                            alt="article thumnail"
                          />
                        ) : null
                      }
                      <div className={theme.cellWrap}>
                        <span className={theme['cell-text']}>
                          {item.title}
                        </span>
                        <span className={theme.cellAuthor}>
                          {item.contentAuthor.name}
                        </span>
                      </div>
                    </a>
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
                    role="button"
                    tabIndex="-11"
                    className={theme['group-cell']}
                    onClick={() => {
                      window.location.href = (item.externalArticle && item.contentUrl)
                        ? item.contentUrl : `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.slug || item.title}`;
                    }}
                    onKeyPress={_.noop}
                  >
                    <a
                      className={theme.articleLink}
                      href={(item.externalArticle && item.contentUrl) ? item.contentUrl : `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.slug || item.title}`}
                      target={(item.externalArticle && item.contentUrl) ? '_blank' : '_self'}
                      rel="noreferrer"
                      onClick={(e) => {
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                      }}
                    >
                      {
                        item.featuredImage ? (
                          <div className={theme['cell-image']}>
                            <img
                              className={theme.fImage}
                              src={item.featuredImage}
                              alt="video thumnail"
                            />
                            <IconPlay className={theme['icon-play']} />
                          </div>
                        ) : null
                      }
                      <div className={theme.cellWrap}>
                        <span className={theme['cell-text']}>
                          {item.title}
                        </span>
                        <span className={theme.cellAuthor}>
                          {item.contentAuthor.name}
                        </span>
                      </div>
                    </a>
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
                    <a
                      className={theme.forumLink}
                      href={(item.externalArticle && item.contentUrl) ? item.contentUrl : `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.slug || item.title}`}
                      target={(item.externalArticle && item.contentUrl) ? '_blank' : '_self'}
                      rel="noreferrer"
                    >
                      <span className={theme['cell-text']}>
                        {item.title}
                      </span>
                    </a>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        {suggestionList.Author && (suggestionList.Author.length > 0) && (
          <div className={`${theme['group-container']} ${theme['group-authors']}`}>
            <span className={theme['group-title']}>Authors</span>
            <div className={theme['group-content']}>
              {
                _.map(suggestionList.Author, item => (
                  <div
                    key={`${item.name}`}
                    className={theme['group-cell']}
                  >
                    <a className={theme.authorLink} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?author=${item.name}`}>
                      {item.tcHandle}
                      {
                        item.name ? (
                          <span className={theme.authorName}>
                            {item.name}
                          </span>
                        ) : null
                      }
                    </a>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        {
          selectedFilter.name !== 'Author' ? (
            <a className={theme['view-all-results']} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify(searchQuery)}`}>
              View all results
            </a>
          ) : null
        }
      </div>
    ) : noResults ? (
      <div
        className={theme['popup-search-result']}
        ref={this.setPopupSearchResultRef}
      >
        <span>No Results</span>
      </div>
    ) : null;
  }

  handleClickOutside(e) {
    if (this.popupSearchResultRef && !this.popupSearchResultRef.contains(e.target)) {
      this.setState({ isShowSuggestion: false });
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
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
   * @param {String} searchTerm Search text
   */
  updateSuggestionListWithNewSearch(searchTerm) {
    const {
      selectedFilter,
    } = this.state;
    const searchText = searchTerm ? encodeURIComponent(searchTerm) : '';

    if (searchText) {
      const query = {
        content_type: 'article',
      };
      if (selectedFilter.name === 'All') {
        query.query = searchText;
      }
      if (selectedFilter.name === 'Title') {
        query['fields.title[match]'] = searchText;
      }
      if (selectedFilter.name === 'Author') {
        // author queries for >= 2 symbols
        if (searchText.length <= 1) {
          this.setState({ suggestionList: {} });
          return;
        }
        query.content_type = 'person';
        query.query = searchText;
      }
      if (selectedFilter.name === 'Tags') {
        query['fields.tags[match]'] = searchText;
      }
      this.apiService.queryEntries(query)
        .then((results) => {
          // Nothing found?
          if (!results.total) {
            this.setState({
              suggestionList: {},
              noResults: true,
            });
            return;
          }
          // Author query?
          if (selectedFilter.name === 'Author') {
            const suggestionList = {
              Author: _.map(results.items, item => ({ ...item.fields })),
            };
            this.setState({ suggestionList, noResults: false });
            return;
          }
          // ALL && Tags
          const suggestionList = this.groupResults(results);
          this.setState({ suggestionList });
        });
    } else {
      this.setState({ suggestionList: {}, noResults: false });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  groupResults(results) {
    const suggestionList = _.groupBy(
      _.map(results.items, (item) => {
        const { fields } = item;
        const featuredImage = fields.featuredImage
          ? _.find(results.includes.Asset, { sys: { id: fields.featuredImage.sys.id } })
          : { fields: { file: { url: RESULT_IMAGE_PLACEHOLDER } } };
        const contentAuthor = _.find(
          results.includes.Entry, { sys: { id: fields.contentAuthor[0].sys.id } },
        );
        return {
          title: fields.title,
          type: fields.type,
          content: fields.content,
          featuredImage: featuredImage.fields.file.url,
          tags: fields.tags,
          contentAuthor: contentAuthor.fields,
          externalArticle: fields.externalArticle,
          contentUrl: fields.contentUrl,
          slug: fields.slug,
        };
      }),
      'type',
    );
    // limit results per group
    _.forOwn(suggestionList, (value, key) => {
      suggestionList[key].length = Math.min(
        value.length,
        config.TC_EDU_SEARCH_BAR_MAX_RESULTS_EACH_GROUP,
      );
    });
    return suggestionList;
  }

  /**
   * Handle input search change
   * @param {Object} e input event
   */
  handleSearchChange(e) {
    const val = e.target.value;
    this.updateSuggestionListWithNewSearch(val);
    this.setState({
      inputlVal: val,
    });
  }

  render() {
    const {
      theme,
    } = this.props;

    const {
      isShowFilterPopup,
      selectedFilter,
      inputlVal,
    } = this.state;

    return (
      <div className={theme.container}>
        <div className={theme.content}>
          <IconSearch className={theme['icon-search']} />
          <input
            value={inputlVal}
            maxLength={115}
            ref={this.setSearchFieldRef}
            type="text"
            placeholder="Search..."
            onFocus={(e) => {
              this.updateSuggestionListWithNewSearch(e.target.value);
              this.setState({ isShowSuggestion: true, isShowFilterPopup: false });
              document.addEventListener('mousedown', this.handleClickOutside);
            }}
            onChange={this.handleSearchChange}
            onKeyDown={this.onKeyDown}
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
    fImage: PT.string.isRequired,
    articleLink: PT.string.isRequired,
    forumLink: PT.string.isRequired,
    cellWrap: PT.string.isRequired,
    cellAuthor: PT.string.isRequired,
    authorLink: PT.string.isRequired,
    authorName: PT.string.isRequired,
    'group-authors': PT.string.isRequired,
  }).isRequired,
  inputlVal: PT.string,
  inputSelectedFilter: PT.string,
};

SearchBarInner.defaultProps = {
  inputlVal: '',
  inputSelectedFilter: '0',
};

export default themr('Contentful-Blog', defaultTheme)(SearchBarInner);
