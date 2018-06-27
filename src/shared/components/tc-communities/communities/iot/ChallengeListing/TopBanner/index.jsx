/**
 *   Top banner for IoT community complete page
 */
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import Section from 'components/tc-communities/Section';

import styles from './styles.scss';

const TopBanner = ({
  baseUrl,
}) => (
  <Section
    title="Have you joined the Topcoder Community for Predix?"
    theme={{
      container: styles.sectionContainer,
    }}
  >
    <div styleName="buttonContainer">
      <PrimaryButton to={`${baseUrl}/register`} onClick={evt => evt.preventDefault()}>
Join Now
      </PrimaryButton>
    </div>
  </Section>
);

TopBanner.propTypes = {
  baseUrl: PT.string.isRequired,
};

export default TopBanner;
