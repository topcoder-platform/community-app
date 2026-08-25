import React from 'react';
import MemberTalkCloudComponent from 'components/Contentful/MemberTalkCloud';
import { DEFAULT_AVATAR_URL } from 'utils/url';

import './style.scss';

export default function MemberTalkCloudExample() {
  return (
    <div styleName="container">
      <h1>Member Talk Cloud</h1>
      <MemberTalkCloudComponent
        content={[
          {
            imageURL: DEFAULT_AVATAR_URL,
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge.',
          },
          {
            imageURL: DEFAULT_AVATAR_URL,
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: DEFAULT_AVATAR_URL,
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
          },
          {
            imageURL: DEFAULT_AVATAR_URL,
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. member-talk-cloud',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: DEFAULT_AVATAR_URL,
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: DEFAULT_AVATAR_URL,
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
          },
        ]}
      />
    </div>
  );
}
