/**
 * The core search bar rendering.
 */
import _ from 'lodash';
import moment from 'moment';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';

import IconCloseBig from 'assets/images/tc-edu/icon-close-big.svg';
import TracksTags from './TracksTags';
import TracksAuthor from './TracksAuthor';
import TracksDate from './TracksDate';
import defaultTheme from './themes/default.scss';


export class TracksFilterInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAuthor: props.selectedAuthor,
      authorList: props.authorList,
      tags: _.cloneDeep(props.tags),
      startDate: props.startDate,
      endDate: props.endDate,
    };

    this.onReset = this.onReset.bind(this);
  }

  /**
   * Reset filter form to init value
   */
  onReset() {
    const {
      selectedAuthor,
      startDate,
      endDate,
      tags,
    } = this.props;

    this.setState({
      selectedAuthor,
      tags: _.cloneDeep(tags),
      startDate,
      endDate,
    });
  }

  render() {
    const {
      theme,
      onClose,
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
            tags.push(tag);
            this.setState({ tags });
          }}
          onRemoveTag={(index) => {
            tags.splice(index, 1);
            this.setState({ tags });
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
          >APPLY FILTER
          </button>
        </div>
      </div>
    );
  }
}

TracksFilterInner.defaultProps = {
  onClose: () => {},
  selectedAuthor: '',
  authorList: [],
  startDate: null,
  endDate: null,
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
  selectedAuthor: PT.string,
  startDate: PT.instanceOf(moment),
  endDate: PT.instanceOf(moment),
  authorList: PT.arrayOf(PT.string),
  tags: PT.arrayOf(PT.string),
};

export default themr('Contentful-Blog', defaultTheme)(TracksFilterInner);
