import React from 'react';
import MemberTalkCloudComponent from 'components/Contentful/MemberTalkCloud';

import './style.scss';

export default function MemberTalkCloudExample() {
  return (
    <div styleName="container">
      <h1>Member Talk Cloud</h1>
      <MemberTalkCloudComponent
        content={[
          {
            imageURL: 'https://topcoder-prod-media.s3.amazonaws.com/member/profile/mahestro-1614606365204.png',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge.',
          },
          {
            imageURL: 'https://www.topcoder.com/i/m/DaraK.png',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: 'https://topcoder-prod-media.s3.amazonaws.com/member/profile/marioskranitsas-1619211153092.png',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
          },
          {
            imageURL: 'https://topcoder-prod-media.s3.amazonaws.com/member/profile/yoki-1576813127532.png',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. member-talk-cloud',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: 'https://topcoder-prod-media.s3.amazonaws.com/member/profile/TonyJ-1549037477408.png',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: 'https://topcoder-prod-media.s3.amazonaws.com/member/profile/thomaskranitsas-1600088191936.png',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
          },
        ]}
      />
    </div>
  );
}
