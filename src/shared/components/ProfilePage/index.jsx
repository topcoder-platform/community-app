/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import Sticky from 'react-stickynode';

import Robot from 'assets/images/robot-happy.svg';

import BadgesModal from './BadgesModal';
import ExternalLink, { dataMap } from './ExternalLink';
import Header from './Header';
import Skill from './Skill';

import style from './styles.scss';
import StatsCategory from './StatsCategory';

// Number of skills to show before a 'VIEW MORE' button is created
const MAX_SKILLS = 10;

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
  } if (_.isNumber(subtrack.submissions)) {
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

    if (copilot && stats && stats.COPILOT && stats.COPILOT.fulfillment) {
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
      const subTracks = stats && stats[track] ? stats[track].subTracks || [] : [];

      if (stats && stats[track].SRM) {
        subTracks.push({ ...stats[track].SRM, name: 'SRM' });
      }
      if (stats && stats[track].MARATHON_MATCH) {
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
      externalAccounts,
      externalLinks,
      info,
      skills: propSkills,
      stats,
      lookupData,
    } = this.props;

    const {
      badgesModalOpen,
      isMobile,
      skillsExpanded,
    } = this.state;

    // get country
    let country = '';
    if (_.has(lookupData, 'countries') && lookupData.countries.length > 0) {
      const countryCode = _.isEmpty(_.get(info, 'homeCountryCode'))
        ? _.get(info, 'competitionCountryCode') : _.get(info, 'homeCountryCode');

      const result = _.find(lookupData.countries,
        c => countryCode && c.countryCode === countryCode.toUpperCase());
      country = _.isEmpty(result) ? '' : result.country;
    }

    // Convert skills from object to an array for easier iteration
    let skills = propSkills ? _.map(propSkills, (skill, tagId) => ({ tagId, ...skill })) : [];
    const showMoreButton = skills.length > MAX_SKILLS;
    if (!skillsExpanded) {
      skills = skills.slice(0, MAX_SKILLS);
    }

    let externals = _.map(_.pick(externalAccounts, _.map(dataMap, 'provider')), (data, type) => ({ type, data }));
    if (externalLinks) {
      externalLinks.map(data => externals.push(({ type: 'weblink', data })));
      externals = _.filter(externals, 'data');
      externals = _.sortBy(externals, 'type');
    }

    const activeTracks = this.getActiveTracks();

    return (
      <div styleName="outer-container">
        {
          badgesModalOpen
          && (
          <BadgesModal
            achievements={achievements}
            handle={info.handle}
            isMobile={isMobile}
            photoURL={info.photoURL}
            onClose={() => this.setState({ badgesModalOpen: false })}
          />
          )
        }
        <div styleName="profile-container">
          <div styleName="about-container">
            <div styleName="profile-header-container">
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
                    wins={_.get(stats, 'wins', 0)}
                  />
                </div>
              </Sticky>
            </div>
            <div styleName="profile-about-container">
              {
                _.isEmpty(skills) && _.isEmpty(activeTracks) && _.isEmpty(externals)
                && (
                <div styleName="empty-profile">
                  <h2>
BEEP. BEEP. HELLO!
                  </h2>
                  <Robot />
                  <p>
Seems like this member doesn’t have much information to share yet.
                  </p>
                </div>
                )
              }
              {
                !_.isEmpty(skills)
                && (
                <div id="profile-skills">
                  <div styleName="skills">
                    <h3 styleName="activity">
Skills
                    </h3>
                    <div styleName="list">
                      {
                        skills.map(({
                          tagId, tagName, hidden, sources,
                        }) => (
                          !hidden
                          && (
                          <div key={tagId} styleName="skill">
                            <Skill
                              tagId={tagId}
                              tagName={tagName}
                              isVerified={_.includes(sources, 'CHALLENGE')}
                            />
                          </div>
                          )
                        ))
                      }
                    </div>
                    {
                      showMoreButton && !skillsExpanded
                      && (
                      <PrimaryButton
                        onClick={() => this.setState({ skillsExpanded: true })}
                        theme={style}
                      >
VIEW ALL
                      </PrimaryButton>
                      )
                    }
                    {
                      skillsExpanded
                      && (
                      <PrimaryButton
                        onClick={() => this.setState({ skillsExpanded: false })}
                        theme={style}
                      >
VIEW LESS
                      </PrimaryButton>
                      )
                    }
                  </div>
                </div>
                )
              }
              {
                stats && (
                  <div id="profile-activity">
                    <StatsCategory handle={info.handle} stats={stats} />
                  </div>
                )
              }
              {
                !_.isEmpty(externals)
                && (
                <div styleName="external-links-container">
                  <h3>
On The Web
                  </h3>
                  <div styleName="external-links">
                    {
                      externals.map(external => !_.isEmpty(external.data) && (
                        <ExternalLink
                          data={external.data}
                          key={external.type !== 'weblink'
                            ? external.type : `${external.type}-${external.data.key}`}
                          type={external.type}
                        />
                      ))
                    }
                  </div>
                </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfilePage.defaultProps = {
  achievements: [],
  skills: null,
  stats: null,
};

ProfilePage.propTypes = {
  achievements: PT.arrayOf(PT.shape()),
  copilot: PT.bool.isRequired,
  externalAccounts: PT.shape().isRequired,
  externalLinks: PT.arrayOf(PT.shape()).isRequired,
  info: PT.shape().isRequired,
  skills: PT.shape(),
  stats: PT.shape(),
  lookupData: PT.shape().isRequired,
};

export default ProfilePage;
