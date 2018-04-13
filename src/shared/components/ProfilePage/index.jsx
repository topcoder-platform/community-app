/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badgesModalOpen: false,
      skillsExpanded: false,
    };
  }

  componentDidMount() {
    const {
      achievements,
      info,
      skills,
      stats,
    } = this.props;

    console.log(achievements);
    console.log(info);
    console.log(skills);
    console.log(stats);
  }

  render() {
    return (
      <div styleName="outer-container">
        <div styleName="page">
          Profile Here
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  achievements: PT.arrayOf(PT.shape()).isRequired,
  info: PT.shape().isRequired,
  skills: PT.shape().isRequired,
  stats: PT.shape().isRequired,
};

export default ProfilePage;
