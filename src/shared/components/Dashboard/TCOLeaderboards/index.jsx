/**
 * TCOLeaderboards component
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import ChevronDown from 'assets/images/minimal-down-white.svg';
import { Scrollbars } from 'react-custom-scrollbars';

import './styles.scss';
import { Avatar } from 'topcoder-react-ui-kit';
import Select from 'components/Select';

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
    // The height of each row
    const itemHeight = 41;

    const options = leaderboards && _.sortBy(leaderboards
      .map((track, index) => ({
        value: index,
        label: track.selectText,
        selected: index === selectedIndex,
      })), 'label');
    const data = _.get(leaderboards, [selectedIndex]);
    const items = (data && !leaderboardsLoading) ? data.leaderboard
      .map((row, index) => (
        <div styleName="leaderboardRow">
          <span styleName="index">{index + 1}</span>
          <span styleName="avatar"><Avatar url={row['member_profile_basic.photo_url']} /></span>
          <span styleName="handle">{row['member_profile_basic.handle']}</span>
          <span styleName="tcoPoints">{row['tco_leaderboard.tco_points']}</span>
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
        <Scrollbars
          style={{
            height: itemCount * itemHeight,
            width: '100%',
          }}
        >
          <div styleName="leaderboard">
            {items}
          </div>
        </Scrollbars>
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
