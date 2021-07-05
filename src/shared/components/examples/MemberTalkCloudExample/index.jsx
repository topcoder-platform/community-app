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
            imageURL: 'https://images.ctfassets.net/b5f1djy59z3a/5DduTA1NccThQUDo6t1EDy/265ca4e40996fd42986705a9282f1f2b/C5F3D804-0BB9-4F49-A506-710CEFA62B62.webp',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge.',
          },
          {
            imageURL: 'https://images.ctfassets.net/b5f1djy59z3a/20Dhy50FCc6bGt4SxvaJXO/abf374b093494b29019b963d1fb70938/7DFE819E-485E-4925-B816-CDE90B4AFC8B.webp',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
            ReadMoreURL: 'www.topcoder.com',
            ReadMoreText: 'TEXT',
          },
          {
            imageURL: 'https://images.ctfassets.net/b5f1djy59z3a/5ofyTFe5e7JwERCTdtN7Qw/69c94768bfa9d5ef64cce28d9ab82efe/B8459E56-3F12-4732-9918-9B61436A1E68.webp',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
          },
          {
            imageURL: 'https://images.ctfassets.net/b5f1djy59z3a/6ZfH70H3m4mcUpyf8FhwIg/24706d48a3fdda1cfc435ee33b519b36/DAA61642-AD78-4A42-9086-60C0AC9BD9B0.webp',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. member-talk-cloud',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: 'https://images.ctfassets.net/b5f1djy59z3a/68fFchpHv5N4ww0DX7BjhK/f1a98135eab7586b1dbf46d3d79d7750/18CF78FB-D7F2-4DBA-B44C-0EB866642A21.webp',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
            ReadMoreURL: 'www.topcoder.com',
          },
          {
            imageURL: 'https://images.ctfassets.net/b5f1djy59z3a/3jZouACTJ4VctLmdUAQ0Ce/6b223a906523909bd41136e591b0f6e4/63ABD44E-CE36-4D9A-9EE3-23BFA55374BF.webp',
            text: 'I read on social media about the TCO event and was curious about how to qualify for it, so I joined a challenge and got a 3rd place in my first challenge. It gave me an adrenaline rush and it was my first love with Topcoder.',
          },
        ]}
      />
    </div>
  );
}
