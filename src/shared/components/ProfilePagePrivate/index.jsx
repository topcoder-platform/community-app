/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';

import Robot from 'assets/images/robot-happy.svg';

import ProfilePage404 from './ProfilePage404';
import './styles.scss';

class ProfilePagePrivate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
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

  handleResize() {
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  render() {
    const {
      handle,
    } = this.props;

    const {
      isMobile,
    } = this.state;

    return (
      <div styleName="outer-container">
        <div styleName="profile-container" role="main">
          <div styleName="about-container">
            <div styleName="profile-header-container">
              <Sticky
                bottomBoundary={document.body.scrollHeight - 250}
                enabled={!isMobile}
                top={10}
              >
                <div styleName="sticky-container">
                  <ProfilePage404
                    handle={handle}
                  />
                </div>
              </Sticky>
            </div>
            <div styleName="profile-about-container">
              <div styleName="empty-profile">
                <h2>
                  BEEP. BEEP. HELLO!
                </h2>
                <Robot />
                <p>
                  This member does not have a profile on this sub community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfilePagePrivate.defaultProps = {
  handle: '',
};

ProfilePagePrivate.propTypes = {
  handle: PT.string,
};

export default ProfilePagePrivate;
