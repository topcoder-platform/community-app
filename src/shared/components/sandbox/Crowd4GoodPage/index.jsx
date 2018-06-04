/**
 * A temporary implementation of the Crowd for Good page.
 */

import React from 'react';
import BannerImage from 'assets/images/crowd-for-good/crowd-for-good.jpg';
import './style.scss';

export default function Crowd4GoodPage() {
  return (
    <div styleName="container">
      <img alt="Banner" src={BannerImage} styleName="banner" />
      <h1>Crowd for Good - A Topcoder Initiative</h1>
      <p>
        Crowdsourcing has come a long way since the last 10 years. For the most
        part, it has become become a reliable and cost-effective way for
        enterprises and business organizations to build software solutions
        catering to very specific requirements.
      </p>
      <p>
        However, crowdsourcing solutions aren’t just limited to creating only
        business solutions today. Companies are using the power of the crowd to
        build solutions that can improve lives across the globe. It is also
        effective in providing quality solutions for local businesses and
        markets.
      </p>
      <p>
        2016 saw the Topcoder Community creating definitive business solutions
        and tools (and also hitting the 1 million members mark). Among the many
        things that Topcoder dabbled in, was partnering with Hewlett Packard
        Enterprise (HPE) for the Living Progress Challenge.
      </p>
      <p>
        The Living Progress Challenge was an innovation program that sought to
        create digital solutions that would improve people’s lives across the
        globe. This became a flagship project which kicked off Topcoder’s Crowd
        for Good Initiative.
      </p>
      <p>
        Topcoder is expanding the possibilities of getting its community to
        explore the Crowd for Good initiative further.
      </p>
    </div>
  );
}
