/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/**
 * The core tracks filter
 */
import _ from 'lodash';
import moment from 'moment';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';
import { getService } from 'services/contentful';
import Dropdown from 'components/GUIKit/Dropdown';
import MediaQuery from 'react-responsive';

import IconCloseBig from 'assets/images/tc-edu/icon-close-big.svg';
import IconClearFilter from 'assets/images/tc-edu/icon-clear-filter.svg';
import TracksTags from './TracksTags';
// import TracksAuthor from './TracksAuthor';
import TracksDate from './TracksDate';
import defaultTheme from './themes/default.scss';

const DEF_SELECTED_AUTHOR = 'All authors';
export class TracksFilterInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAuthor: props.selectedAuthor,
      authorList: props.authorList,
      tags: props.tags,
      startDate: props.startDate,
      endDate: props.endDate,
      sortBy: props.sortBy,
    };

    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });

    this.onReset = this.onReset.bind(this);
  }

  componentDidMount() {
    // Load all persons from Contentful
    this.apiService.queryEntries({
      content_type: 'person',
      limit: 1000,
    })
      .then((results) => {
        if (results.total) {
          const { authorList } = this.state;
          this.setState({
            authorList: _.concat(authorList, _.map(
              _.sortBy(results.items, i => i.fields.name.toLowerCase()),
              item => ({ label: item.fields.name, selected: false }),
            )),
          });
        }
      });
  }

  /**
   * Reset filter form to init value
   */
  onReset(isMobile) {
    const {
      sortBy,
      onApply,
    } = this.props;
    this.setState({
      selectedAuthor: DEF_SELECTED_AUTHOR,
      tags: [],
      startDate: moment('2001-01-02'),
      endDate: moment(),
      sortBy: sortBy.map((o) => {
        // eslint-disable-next-line no-param-reassign
        o.selected = o.label === 'Content Publish Date';
        return o;
      }),
    }, () => {
      if (!isMobile) onApply(this.state);
    });
  }

  render() {
    const {
      theme,
      onClose,
      onApply,
    } = this.props;

    const {
      selectedAuthor,
      authorList,
      startDate,
      endDate,
      tags,
      sortBy,
    } = this.state;
    // selected author
    const updatedAuthorList = authorList.map((a) => {
      a.selected = a.label === selectedAuthor;
      return a;
    });

    return (
      <div className={theme.container}>
        <div className={`${theme.header}`}>
          <span>filter</span>
          <button
            type="button"
            onClick={() => this.onReset()}
            className={`${theme['clear-filter']} ${theme['is-mobile-hidden']}`}
          >
            <IconClearFilter />&nbsp;&nbsp;CLEAR ALL FILTERS
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${theme['is-mobile']}`}
          >
            <IconCloseBig />
          </button>
        </div>
        <MediaQuery minDeviceWidth={769}>
          {mediaMatches => (
            <TracksTags
              tags={tags}
              onAddNewTag={(tag) => {
                this.setState(prevState => ({
                  tags: [...prevState.tags, tag],
                }), () => (mediaMatches ? onApply(this.state) : null));
              }}
              onRemoveTag={(index) => {
                const newTags = _.cloneDeep(tags);
                if (index !== -1) {
                  newTags.splice(index, 1);
                  this.setState(
                    { tags: newTags },
                    () => (mediaMatches ? onApply(this.state) : null),
                  );
                }
              }}
            />
          )}
        </MediaQuery>
        <div className={theme['author-date-container']}>
          <div className={theme['track-author-container']}>
            <MediaQuery minDeviceWidth={769}>
              {mediaMatches => (
                <Dropdown
                  label="Authors"
                  options={updatedAuthorList}
                  size="xs"
                  onChange={(authors) => {
                    this.setState(
                      { selectedAuthor: _.find(authors, { selected: true }).label },
                      () => (mediaMatches ? onApply(this.state) : null),
                    );
                  }}
                />
              )}
            </MediaQuery>
          </div>
          <MediaQuery minDeviceWidth={769}>
            {mediaMatches => (
              <TracksDate
                className={theme['track-date-container']}
                startDate={startDate}
                endDate={endDate}
                onSelectStartDate={(date) => {
                  this.setState({ startDate: date ? moment(date) : null },
                    () => (mediaMatches ? onApply(this.state) : null));
                }}
                onSelectEndDate={(date) => {
                  this.setState({ endDate: date ? moment(date) : null },
                    () => (mediaMatches ? onApply(this.state) : null));
                }}
              />
            )}
          </MediaQuery>
          <div className={theme['track-sortBy']}>
            <MediaQuery minDeviceWidth={769}>
              {mediaMatches => (
                <Dropdown
                  label="Sort by"
                  options={sortBy}
                  size="xs"
                  onChange={(newSortBy) => {
                    this.setState(
                      { sortBy: newSortBy },
                      () => (mediaMatches ? onApply(this.state) : null),
                    );
                  }}
                />
              )}
            </MediaQuery>
          </div>
        </div>
        <div className={`${theme.bottom} ${theme['is-mobile']}`}>
          <button
            type="button"
            className={theme['btn-reset']}
            onClick={() => this.onReset(true)}
          >CLEAR
          </button>
          <button
            type="button"
            className={theme['btn-apply']}
            onClick={() => {
              const tagsInput = document.getElementById('track-tags-input').value;
              if (tagsInput) {
                // eslint-disable-next-line no-shadow
                const { tags } = this.state;
                tags.push(tagsInput);
                this.setState({
                  tags,
                });
                window.TracksTags.resetTagsInput();
              }
              onApply(this.state);
              onClose();
            }}
          >APPLY FILTER
          </button>
        </div>
      </div>
    );
  }
}

TracksFilterInner.defaultProps = {
  onClose: () => {},
  onApply: () => {},
  selectedAuthor: DEF_SELECTED_AUTHOR,
  authorList: [{ label: DEF_SELECTED_AUTHOR, selected: true }],
  startDate: moment('2001-01-02'),
  endDate: moment(),
  tags: [],
  sortBy: [],
};

TracksFilterInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    bottom: PT.string.isRequired,
    header: PT.string.isRequired,
    'author-date-container': PT.string.isRequired,
    'track-date-container': PT.string.isRequired,
    'track-author-container': PT.string.isRequired,
    'track-sortBy': PT.string.isRequired,
    'btn-reset': PT.string.isRequired,
    'btn-apply': PT.string.isRequired,
    'is-mobile': PT.string.isRequired,
    'is-mobile-hidden': PT.string.isRequired,
    'clear-filter': PT.string.isRequired,
  }).isRequired,
  onClose: PT.func,
  onApply: PT.func,
  selectedAuthor: PT.string,
  startDate: PT.instanceOf(moment),
  endDate: PT.instanceOf(moment),
  authorList: PT.arrayOf(PT.string),
  tags: PT.arrayOf(PT.string),
  sortBy: PT.arrayOf(
    PT.shape({
      label: PT.string.isRequired,
      selected: PT.bool.isRequired,
    }),
  ),
};

export default themr('Contentful-Blog', defaultTheme)(TracksFilterInner);
