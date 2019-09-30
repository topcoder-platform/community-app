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
      inputlVal: props.inputlVal,
    };

    this.getDropdownPopup = this.getDropdownPopup.bind(this);
    this.getSuggestionList = this.getSuggestionList.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
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
    } = this.state;

    const searchQuery = {};
    if (this.searchFieldRef && this.searchFieldRef.value) {
      if (selectedFilter.name === 'Tags') {
        searchQuery.tags = [this.searchFieldRef.value];
      }
      if (selectedFilter.name === 'All') {
        searchQuery.phrase = this.searchFieldRef.value;
      }
    }

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
                    <a className={theme.articleLink} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.title}`}>
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
                    className={theme['group-cell']}
                  >
                    <a className={theme.articleLink} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.title}`}>
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
                    <a className={theme.forumLink} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${item.title}`}>
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
        <a className={theme['view-all-results']} href={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify(searchQuery)}`}>
          View all results
        </a>
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
      selectedFilter,
    } = this.state;

    if (searchText) {
      const query = {
        content_type: 'article',
      };
      if (selectedFilter.name === 'All') {
        query.query = searchText;
      }
      if (selectedFilter.name === 'Author') {
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
            this.setState({ suggestionList: {} });
            return;
          }
          // Author query?
          if (selectedFilter.name === 'Author') {
            this.apiService.queryEntries({
              content_type: 'article',
              links_to_entry: results.items[0].sys.id,
            })
              .then((authorResults) => {
                if (!authorResults.total) {
                  this.setState({ suggestionList: {} });
                  return;
                }
                const suggestionList = this.groupResults(authorResults);
                this.setState({ suggestionList });
              });
            return;
          }
          // ALL && Tags
          const suggestionList = this.groupResults(results);
          this.setState({ suggestionList });
        });
    } else {
      this.setState({ suggestionList: {} });
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
            ref={this.setSearchFieldRef}
            type="text"
            placeholder="Search.."
            onBlur={() => {
              _.delay(() => {
                this.setState({ isShowSuggestion: false });
              }, 100);
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
    fImage: PT.string.isRequired,
    articleLink: PT.string.isRequired,
    forumLink: PT.string.isRequired,
    cellWrap: PT.string.isRequired,
    cellAuthor: PT.string.isRequired,
  }).isRequired,
  inputlVal: PT.string,
};

SearchBarInner.defaultProps = {
  inputlVal: '',
};

export default themr('Contentful-Blog', defaultTheme)(SearchBarInner);
