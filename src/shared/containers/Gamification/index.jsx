/**
 * Gamification container
 */
/* global analytics */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import SkillsNagModal from 'components/Gamification/SkillsNagModal';
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
    };

    this.onCancel = this.onCancel.bind(this);
    this.onCTA = this.onCTA.bind(this);
  }

  onCTA() {
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

  onCancel() {
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
    const now = new Date().getTime();

    if (!profile || profile.skills === null) {
      // profile & member skills still loading
      return null;
    }

    const lastNagTime = state.lastNagTime || cookies.get(`${REMIND_TIME_COOKIE_NAME}_${handle}`);
    // when to show the nag modal logic
    if (
      window.location.pathname !== '/settings/skills'
      && !state.showSkillsNagModal
      && (now - lastNagTime) > REMIND_TIME
      && keys(profile.skills).length < MIN_SKILLS_TO_REMIND
    ) {
      const newNagTime = new Date().getTime();
      this.setState({
        showSkillsNagModal: true,
        lastNagTime: `${newNagTime}`,
      });
      cookies.set(`${REMIND_TIME_COOKIE_NAME}_${handle}`, `${newNagTime}`, { expires: 7 });
    }

    return state.showSkillsNagModal ? (
      <SkillsNagModal
        handle={handle}
        skills={profile.skills}
        onCancel={this.onCancel}
        onCTA={this.onCTA}
        MIN_SKILLS_TO_REMIND={MIN_SKILLS_TO_REMIND}
      />
    ) : null;
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
    profile: state.profile,
    handle: state.auth && state.auth.user ? state.auth.user.handle : null,
  };
}

export default connect(
  mapStateToProps,
)(GamificationContainer);
