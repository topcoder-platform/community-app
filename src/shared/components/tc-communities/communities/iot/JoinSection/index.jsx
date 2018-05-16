/**
 * Join button section component for IoT community
 */
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import Section from '../../../Section';

import styles from './styles.scss';

const JoinSection = ({
  baseUrl,
}) => (
  <Section
    title="Are you ready for Predix?"
    theme={{
      container: styles.sectionContainer,
    }}
  >
    <div styleName="buttonContainer">
      <PrimaryButton to={`${baseUrl}/register`} onClick={evt => evt.preventDefault()}>Join the Topcoder Community for Predix</PrimaryButton>
    </div>
  </Section>
);

JoinSection.propTypes = {
  baseUrl: PT.string.isRequired,
};

export default JoinSection;
