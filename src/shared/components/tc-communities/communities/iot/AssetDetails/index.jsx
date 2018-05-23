/**
 * About static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';

import predixLogoSrc from 'assets/themes/iot/about/predix-logo.png';
import geLogoSrc from 'assets/themes/iot/about/ge-digital-logo.png';
import geniuslinkLogoSrc from 'assets/themes/iot/about/geniuslink-logo.png';

import Section from '../../../Section';
import JoinSection from '../JoinSection';
import SocialFooter from './SocialFooter';
import TechAndPlatformsSection from '../TechAndPlatformsSection';
import styles from './styles.scss';

const clicked = false;
const assetsItems = {
  "Predix–CityIQ-Google-Maps-PoC-App": {
    "title": "Predix – CityIQ / Google.Maps PoC App",
    "asset-details": ["This Topcoder12 challenge was focused on developing a simple proof-of-concept application that combines together services provided by CityIQ, ",
      <a href="https://www.predix.io/">Predix </a>,
      'and Google. Check out the ',
      <a href="https://www.topcoder.com/challenge-details/30059233/?type=develop&amp;noncache=true">original challenge</a>,
      ' and dive into the winning Asset details below.',
      <br/>,'Congratulations to ',
      <a href="https://www.topcoder.com/members/maxceem/">maxceem</a>,
      ' for taking first place in the challenge and providing us with his “winner’s asset details and description”.'],
    "Technologies": [{"value": "Angular 2+"}, {"value": "Google API"}, {"value": "JavaScript"}, {"value": "node.js"}, {"value": "Predix", "link":"sdf"}, {"value": "Reactjs"}],
    "Platforms": [{"value": "Google"}, {"value": "Node.js"}, {"value": "Predix", "link": " "}]
  },
  "Predix–Steam-Locomotive-NodeJS-Simulation": {
    "title": "Predix – Steam Locomotive NodeJS Simulation",
    "asset-details": ["This Topcoder12 challenge was focused on developing a simple proof-of-concept application that combines together services provided by CityIQ, ",
      <a href="https://www.predix.io/">Predix </a>,
      'and Google. Check out the ',
      <a href="https://www.topcoder.com/challenge-details/30059233/?type=develop&amp;noncache=true">original challenge</a>,
      ' and dive into the winning Asset details below.'],
    "Technologies": [{"value": "JavaScript"}, {"value": "node.js"}, {"value": "Predix", "link":"sdf"}],
    "Platforms": [{"value": "Google"}, {"value": "Node.js"}, {"value": "Predix", "link": " "}]
  },
  "Predix–Integration-with-Alexa-Voice-Service": {
    "title": "Predix – Integration with Alexa Voice Service",
    "asset-details": ["This Topcoder12 challenge was focused on developing a simple proof-of-concept application that combines together services provided by CityIQ, ",
      <a href="https://www.predix.io/">Predix </a>,
      'and Google. Check out the ',
      <a href="https://www.topcoder.com/challenge-details/30059233/?type=develop&amp;noncache=true">original challenge</a>,
      ' and dive into the winning Asset details below.'],
      "Technologies": [{"value": "Angular.js"}, {"value": "node.js"}, {"value": "Predix", "link":"sdf"}, {"value": "Reactjs"}],
      "Platforms": [{"value": "Node.js"}, {"value": "Predix", "link": " "}]
  },
  "Predix–Sensor-Emulator-in-C++": {
    "title": "Predix – Sensor Emulator in C++",
    "asset-details": ["This Topcoder12 challenge was focused on developing a simple proof-of-concept application that combines together services provided by CityIQ, ",
      <a href="https://www.predix.io/">Predix /</a>,
      'and Google. Check out the ',
      <a href="https://www.topcoder.com/challenge-details/30059233/?type=develop&amp;noncache=true">original challenge</a>,
      ' and dive into the winning Asset details below.'],
    "Technologies": [{"value": "C"}, {"value": "C++"}, {"value": "Predix", "link":"sdf"}],
    "Platforms": [{"value": "Predix", "link": " "}]
  }
}

const grid1 = "active"
export default function AssetDetails({
  baseUrl,
  id
}) {
  return (
    <main styleName="main">
      <div styleName="assets-header">
        <h1>{assetsItems[id].title}</h1>
      </div>
      <div styleName="assets-body-details">
        <div styleName="assets-body-row">
          <div styleName="main-assets-col">
            <div styleName="main-asset-body">
              <div styleName="asset-details">
                <h3 styleName="asset-section-title">Asset Details</h3>
                <p>{assetsItems[id]["asset-details"]}</p>
                <p>
                  <a href="https://github.com/topcoder-predix/cityiq-ui" styleName="github">https://github.com/topcoder-predix/cityiq-ui</a>
                </p>
              </div>

              <div styleName="asset-description">
                <h3 styleName="asset-section-title">Winner's Asset Details &amp; Description</h3>
                <p>This a simple proof of concept application that combines services provided by CityIQ (pedestrian and traffic data), Predix (assets and cloud), and Google (Maps and Places) to help a user to choose the best location for their new business.</p>
                <p><strong>How the application works</strong></p>
                <p>A user chooses a location in the Google Map by searching for a location using free-text query — processed by Google Places API or by simply clicking on the map. Also, the user chooses the type of place they’re interested in, in order to see possible competitors in the selected niche. The area around the location that will then be used to analyze data is determined using several methods. If the user used free-text search, then Google Places API returns some advised viewport to display search results. In that case, the area is determined based on that recommendation, but we make it square for further use. If the user simply clicked on the map, the area is chosen based on the current zoom level.</p>
                <p>The back end receives requests with the location, area, and business type, and retrieves data about pedestrians and traffic level in the area from the CityIQ service, as well as information about competitors from the Google Places API.</p>
                <p>CityIQ provides data from many sensors; each has around 3,400 types of traffic events and around 500 types of pedestrian events per day. To analyze an area, we can retrieve data from around 120 sensors, which forces us to restrict the duration of events that we can analyze to just 5-10 minutes, as we can get only 1,000 events per request. This way, we can still compare the level of traffic and pedestrian activities in various places in the analyzed area by displaying this data in the Google Map using heat maps.</p>
                <p>The Google Places API gives us 20 nearby places of the defined type. We display these places as points and use clusterization to handle situations where there are several places close to one another.</p>
                <p><strong>How we can further improve</strong></p>
                <p>There are still a lot of improvements that can be made to this app. In CityIQ, there is still a lot of data that can be used to analyze traffic and pedestrian levels, depending on the time of day and day of the week. Also, we can get up to 60 places from Google Places with some delay and add the ability to filter places based on the place’s price level.</p>
              </div>

            </div>

          </div>

          <div styleName="main-members-col">
            <div styleName="user-row">
              <div styleName="user-col">
                <div styleName="user-photo">
                  <img src="http://predix.topcoder.com/wp-content/uploads/sites/7/2017/10/maxceem.jpeg" alt=""/>
                </div>
              </div>
              <div styleName="user-col-2">
                <h4 styleName="asset-section-title">Topcoder Winner</h4>
                <div styleName="user-name">
                    <a href="https://www.topcoder.com/members/maxceem/">maxceem</a>
                </div>
                <div>Ukraine</div>
              </div>
            </div>
            <div styleName="technologies">
              <h4 styleName="asset-section-title">Technologies</h4>
                <TechAndPlatformsSection values={assetsItems[id].Technologies}/>
            </div>

            <div styleName="platforms">
              <h4 class="asset-section-title">Platforms</h4>
                <TechAndPlatformsSection values={assetsItems[id].Platforms}/>
            </div>
            <a href="https://github.com/topcoder-predix/cityiq-ui" styleName="btn-download">Download</a>

            <SocialFooter/>

          </div>

        </div>
      </div>
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

AssetDetails.propTypes = {
  baseUrl: PT.string.isRequired,
};
