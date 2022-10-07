/**
 * TCOLeaderboards component
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import ChevronDown from 'assets/images/chevron-down-white.svg';
import DefaultAvatar from 'assets/images/default-avatar-photo-blue.svg';
import { themr } from 'react-css-super-themr';
import { Avatar } from 'topcoder-react-utils';
import Select from 'components/Select';
import styles from './styles.scss';

export default class TCOLeaderboards extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
    this.handleTrackChange = this.handleTrackChange.bind(this);
  }

  handleTrackChange({ value }) {
    this.setState({ selectedIndex: value });
  }

  render() {
    const {
      leaderboards,
      leaderboardsLoading,
      itemCount,
    } = this.props;
    const { selectedIndex } = this.state;
    const AvatarComponent = themr('Avatar', styles)(Avatar);
    const options = leaderboards && leaderboards
      .map((track, index) => ({
        value: index,
        label: track.selectText,
        selected: index === selectedIndex,
      }));
    const data = _.get(leaderboards, [selectedIndex]);
    const items = (data && !leaderboardsLoading) ? data.leaderboard
      .slice(0, itemCount).map((row, index) => (
        // We limit the items to itemCount - no scrolling
        // eslint-disable-next-line react/no-array-index-key
        <div styleName="leaderboardRow" key={`lb-${index}`}>
          <span styleName="index">{index + 1}</span>
          <span><AvatarComponent url={row['member_profile_basic.photo_url']} DefaultAvatar={DefaultAvatar} /></span>
          <div styleName="handle">
            <a href={`https://topcoder.com/members/${row['member_profile_basic.handle']}`} target="_blank" rel="noreferrer">{row['member_profile_basic.handle']}</a>
          </div>
          <span styleName="tcoPoints">{(row['tco23_leaderboard.tco_points'] ? row['tco23_leaderboard.tco_points'] : row['tco_leaderboard.tco_points']).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
      )) : <LoadingIndicator />;

    return (
      <div styleName="container">
        <div styleName="header">
          <div styleName="titles">
            {
              !leaderboardsLoading && (
                <div>
                  <span styleName="stageText">
                    {data.stageText}
                  </span>
                  <a styleName="titleText" rel="noopener noreferrer" target="_blank" href={data.leaderboardUrl}>{data.titleText}</a>
                </div>
              )
            }
          </div>
          {
            !leaderboardsLoading
            && (
              <div styleName="dropdown-wrapper">
                <Select
                  styleName="dropdown"
                  value={selectedIndex}
                  options={options}
                  onChange={this.handleTrackChange}
                  clearable={false}
                  searchable={false}
                />
                <ChevronDown styleName="chevronDown" />
              </div>
            )
          }
        </div>
        <div styleName="leaderboard">
          {items}
        </div>
      </div>

    );
  }
}


TCOLeaderboards.defaultProps = {
  leaderboards: [],
  leaderboardsLoading: true,
};

TCOLeaderboards.propTypes = {
  leaderboards: PT.arrayOf(PT.object),
  leaderboardsLoading: PT.bool,
  itemCount: PT.number.isRequired,
};
