import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import React from 'react';
import { utils } from 'topcoder-react-utils';

import newsletterImg from
  'assets/images/communities/cognitive/newsletter.jpg';

import theme from './theme.scss';

export default function NewsSignup() {
  return (
    <NewsletterSignup
      apikey={utils.config.NEWSLETTER_SIGNUP.COGNITIVE.APIKEY}
      theme={theme}
      title="Sign up for the Cognitive Newsletter"
      text="Don’t miss the latest Topcoder cognitive challenges and resources!"
      imageSrc={newsletterImg}
      url={utils.config.NEWSLETTER_SIGNUP.COGNITIVE.URL}
    />
  );
}
