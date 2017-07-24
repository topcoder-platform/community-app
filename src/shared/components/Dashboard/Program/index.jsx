/* eslint jsx-a11y/no-static-element-interactions:0 */

import React from 'react';
import PT from 'prop-types';

import config from 'utils/config';
import IosCard from './IosCard';
import MemberIcon from '../../../../assets/images/Member-06.svg';
import './styles.scss';

const Program = (props) => {
  const { challenges, iosRegistered, registerIos } = props;
  return (
    <div styleName="programs">
      {
        iosRegistered &&
        <header>
          <h1 styleName="section-title">
            <span>iOS</span> Community
          </h1>
        </header>
      }
      <section>
        {
          !iosRegistered &&
          <div styleName="unregistered">
            <div styleName="empty-state-placeholder sky">
              <div styleName="title">iOS Community</div>
              <div styleName="content" />
              <div styleName="description">
                Earn iOS topcoder badges and exclusive access to iOS challenges,
                prizes and special community-related events.
              </div>
              <div styleName="help-links">
                <div styleName="help-link">
                  <a
                    onClick={registerIos}
                    className="tc-btn tc-btn-s tc-btn-ghost"
                    styleName="tc-btn"
                    title="Participate"
                  >Participate</a>
                </div>
                <div styleName="help-link">
                  <a href={config.URL.IOS} styleName="learn-more">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        }
        {
          iosRegistered &&
          <div styleName="registered">
            <div styleName="badge-and-challenges">
              <div styleName="registered-badge">
                <div styleName="flex-wrapper">
                  <p>iOS Community</p>
                  <div styleName="badge-timeline">
                    <MemberIcon />
                  </div>
                  <a
                    href={config.URL.IOS}
                    title="topcoder iOS Member Program"
                    className="tc-btn tc-btn-s tc-btn-ghost tc-btn-wide"
                  >
                    View Challenges
                  </a>
                </div>
              </div>
              {
                challenges.map(challenge => (
                  <div styleName="ios-card" key={challenge.id}>
                    <IosCard challenge={challenge} />
                  </div>
                ))
              }
            </div>
          </div>
        }
      </section>
    </div>
  );
};

Program.propTypes = {
  challenges: PT.arrayOf(PT.shape()).isRequired,
  iosRegistered: PT.bool.isRequired,
  registerIos: PT.func.isRequired,
};

export default Program;

