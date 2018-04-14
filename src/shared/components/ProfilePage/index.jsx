/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { isNumber, isNull } from 'lodash';

import { getRatingColor } from 'utils/tc';

import ArrowNext from 'assets/images/arrow-next.svg';

import CopilotIcon from 'assets/images/profile/ico-track-copilot.svg';
import DataScienceIcon from 'assets/images/profile/ico-track-data.svg';
import DesignIcon from 'assets/images/profile/ico-track-design.svg';
import DevelopIcon from 'assets/images/profile/ico-track-develop.svg';

import Header from './Header';

import style from './styles.scss';

// Maps API track names to format in design
const TRACK_NAMES = {
  DATA_SCIENCE: 'DATA SCIENCE',
  DEVELOP: 'DEVELOPMENT',
  DESIGN: 'DESIGN',
  COPILOT: 'COPILOT',
};

/**
 * Inspects a subtrack and determines if the member is active
 * based on submissions and/or ranks.
 *
 * @param {Object} subtrack Subtrack object
 * @return {Boolean}
 */
const isActiveSubtrack = (subtrack) => {
  if (subtrack.rank && subtrack.rank > 0) {
    return true;
  } else if (isNumber(subtrack.submissions)) {
    return subtrack.submissions > 0;
  }
  return subtrack.submissions && subtrack.submissions.submissions > 0;
};

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badgesModalOpen: false,
      skillsExpanded: false,
    };
  }

  getActiveTracks() {
    const { stats } = this.props;
    const activeTracks = [];

    ['DEVELOP', 'DESIGN', 'DATA_SCIENCE', 'COPILOT'].forEach((track) => {
      const active = [];
      const subTracks = stats[track] ? stats[track].subTracks || [] : [];
      subTracks.forEach((subtrack) => {
        if (isActiveSubtrack(subtrack)) {
          active.push({ ...subtrack, active: true });
        }
      });
      if (active.length > 0) {
        activeTracks.push({ name: track, subTracks: active });
      }
    });

    return activeTracks;
  }

  render() {
    const {
      achievements,
      copilot,
      country,
      info,
      skills,
      stats,
    } = this.props;

    const {
      // badgesModalOpen,
      skillsExpanded,
    } = this.state;

    return (
      <div styleName="outer-container">
        <div styleName="profile-container">
          <div styleName="about-container">
            <div id="affix" styleName="profile-header-container">
              <div styleName="sticky-container">
                <Header
                  copilot={copilot}
                  country={country}
                  info={info}
                  onShowBadges={() => this.setState({ badgesModalOpen: true })}
                  showBadgesButton={achievements.length > 0}
                  wins={stats.wins}
                />
              </div>
            </div>
            <div styleName="profile-about-container">
              {
                skills && skills.length > 0 &&
                <div id="profile-skills">
                  <div styleName="skills">
                    <h3 styleName="activity">Skills</h3>
                    <div styleName="list">
                      <div ng-repeat="skill in vm.skills" styleName="skill">
                        <span>Skill Here</span>
                      </div>
                    </div>
                    {
                      !skillsExpanded &&
                      <PrimaryButton
                        onClick={() => this.setState({ skillsExpanded: true })}
                        theme={style}
                      >VIEW ALL</PrimaryButton>
                    }
                    {
                      skillsExpanded &&
                      <PrimaryButton
                        onClick={() => this.setState({ skillsExpanded: false })}
                        theme={style}
                      >VIEW LESS</PrimaryButton>
                    }
                  </div>
                </div>
              }
              <div id="profile-activity">
                <div styleName="categories">
                  {
                    this.getActiveTracks().map(track => (
                      <div key={track.name} styleName="track">
                        <div styleName="name">
                          { track.name === 'COPILOT' && <CopilotIcon /> }
                          { track.name === 'DATA_SCIENCE' && <DataScienceIcon /> }
                          { track.name === 'DESIGN' && <DesignIcon /> }
                          { track.name === 'DEVELOP' && <DevelopIcon /> }
                          <span>{TRACK_NAMES[track.name]} ACTIVITY</span>
                        </div>
                        {
                          track.subTracks.map((subtrack, index) => (
                            <Link to="#" key={subtrack.name} styleName={`subtrack ${index === 0 ? 'first' : ''}`}>
                              <div styleName="name">{subtrack.name === 'FIRST_2_FINISH' ? 'FIRST2FINISH' : subtrack.name.replace(/_/g, ' ')}</div>
                              {
                                subtrack.rank && !isNull(subtrack.rank.rating) &&
                                  <div styleName="ranking">
                                    <div style={{ color: getRatingColor(subtrack.rank.rating) }} styleName="number">{subtrack.rank.rating}</div>
                                    <div styleName="tag">Rating</div>
                                  </div>
                              }
                              {
                                (!subtrack.rank || isNull(subtrack.rank.rating)) &&
                                !subtrack.fulfillment &&
                                <div styleName="ranking">
                                  <div style={{ color: '#21B2F1' }} styleName="number">{subtrack.wins}</div>
                                  <div styleName="tag">Wins</div>
                                </div>
                              }
                              {
                                subtrack.fulfillment &&
                                <div styleName="ranking">
                                  <div styleName="number">{`${subtrack.fulfillment}%`}</div>
                                  <div styleName="tag">Fulfillment</div>
                                </div>
                              }
                              <ArrowNext styleName="arrow" />
                            </Link>
                          ))
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  achievements: PT.arrayOf(PT.shape()).isRequired,
  copilot: PT.bool.isRequired,
  country: PT.string.isRequired,
  info: PT.shape().isRequired,
  skills: PT.shape().isRequired,
  stats: PT.shape().isRequired,
};

export default ProfilePage;
