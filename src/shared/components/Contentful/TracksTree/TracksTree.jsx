/* eslint-disable no-param-reassign */
/**
 * The core track tree rendering.
 */
import _ from 'lodash';
import PT from 'prop-types';
import React, { Component } from 'react';
import { themr } from 'react-css-super-themr';
import { config } from 'topcoder-react-utils';

import IconArrowUpBig from 'assets/images/tc-edu/icon-arrow-up-big.svg';
import defaultTheme from './themes/default.scss';
import ChildList from './ChildList';

export class TracksTreeInner extends Component {
  constructor(props) {
    super(props);
    const list = _.cloneDeep(props.list);
    this.state = {
      expandedTrack: this.getExpandedTrack(list),
      list,
      isShowFullList: false,
    };
  }

  /**
   * Get current expanded track
   * @param {Array} list list of track item
   */
  getExpandedTrack(list) {
    let expandedTrack = 0;
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      let tmpExpanedTrack = this.getExpandedTrack(item.items);
      if (item.selected) {
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
      onItemClick,
    } = this.props;
    const {
      list,
      expandedTrack,
      isShowFullList,
    } = this.state;

    const selectedTrack = _.find(list, { id: expandedTrack });
    return (
      <div className={`${theme.container} ${isShowFullList ? theme['show-full-mobile'] : ''}`}>
        <a href={`${config.TC_EDU_BASE_PATH}`} className={theme.homeLink}>THRIVE</a>
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
                  this.setState({ expandedTrack: option.id });
                  option.items = _.map(option.items, (subItem) => {
                    subItem.selected = false;
                    return subItem;
                  });
                  onItemClick(option);
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
                    // update the list and set it in state
                    const listUpdated = _.map(list, (item) => {
                      item.selected = item.title === selectedItem.track;
                      item.items = _.map(item.items, (subItem) => {
                        subItem.selected = subItem.title === selectedItem.title;
                        return subItem;
                      });
                      return item;
                    });
                    this.setState({
                      list: listUpdated,
                    });
                    // callback invocation
                    onItemClick(selectedItem);
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
    homeLink: PT.string.isRequired,
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
  onItemClick: PT.func.isRequired,
};

export default themr('Contentful-Blog', defaultTheme)(TracksTreeInner);
