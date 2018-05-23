/**
 * About static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';


import styles from './styles.scss';

const clicked = false;
const assetsItems = [
  {
    "href": "https://predix.topcoder.com/feed/",
    "src": "http://predix.topcoder.com/wp-content/plugins/ultimate-social-media-icons/images/icons_theme/thin/thin_rss.png"
  },
  {
    "href": "http://www.specificfeeds.com/widgets/emailSubscribeEncFeed",
    "src": "http://predix.topcoder.com/wp-content/plugins/ultimate-social-media-icons/images/icons_theme/thin/thin_email.png"
  },
  {
    "href": "http://www.specificfeeds.com/widgets/emailSubscribeEncFeed",
    "src": "http://predix.topcoder.com/wp-content/plugins/ultimate-social-media-icons/images/icons_theme/thin/thin_facebook.png"
  },
  {
    "href": "http://www.specificfeeds.com/widgets/emailSubscribeEncFeed",
    "src": "http://predix.topcoder.com/wp-content/plugins/ultimate-social-media-icons/images/icons_theme/thin/thin_google.png"
  },
  {
    "href": "http://www.specificfeeds.com/widgets/emailSubscribeEncFeed",
    "src": "http://predix.topcoder.com/wp-content/plugins/ultimate-social-media-icons/images/icons_theme/thin/thin_twitter.png"
  },
  {
    "href": "http://www.specificfeeds.com/widgets/emailSubscribeEncFeed",
    "src": "http://predix.topcoder.com/wp-content/plugins/ultimate-social-media-icons/images/icons_theme/thin/thin_linkedin.png"
  }
]

const SocialFooter = () => (
  <div styleName="social-sharing">
    {
      assetsItems.map((item, index) => {
        return (
          <a styleName="sfsi_wicons" href={item.href}>
            <img src={item.src} width="40" height="40"/>
          </a>
        )
      })
    }
  </div>
);


export default SocialFooter;
