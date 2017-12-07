import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import React from 'react';

import newsletterImg from
  'assets/images/communities/cognitive/newsletter.jpg';

import theme from './theme.scss';

export default function NewsSignup() {
  return (
    <NewsletterSignup
      theme={theme}
      title="Sign up for the Cognitive Newsletter"
      text="Don’t miss the latest Topcoder cognitive challenges and resources!"
      imageSrc={newsletterImg}
    />
  );
}
