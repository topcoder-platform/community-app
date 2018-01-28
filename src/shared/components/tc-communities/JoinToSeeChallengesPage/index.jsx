/**
 * The page showing "Only community members can see the challenges" message,
 * and a button to login / join the community.
 */

import React from 'react';

import JoinCommuity from '../JoinCommunity';
import './style.scss';

export default function JoinToSeeChallengesPage() {
  return (
    <div styleName="container">
      <h1
        styleName="message"
      >Only members of community can see the challenges</h1>
      <JoinCommuity />
    </div>
  );
}
