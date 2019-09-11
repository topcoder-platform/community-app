/**
 * The core tracks filter
 */
import _ from 'lodash';
import moment from 'moment';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';
import { getService } from 'services/contentful';

import IconCloseBig from 'assets/images/tc-edu/icon-close-big.svg';
import TracksTags from './TracksTags';
import TracksAuthor from './TracksAuthor';
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
            authorList: _.concat(authorList, _.map(results.items, item => item.fields.name)),
          });
        }
      });
  }

  /**
   * Reset filter form to init value
   */
  onReset() {
    this.setState({
      selectedAuthor: DEF_SELECTED_AUTHOR,
      tags: [],
      startDate: moment().subtract(1, 'months'),
      endDate: moment(),
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
    } = this.state;

    return (
      <div className={theme.container}>
        <div className={`${theme.header} ${theme['is-mobile']}`}>
          <span>filter</span>
          <button
            type="button"
            onClick={onClose}
          >
            <IconCloseBig />
          </button>
        </div>
        <TracksTags
          tags={tags}
          onAddNewTag={(tag) => {
            this.setState(prevState => ({
              tags: [...prevState.tags, tag],
            }));
          }}
          onRemoveTag={(index) => {
            const newTags = _.cloneDeep(tags);
            if (index !== -1) {
              newTags.splice(index, 1);
              this.setState({ tags: newTags });
            }
          }}
        />
        <div className={theme['author-date-container']}>
          <TracksAuthor
            className={theme['track-author-container']}
            selected={selectedAuthor}
            options={authorList}
            onSelected={(item) => { this.setState({ selectedAuthor: item }); }}
          />
          <TracksDate
            className={theme['track-date-container']}
            startDate={startDate}
            endDate={endDate}
            onSelectStartDate={(date) => { this.setState({ startDate: date }); }}
            onSelectEndDate={(date) => { this.setState({ endDate: date }); }}
          />
        </div>
        <div className={theme.bottom}>
          <button
            type="button"
            className={theme['btn-reset']}
            onClick={this.onReset}
          >RESET
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
  authorList: [DEF_SELECTED_AUTHOR],
  startDate: moment().subtract(1, 'months'),
  endDate: moment(),
  tags: [],
};

TracksFilterInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    bottom: PT.string.isRequired,
    header: PT.string.isRequired,
    'author-date-container': PT.string.isRequired,
    'track-date-container': PT.string.isRequired,
    'track-author-container': PT.string.isRequired,
    'btn-reset': PT.string.isRequired,
    'btn-apply': PT.string.isRequired,
    'is-mobile': PT.string.isRequired,
  }).isRequired,
  onClose: PT.func,
  onApply: PT.func,
  selectedAuthor: PT.string,
  startDate: PT.instanceOf(moment),
  endDate: PT.instanceOf(moment),
  authorList: PT.arrayOf(PT.string),
  tags: PT.arrayOf(PT.string),
};

export default themr('Contentful-Blog', defaultTheme)(TracksFilterInner);
