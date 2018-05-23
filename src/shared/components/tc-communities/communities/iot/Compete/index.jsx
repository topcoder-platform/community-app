/**
 * Compete static page of IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import PT from 'prop-types';

import predixLogoSrc from 'assets/themes/iot/about/predix-logo.png';
import geLogoSrc from 'assets/themes/iot/about/ge-digital-logo.png';
import geniuslinkLogoSrc from 'assets/themes/iot/about/geniuslink-logo.png';

import Section from '../../../Section';
import JoinSection from '../JoinSection';
import Header from './Header';
import ChallengeItem from './ChallengeItem';
import styles from './styles.scss';


const pastChallenges = [
  {
    "title": "Predix - CityIQ - Event organizer helper - Frontend",
    "challenge": "Code",
    "technologies": ["Angular 2+", "JavaScript", "Node.js", "Predix", "ReactJS"],
    "platforms": ["NodeJS", "Predix"],
    "phaseEnds": "Dec 4th 2017, 09:06 am EST",
    "registrants": 35,
    "submissions": 2,
    "forum": "POSTS"
  },
  {
    "title": "Predix - CityIQ - Event organizer helper - Backend",
    "challenge": "Code",
    "technologies": ["API", "Express", "JavaScript", "Node.js", "Predix", "REST"],
    "platforms": ["NodeJS", "Predix"],
    "phaseEnds": "Nov 10th 2017, 09:08 am EST",
    "registrants": 36,
    "submissions": 1,
    "forum": "POSTS"
  },
  {
    "title": "Predix - Digital Volcano",
    "challenge": "Code",
    "technologies": ["Predix", "Python"],
    "platforms": ["Predix"],
    "phaseEnds": "Oct 29th 2017, 09:03 am EDT",
    "registrants": 45,
    "submissions": 3,
    "forum": "POSTS"
  },
  {
    "title": "Predix - CityIQ / Google.Maps PoC App",
    "challenge": "Code",
    "technologies": ["Angular 2+", "Express", "Google API", "JavaScript", "Node.js", "Predix", "ReactJS"],
    "platforms": ["Google", "NodeJS", "Predix"],
    "phaseEnds": "Sep 25th 2017, 09:04 am EDT",
    "registrants": 55,
    "submissions": 1,
    "forum": "POSTS"
  },
  {
    "title": "Predix - Integration with Alexa Voice Service",
    "challenge": "Code",
    "technologies": ["Angular 2+", "Angular.js (1.0)", "Express", "Node.js", "Predix", "ReactJS"],
    "platforms": ["NodeJS", "Predix"],
    "phaseEnds": "Sep 5th 2017, 09:02 am EDT",
    "registrants": 47,
    "submissions": 2,
    "forum": "POSTS"
  }
]

export default function Compete({
  baseUrl,
}) {
  return (
    <main styleName="main">
      <Header/>
      <div styleName="past-challenges">
        <div styleName="container">
          <hr/>
          <h2>Past Challenges</h2>
          <hr/>
          <ul>
            {
              pastChallenges.map((item, index)=>{
                return (
                  <li>
                    <ChallengeItem key={index} challenge={item}/>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <JoinSection
        baseUrl={baseUrl}
      />
    </main>
  );
}

Compete.propTypes = {
  baseUrl: PT.string.isRequired,
};
