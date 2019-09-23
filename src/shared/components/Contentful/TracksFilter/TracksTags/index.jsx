/**
 * The tracks tags rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';
import { isomorphy } from 'topcoder-react-utils';

import IconCloseSmall from 'assets/images/tc-edu/icon-close-small.svg';
import defaultTheme from './themes/default.scss';

export class TracksTagsInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };

    // this method to export ref of this component
    // won't work if there are multipe instances of it on the same page!
    if (isomorphy.isClientSide()) {
      window.TracksTags = this;
    }
  }

  componentWillUnmount() {
    if (isomorphy.isClientSide()) {
      window.TracksTags = null;
    }
  }

  resetTagsInput() {
    this.setState({
      inputValue: '',
    });
  }

  render() {
    const {
      theme,
      tags,
      onAddNewTag,
      onRemoveTag,
    } = this.props;

    const { inputValue } = this.state;
    const isTagExist = (value) => {
      for (let i = 0; i < tags.length; i += 1) {
        const tag = tags[i];
        if (value.trim() === tag.trim()) {
          return true;
        }
      }
      return false;
    };
    return (
      <div className={theme.container}>
        <span className={theme.title}>Tags</span>
        <div className={theme['tag-container']}>
          {
            _.map(tags, (option, index) => (
              <div key={index} className={theme.item}>
                <span>{option}</span>
                <button
                  type="button"
                  className={theme['btn-close']}
                  onClick={() => { onRemoveTag(index); }}
                >
                  <IconCloseSmall />
                </button>
              </div>
            ))
          }
          <input
            id="track-tags-input"
            value={inputValue}
            onChange={(e) => { this.setState({ inputValue: e.target.value }); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue && inputValue.trim() && !isTagExist(inputValue)) {
                onAddNewTag(inputValue);
                this.setState({ inputValue: '' });
              }
            }}
            type="text"
            className={theme['tags-field']}
            placeholder="Add tags to filter..."
          />
        </div>
      </div>
    );
  }
}

TracksTagsInner.defaultProps = {
  tags: [],
  onAddNewTag: () => {},
  onRemoveTag: () => {},
};

TracksTagsInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    title: PT.string.isRequired,
    item: PT.string.isRequired,
    'btn-close': PT.string.isRequired,
    'tags-field': PT.string.isRequired,
    'tag-container': PT.string.isRequired,
  }).isRequired,
  tags: PT.arrayOf(PT.string),
  onAddNewTag: PT.func,
  onRemoveTag: PT.func,
};

export default themr('Contentful-Blog', defaultTheme)(TracksTagsInner);
