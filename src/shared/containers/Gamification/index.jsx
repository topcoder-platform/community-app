/**
 * Gamification container
 */
/* global analytics */
/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SkillsNagModal from 'components/Gamification/SkillsNagModal';
import YouGotSkillsModal from 'components/Gamification/YouGotSkillsModal';
import { keys } from 'lodash';
import cookies from 'browser-cookies';

const REMIND_TIME_COOKIE_NAME = 'tc_skills_remind_time';
const REMIND_TIME = 604800000; // a week
export const MIN_SKILLS_TO_REMIND = 5;

class GamificationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSkillsNagModal: false,
      showYouGotSkillsModal: false,
      lastNagTime: cookies.get(`${REMIND_TIME_COOKIE_NAME}_${props.handle}`),
    };

    this.onSkillsNagModalCancel = this.onSkillsNagModalCancel.bind(this);
    this.onSkillsNagModalCTA = this.onSkillsNagModalCTA.bind(this);
    this.onYouGotSkillsModalCancel = this.onYouGotSkillsModalCancel.bind(this);
    this.onYouGotSkillsModalCTA = this.onYouGotSkillsModalCTA.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { profile: prevProfile } = prevProps;
    const { profile, handle } = this.props;
    const { state } = this;
    const { lastNagTime } = state;
    const now = new Date().getTime();

    // when to show YouGotSkills modal
    if (
      prevProfile
      && prevProfile.skills !== null
      && profile
      && profile.skills !== null
      && keys(prevProfile.skills).length < MIN_SKILLS_TO_REMIND
      && keys(profile.skills).length >= MIN_SKILLS_TO_REMIND
      && state.showYouGotSkillsModal === false
    ) {
      this.setState({
        ...state,
        showYouGotSkillsModal: true,
      });
    }

    // when to show the nag modal
    if (
      window.location.pathname !== '/settings/skills'
      && !state.showSkillsNagModal
      && (now - lastNagTime) > REMIND_TIME
      && profile
      && profile.skills !== null
      && keys(profile.skills).length < MIN_SKILLS_TO_REMIND
    ) {
      this.setState({
        showSkillsNagModal: true,
        lastNagTime: `${now}`,
      });
      cookies.set(`${REMIND_TIME_COOKIE_NAME}_${handle}`, `${now}`, { expires: 7 });
    }
  }

  onYouGotSkillsModalCTA() {
    const { profile, handle } = this.props;
    const { state } = this;
    this.setState({
      ...state,
      showYouGotSkillsModal: false,
    });
    // track the CTA event
    analytics.track('Member clicked CTA button on YouGotSkills modal', {
      ...profile,
    });
    // Send them to profile page
    window.location = `/members/${handle}`;
  }

  onYouGotSkillsModalCancel() {
    const { state } = this;
    this.setState({
      ...state,
      showYouGotSkillsModal: false,
    });
  }

  onSkillsNagModalCTA() {
    const { profile } = this.props;
    const { state } = this;
    this.setState({
      ...state,
      showSkillsNagModal: false,
    });
    // track the CTA event
    analytics.track('Member clicked CTA button on skills remind modal', {
      ...profile,
    });
    // navigate to skills
    window.location = '/settings/skills';
  }

  onSkillsNagModalCancel() {
    const { profile } = this.props;
    const { state } = this;
    this.setState({
      ...state,
      showSkillsNagModal: false,
    });
    // track the cancel event
    analytics.track('Member canceled skills remind modal', {
      ...profile,
    });
  }

  render() {
    const { profile, handle } = this.props;
    const { state } = this;

    if (!profile) {
      return null;
    }

    return (
      <React.Fragment>
        {
          state.showSkillsNagModal && (
            <SkillsNagModal
              handle={handle}
              skills={profile.skills}
              onCancel={this.onSkillsNagModalCancel}
              onCTA={this.onSkillsNagModalCTA}
              MIN_SKILLS_TO_REMIND={MIN_SKILLS_TO_REMIND}
            />
          )
        }
        {
          state.showYouGotSkillsModal && (
            <YouGotSkillsModal
              MIN_SKILLS_TO_REMIND={MIN_SKILLS_TO_REMIND}
              onCancel={this.onYouGotSkillsModalCancel}
              onCTA={this.onYouGotSkillsModalCTA}
            />
          )
        }
      </React.Fragment>
    );
  }
}

GamificationContainer.defaultProps = {
  profile: null,
  handle: null,
};

GamificationContainer.propTypes = {
  profile: PT.shape(),
  handle: PT.string,
};

function mapStateToProps(state) {
  return {
    profile: (
      state.auth
      && state.auth.user
      && (
        !state.profile.profileForHandle
        || state.profile.profileForHandle === state.auth.user.handle
      ))
      ? state.profile : null,
    handle: state.auth && state.auth.user ? state.auth.user.handle : null,
  };
}

export default connect(
  mapStateToProps,
)(GamificationContainer);
