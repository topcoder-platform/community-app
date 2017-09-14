/**
 * The message to show instead of the challenge listing to visitors, who are
 * not members of community, when they come to the challenge listing.
 */

import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import React from 'react';
import Section from 'components/tc-communities/Section';
import style from './style.scss';

export default function RegisterToSee() {
  return (
    <Section
      theme={{
        content: style.message,
      }}
    >
      <div>
        Join now to participate in exclusive blockchain challenges!
        <JoinCommunity />
      </div>
    </Section>
  );
}
