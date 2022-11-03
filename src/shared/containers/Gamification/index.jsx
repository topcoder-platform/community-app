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
import { config } from 'topcoder-react-utils';

const REMIND_TIME_COOKIE_NAME = 'tc_skills_remind_time';
const REMIND_TIME = 604800000; // a week
const MIN_SKILLS_TO_REMIND = 5;

class GamificationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSkillsNagModal: false,
      lastNagTime: cookies.get(REMIND_TIME_COOKIE_NAME),
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
    window.location = `${config.URL.BASE}/settings/skills`;
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
    const { profile } = this.props;
    const { state } = this;
    const now = new Date().getTime();

    if (!profile || profile.skills === null) {
      // member skills still loading
      return null;
    }

    // when to show the nag modal logic
    if (
      !state.showSkillsNagModal
      && (now - state.lastNagTime) > REMIND_TIME
      && keys(profile.skills).length < MIN_SKILLS_TO_REMIND
    ) {
      const newNagTime = new Date().getTime();
      this.setState({
        showSkillsNagModal: true,
        lastNagTime: `${newNagTime}`,
      });
      cookies.set(REMIND_TIME_COOKIE_NAME, `${newNagTime}`);
    }

    return state.showSkillsNagModal ? (
      <SkillsNagModal
        skills={profile.skills}
        onCancel={this.onCancel}
        onCTA={this.onCTA}
      />
    ) : null;
  }
}

GamificationContainer.defaultProps = {
  profile: null,
};

GamificationContainer.propTypes = {
  profile: PT.shape(),
};

function mapStateToProps(state) {
  return {
    profile: state.profile,
  };
}

export default connect(
  mapStateToProps,
)(GamificationContainer);
