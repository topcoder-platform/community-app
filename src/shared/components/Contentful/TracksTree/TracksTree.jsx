/**
 * The core track tree rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';

import IconArrowUpBig from 'assets/images/tc-edu/icon-arrow-up-big.svg';
import defaultTheme from './themes/default.scss';
import ChildList from './ChildList';

export class TracksTreeInner extends Component {
  constructor(props) {
    super(props);
    const { currentItem } = this.props;
    const list = _.cloneDeep(props.list);
    this.state = {
      expandedTrack: this.getExpandedTrack(list, currentItem),
      list,
      isShowFullList: false,
    };
  }

  /**
   * Get current expanded track
   * @param {Array} list list of track item
   * @param {Number} currentItem current item
   */
  getExpandedTrack(list, currentItem) {
    let expandedTrack = -1;
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      let tmpExpanedTrack = this.getExpandedTrack(item.items, currentItem);
      if (item.id === currentItem) {
        tmpExpanedTrack = item.id;
      }
      if (tmpExpanedTrack > 0) {
        expandedTrack = item.id;
        item.selected = true;
      }
    }
    return expandedTrack;
  }

  render() {
    const {
      theme,
    } = this.props;
    const {
      list,
      expandedTrack,
      isShowFullList,
    } = this.state;

    const selectedTrack = _.find(list, { id: expandedTrack });
    return (
      <div className={`${theme.container} ${isShowFullList ? theme['show-full-mobile'] : ''}`}>
        {!isShowFullList && selectedTrack && (
          <button
            className={`${theme['is-mobile']} ${theme['mobile-header']}`}
            type="button"
            onClick={() => {
              this.setState({ isShowFullList: true });
            }}
          >
            <span>{selectedTrack.title}</span>
            <IconArrowUpBig />
          </button>
        )}
        {
          _.map(list, option => (
            <div
              key={option.id}
              className={`${theme['row-content']} ${isShowFullList ? '' : theme['is-desktop']}`}
            >
              <button
                type="button"
                onClick={() => {
                  this.setState({ expandedTrack: (expandedTrack !== option.id) ? option.id : 0 });
                }}
                className={`${theme['row-item']} ${(expandedTrack === option.id) ? theme.expanded : ''}`}
              >
                <span>{option.title}</span>
                <IconArrowUpBig />
              </button>
              {(expandedTrack === option.id) && (
                <ChildList
                  list={option.items}
                  onSelected={(selectedItem) => {
                    if (selectedItem.items.length === 0) {
                      this.setState({ isShowFullList: false });
                    }
                  }}
                />
              )}
            </div>
          ))
        }
      </div>
    );
  }
}

TracksTreeInner.defaultProps = {
  currentItem: null,
  list: [],
};

TracksTreeInner.propTypes = {
  theme: PT.shape({
    container: PT.string.isRequired,
    'row-content': PT.string.isRequired,
    'row-item': PT.string.isRequired,
    'is-desktop': PT.string.isRequired,
    'is-mobile': PT.string.isRequired,
    'mobile-header': PT.string.isRequired,
    'show-full-mobile': PT.string.isRequired,
    expanded: PT.string.isRequired,
  }).isRequired,
  list: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    title: PT.string.isRequired,
    items: PT.arrayOf(PT.shape({
      id: PT.number.isRequired,
      title: PT.string.isRequired,
      items: PT.array.isRequired,
    })).isRequired,
  })),
  currentItem: PT.number,
};

export default themr('Contentful-Blog', defaultTheme)(TracksTreeInner);
