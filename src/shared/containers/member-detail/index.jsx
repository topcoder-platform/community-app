/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */
/* global location */

import _ from 'lodash';
import Sticky from 'react-stickynode';
import memberActions from 'actions/members';
import UserDefaultAvatar from '../../../assets/images/ico-user-default.svg';
import { Link } from 'react-router-dom'

import DATA_SCIENCE_ICON from '../../../assets/images/ico-track-data.svg';
import DEVELOP_ICON from '../../../assets/images/ico-track-develop.svg';
import DESIGN_ICON from '../../../assets/images/ico-track-design.svg';
import COPILOT_ICON from '../../../assets/images/ico-track-copilot.svg';

import shortId from 'shortid';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import './styles.scss';

const TrackMap = {
  'DEVELOP': 'develop',
  'DESIGN': 'design',
  'DATA_SCIENCE': 'data',
  'COPILOT': 'copilot'
}

const RoleMap = {
  'DESIGN' : 'Designer',
  'DEVELOP': 'Developer',
  'DATA_SCIENCE': 'Data Scientist',
  'COPILOT': 'Copilot'
}

const SubTrackMap = {
  'BUG_HUNT' : 'BUG HUNT',
  'ASSEMBLY_COMPETITION': 'ASSEMBLY',
  'UI_PROTOTYPE_COMPETITION': 'UI PROTOTYPE COMPETITION',
  'FIRST_2_FINISH': 'FIRST2FINISH',
  'CODE': 'CODE',
  'DESIGN_FIRST_2_FINISH': 'DESIGN FIRST2FINISH',
  'LOGO_DESIGN': 'LOGO DESIGN',
  'SRM': 'SRM',
  'COPILOT': 'COPILOT'
}

const SkillShowNumber = 10;

const ratingToColor = (rating) => {
  var colors = [
    // grey
    {
      'color': '#9D9FA0',
      'darkerColor': '#9D9FA0',
      'start': 0,
      'end': 899
    },
    // green
    {
      'color': '#69C329',
      'darkerColor': '#69C329',
      'start': 900,
      'end': 1199
    },
    // blue
    {
      'color': '#616BD5',
      'darkerColor': '#616BD5',
      'start': 1200,
      'end': 1499
    },
    // yellow
    {
      'color': '#FCD617',
      'darkerColor': '#FCD617',
      'start': 1500,
      'end': 2199
    },
    // red
    {
      'color': '#EF3A3A',
      'darkerColor': '#EF3A3A',
      'start': 2200,
      'end': Infinity
    }
  ]

    // in case rating is a number formatted string
  if (typeof rating === 'string')
    rating = parseInt(rating.replace(',', ''))
  colors = colors.filter(function(color) {
    return rating !== null && rating >= color.start && rating <= color.end
  })
  return colors[0] && colors[0].color || 'black'
}

const Track = ({track}) => {
  const wins = track.wins;

  const renderSubTrack = (item, i) => {
    const firstStyle = i != 0 ? "subtrack" : "subtrack first";
    const isRating = Boolean(item.rank && item.rank.rating);
    const ratingColor = isRating ? ratingToColor(item.rank.rating) : "";
    const isFulfillment = Boolean(item.name == 'COPILOT');

    return (
      <a styleName={firstStyle}>
        <div styleName="name">{SubTrackMap[item.name]}</div>
        {isFulfillment &&
        <div styleName="ranking">
          <div styleName="number">{item.fulfillment}%</div>
          <div styleName="tag">Fulfillment</div>
        </div>
        }
        {!isFulfillment && isRating &&
        <div styleName="ranking">
          <div styleName="number" style={{ color: `${ratingColor}` }}>{item.rank.rating}</div>
          <div styleName="tag">Rating</div>
        </div>
        }
        {!isFulfillment &&!isRating &&
        <div styleName="ranking">
          <div styleName="number" style={{ color: `#21B2F1` }}>{item.wins}</div>
          <div styleName="tag">Wins</div>
        </div>
        }
      </a>
    )
  };

  return (
    <div styleName="track">
      <div styleName="name"> 
        {track.trackName == 'DATA_SCIENCE' && <DATA_SCIENCE_ICON/>}
        {track.trackName == 'DEVELOP' && <DEVELOP_ICON/>}
        {track.trackName == 'DESIGN' && <DESIGN_ICON/>}
        {track.trackName == 'COPILOT' && <COPILOT_ICON/>}
        <span>{track.trackName} ACTIVITY</span>
      </div>
      {track.subTracks && track.subTracks.map(renderSubTrack)}
      {track.SRM && [_.assign({}, track.SRM, {name: 'SRM'})].map(renderSubTrack)}
      {track.trackName == 'COPILOT' && [{name: 'COPILOT', fulfillment: track.fulfillment}].map(renderSubTrack)}
    </div>
  )
}

Track.propTypes = {
  track: PT.shape().isRequired,
};

class MemberDetailPageContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {showAllSkill: false};
    this.onViewAll = this.onViewAll.bind(this);
    this.onViewLess = this.onViewLess.bind(this);
  }

  componentDidMount() {
    const {
      handle,
      auth
    } = this.props;

    this.props.loadMemberProfile(handle, auth.tokenV3);
    this.props.loadMemberStat(handle, auth.tokenV3);
    this.props.loadMemberSkill(handle, auth.tokenV3);
  }

  onViewAll() {
    this.setState({showAllSkill: true});
  }

  onViewLess() {
    this.setState({showAllSkill: false});
  }

  render() {
    const {
			auth,
      handle,
      stats,
      profile,
      skills,
    } = this.props;

    const numWins = stats.wins;

    const trackToDisplay = [];
    _.map(_.keys(TrackMap), e => {
      if (stats && stats[e])
      {
        trackToDisplay.push(_.assign({}, stats[e], {trackName: e}));
      }
    });

    const showWin = numWins ? true : false;
		const showEditProfileLink = Boolean(auth.user && auth.user.handle == handle)
    const showTracks = Boolean(profile.tracks && profile.tracks.length > 0)
    const forumLink = 'https://apps.topcoder-dev.com/forums/?module=History&userID=' + profile.userId;

    const skillsDataRaw = _.values(_.mapValues(skills.skills, (value, key) => _.assign({}, value, {id : key})))
    const skillsData = this.state.showAllSkill ? skillsDataRaw : _.slice(skillsDataRaw, 0, SkillShowNumber)

    //<div className={`track-icon ${trackIconClass}`}>
    const mapTrack = (item, i) => {
      const trackIconClass = TrackMap[item] + '-icon'
      return (
        <div styleName="track" key={`${item}-${i}`}>
          <div styleName={`track-icon ${trackIconClass}`}>
            <div></div>
          </div>
          <div styleName="text">{RoleMap[item]}</div>
        </div>
      )
    }

    const mapSkill = (item, i) => {
      const srcUrl = 'https://s3.amazonaws.com/app.topcoder.com/images/skills/id-' + item.id + '.svg'
      return (
        <div styleName="skill" key={`${item}-${i}`}>
          <div styleName="skill-tile">
            <div styleName="skill-icon">
              <img src={srcUrl} /> 
            </div>
            <div styleName="name">{item.tagName}</div>
          </div>
        </div>
      )
    }

    return (
      <div styleName="outer-container">
        <div styleName="about-container">
          <Sticky styleName="profile-header-container">
            <div styleName="sticky-container">
              <div styleName="profile-widget-directive">
                <div>
                  {profile.photoURL && <img src={profile.photoURL} styleName="profile-circle"/>}
                  {!profile.photoURL && <UserDefaultAvatar styleName="profile-circle"/>}
                </div>
                <div styleName="info">
                  <h1 styleName="handle">{handle}</h1>
                  {profile.competitionCountryCode &&
                    <h3>{ profile.competitionCountryCode }
                    {showWin && <span>&nbsp;|&nbsp;</span>}
                    {showWin && <span>{numWins}</span>}
                    </h3>
                  }
                  {profile.startMonth &&
                  <h3 styleName="tenure"> Member Since {profile.startMonth}</h3>
                  }
                  <Link to="/profile" className="tc-btn tc-btn-s"> Edit Profile</Link>
                </div>

                {showTracks &&
                <div styleName="tracks-links">
                  <div styleName="tracks">
                    {profile.tracks.map(mapTrack)}
                  </div>
                </div>
                }
                
                {profile.description &&
                  <p styleName="description">{profile.description}</p>
                }

                <div styleName="links">
                  {profile.badges && profile.badges.Achievements && profile.badges.Achievements.length > 0 &&
                  <a styleName="link" href="">Badges</a>
                  }
                  <a styleName="link" href={forumLink}>Forum Posts</a>
                </div>
              </div>
            </div>
          </Sticky>
          <div styleName="profile-about-container">
            <div styleName="skills">
              {skillsData && skillsData.length != 0 &&
                <h3 styleName="activity">Skills</h3>
              }
              {skillsData && skillsData.length != 0 &&
                <div styleName="list">{skillsData.map(mapSkill)}</div>
              }
              {skillsData && skillsData.length != 0 && skillsData && skillsData.length != 0 && !this.state.showAllSkill && <button className="tc-btn tc-btn-s" onClick={this.onViewAll}>VIEW ALL</button>}
              {this.state.showAllSkill && <button className="tc-btn tc-btn-s" onClick={this.onViewLess}>VIEW LESS</button>}
            </div>
            
            <section className="tc-section">
              <div styleName="categories">
                {trackToDisplay.map((item, i) => <Track track={item} key={`${item}-${i}`}></Track>)}
              </div>
            </section>
            
          </div>
        </div>
      </div>
    );
  }
}

MemberDetailPageContainer.defaultProps = {
  handle: 'none',
  stats: {},
  profile: {},
  skills: {},
};

MemberDetailPageContainer.propTypes = {
  auth: PT.shape().isRequired,
  stats: PT.shape(),
  profile: PT.shape(),
  skills: PT.shape(),
  handle: PT.string,
  loadMemberProfile: PT.func.isRequired,
  loadMemberStat: PT.func.isRequired,
  loadMemberSkill: PT.func.isRequired,
};

function mapStateToProps(state, props) {
  const userHandle = props.match.params.handle;
  const member = state.members[userHandle] || {};
  const stats = member.stats || {};
  const profile = member.profile || {};
  const skills = member.skills || {};
  return {
    auth: state.auth,
    stats: stats.data,
    profile: profile.data,
    skills: skills.data,
    handle: props.match.params.handle,
  };
}

const mapDispatchToProps = (dispatch) => {
  const members = memberActions.members;
  return {
    loadMemberProfile: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getProfileInit(handle, uuid));
      dispatch(members.getProfileDone(handle, uuid, tokenV3));
    },
    loadMemberStat: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getStatsInit(handle, uuid));
      dispatch(members.getStatsDone(handle, uuid, tokenV3));
    },
    loadMemberSkill: (handle, tokenV3) => {
      const uuid = shortId();
      dispatch(members.getSkillsInit(handle, uuid));
      dispatch(members.getSkillsDone(handle, uuid, tokenV3));
    },
  };
};

const MemberDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberDetailPageContainer);

export default MemberDetailContainer;
