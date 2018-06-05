/**
 * Join button section component for IoT community
 */
import React from 'react';
import PT from 'prop-types';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import Section from '../../../Section';

import styles from './styles.scss';

const JoinSection = ({ baseUrl }) => (
  <Section
    title="Are you ready for Predix?"
    theme={{
      container: styles.sectionContainer,
    }}
  >
    <div styleName="buttonContainer">
      <JoinCommunity competeUrl={`${baseUrl}/challenges?communityId=iot`} label="Join the Topcoder Community for Predix" />
    </div>
  </Section>
);

JoinSection.propTypes = {
  baseUrl: PT.string.isRequired,
};

export default JoinSection;
