/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import Sticky from 'react-stickynode';

import config from 'utils/config';
import { getRatingColor } from 'utils/tc';

import ArrowNext from 'assets/images/arrow-next.svg';
import CopilotIcon from 'assets/images/profile/ico-track-copilot.svg';
import DataScienceIcon from 'assets/images/profile/ico-track-data.svg';
import DesignIcon from 'assets/images/profile/ico-track-design.svg';
import DevelopIcon from 'assets/images/profile/ico-track-develop.svg';
import Robot from 'assets/images/robot-happy.svg';

import BadgesModal from './BadgesModal';
import Header from './Header';
import Skill from './Skill';

import style from './styles.scss';

// Number of skills to show before a 'VIEW MORE' button is created
const MAX_SKILLS = 10;

// Maps API track names to format in design
const TRACK_NAMES = {
  COPILOT: 'COPILOT',
  DATA_SCIENCE: 'DATA SCIENCE',
  DEVELOP: 'DEVELOPMENT',
  DESIGN: 'DESIGN',
};

/**
 * Inspects a subtrack and determines if the member is active
 * based on submissions and/or ranks.
 *
 * @param {Object} subtrack Subtrack object
 * @return {Boolean}
 */
const isActiveSubtrack = (subtrack) => {
  if (subtrack.name === 'COPILOT_POSTING') {
    return false;
  }
  if (subtrack.rank && subtrack.rank.rating > 0) {
    return true;
  } else if (_.isNumber(subtrack.submissions)) {
    return subtrack.submissions > 0;
  }
  return subtrack.submissions && subtrack.submissions.submissions > 0;
};

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badgesModalOpen: false,
      isMobile: false,
      skillsExpanded: false,
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getActiveTracks() {
    const { copilot, stats } = this.props;
    const activeTracks = [];

    if (copilot && stats.COPILOT && stats.COPILOT.fulfillment) {
      activeTracks.push({
        name: 'COPILOT',
        subTracks: [{
          fulfillment: stats.COPILOT.fulfillment,
          name: 'COPILOT',
        }],
      });
    }

    ['DEVELOP', 'DESIGN', 'DATA_SCIENCE'].forEach((track) => {
      const active = [];
      const subTracks = stats[track] ? stats[track].subTracks || [] : [];

      if (stats[track].SRM) {
        subTracks.push({ ...stats[track].SRM, name: 'SRM' });
      }
      if (stats[track].MARATHON_MATCH) {
        subTracks.push({ ...stats[track].MARATHON_MATCH, name: 'MARATHON MATCH' });
      }

      subTracks.forEach((subtrack) => {
        if (isActiveSubtrack(subtrack)) {
          active.push({ ...subtrack, active: true });
        }
      });
      if (active.length > 0) {
        const sorted = _.orderBy(active, [
          s => s.wins,
          s => (s.rank ? s.rank.rating : 0),
        ], ['desc', 'desc']);
        activeTracks.push({ name: track, subTracks: sorted });
      }
    });

    return activeTracks;
  }

  handleResize() {
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  render() {
    const {
      achievements,
      copilot,
      country,
      info,
      stats,
    } = this.props;

    const {
      badgesModalOpen,
      isMobile,
      skillsExpanded,
    } = this.state;

    // Convert skills from object to an array for easier iteration
    let skills = _.map(this.props.skills, (skill, tagId) => ({ tagId, ...skill }));
    const showMoreButton = skills.length > MAX_SKILLS;
    if (!skillsExpanded) {
      skills = skills.slice(0, MAX_SKILLS);
    }

    const activeTracks = this.getActiveTracks();

    return (
      <div styleName="outer-container">
        {
          badgesModalOpen &&
          <BadgesModal
            achievements={achievements}
            handle={info.handle}
            isMobile={isMobile}
            photoURL={info.photoURL}
            onClose={() => this.setState({ badgesModalOpen: false })}
          />
        }
        <div styleName="profile-container">
          <div styleName="about-container">
            <div id="affix" styleName="profile-header-container">
              <Sticky
                bottomBoundary={document.body.scrollHeight - 250}
                enabled={!isMobile}
                top={10}
              >
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
              </Sticky>
            </div>
            <div styleName="profile-about-container">
              {
                _.isEmpty(skills) && _.isEmpty(activeTracks) &&
                <div styleName="empty-profile">
                  <h2>BEEP. BEEP. HELLO!</h2>
                  <Robot />
                  <p>Seems like this member doesn’t have much information to share yet.</p>
                  <PrimaryButton theme={style} to={`${config.URL.BASE}/community/members`}>VIEW OTHER MEMBERS</PrimaryButton>
                </div>
              }
              {
                !_.isEmpty(skills) &&
                <div id="profile-skills">
                  <div styleName="skills">
                    <h3 styleName="activity">Skills</h3>
                    <div styleName="list">
                      {
                        skills.map(({ tagId, tagName, hidden }) => (
                          !hidden &&
                          <div key={tagId} styleName="skill">
                            <Skill
                              tagId={tagId}
                              tagName={tagName}
                            />
                          </div>
                        ))
                      }
                    </div>
                    {
                      showMoreButton && !skillsExpanded &&
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
                    activeTracks.map(track => (
                      <div id={track.name} key={track.name} styleName="track">
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
                              <div styleName="name">{subtrack.name.replace('FIRST_2_FINISH', 'FIRST2FINISH').replace(/_/g, ' ')}</div>
                              {
                                subtrack.rank && !_.isNull(subtrack.rank.rating) &&
                                  <div styleName="ranking">
                                    <div style={{ color: getRatingColor(subtrack.rank.rating) }} styleName="number">{subtrack.rank.rating}</div>
                                    <div styleName="tag">Rating</div>
                                  </div>
                              }
                              {
                                (!subtrack.rank || _.isNull(subtrack.rank.rating)) &&
                                !subtrack.fulfillment &&
                                <div styleName="ranking">
                                  <div style={{ color: '#21b2f1' }} styleName="number">{subtrack.wins}</div>
                                  <div styleName="tag">Wins</div>
                                </div>
                              }
                              {
                                subtrack.fulfillment &&
                                <div styleName="ranking">
                                  <div style={{ color: '#a3a3ae' }} styleName="number">{`${subtrack.fulfillment}%`}</div>
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
