import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const LoadingListItem = ({ type }) => {
  switch (type) {
    case 'MEMBER':
      return (
        <div styleName="loading-list-item">
          <div styleName="user-info">
            <div styleName="user-profile">
              <div styleName="user-avatar" />

              <div styleName="username-and-details">
                <div styleName="username" />

                <div styleName="user-details">
                  <div styleName="country-and-wins" />

                  <div styleName="member-since" />
                </div>
              </div>
            </div>
          </div>

          <div styleName="user-stats">
            <div className="aligner">
              <div styleName="tag-list" />
              <div styleName="track-list">
                <div styleName="track-item" />
                <div styleName="track-item" />
                <div styleName="track-item" />
                <div styleName="track-item" />
                <div styleName="track-item" />
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

LoadingListItem.propTypes = {
  type: PropTypes.string.isRequired,
};

export default LoadingListItem;
