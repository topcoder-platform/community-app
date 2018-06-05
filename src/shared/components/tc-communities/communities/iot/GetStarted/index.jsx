/**
 * GetStarted static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';

import predixEducationalSrc from 'assets/themes/iot/get-started/predix-educ-challenges.png';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import Section from '../../../Section';
import JoinSection from '../JoinSection';
import TopBanner from './TopBanner';

import styles from './styles.scss';

export default function GetStarted({
  baseUrl,
}) {
  return (
    <main styleName="main">
      <TopBanner />
      <Section
        theme={{
          container: styles.educationalContainer,
        }}
      >
        <div styleName="columns">
          <div styleName="aside">
            <img src={predixEducationalSrc} alt="Predix Educational Challenges" styleName="image" />
          </div>
          <div styleName="content">
            <p>
              Over the next few weeks we’ll be working directly with GE Digital to roll out a series of educational challenges that will help you learn everything you need to know to be able to compete in development challenges for the industrial internet. You’ll need to register to be part our Topcoder Community for Predix and we’ll keep you up to date on all the latest challenges as they are released.
            </p>
            <div styleName="educationalButtonContainer">
              <PrimaryButton to={`${baseUrl}/compete`} onClick={evt => evt.preventDefault()}>Compete Now</PrimaryButton>
            </div>
          </div>
        </div>
      </Section>
      <Section
        title="Jump into the Predix Conversation"
        theme={{
          container: styles.discussContainer,
        }}
      >
        <div styleName="columns">
          <div styleName="content">
            <p>
              Lets discuss all things Predix and the Topcoder Community.<br />
              Let us know if you have any questions about Predix or the process to get started.
            </p>
          </div>
          <div styleName="aside">
            <div styleName="discussButtonContainer">
              <PrimaryButton to="https://apps.topcoder.com/forums/?module=ThreadList&forumID=607857" openNewTab>Discuss</PrimaryButton>
            </div>
          </div>
        </div>
      </Section>
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

GetStarted.propTypes = {
  baseUrl: PT.string.isRequired,
};
