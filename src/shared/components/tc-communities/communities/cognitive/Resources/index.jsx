/**
 * Static implementation of Resources page for Cognitive Community
 */
/* eslint-disable max-len */

import React from 'react';

import Banner from 'components/tc-communities/Banner';
import Section from 'components/tc-communities/Section';
import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import Text from 'components/tc-communities/Text';
import ResourceCard from 'components/tc-communities/ResourceCard';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import bannerStyle from './banner.scss';
import joinBannerStyle from './joinBanner.scss';
import cardStyle from './card.scss';

import style from './style.scss';

export default function Resources() {
  const ibmIcon = attr => <img src="/community-app-assets/themes/cognitive/resources/ibm-icon.png" alt="IBM Logo" {...attr} />;
  const supportIcon = attr => <img src="/community-app-assets/themes/cognitive/resources/support-icon.png" alt="Headset" {...attr} />;
  const forumIcon = attr => <img src="/community-app-assets/themes/cognitive/resources/forum-icon.png" alt="Messages" {...attr} />;

  return (
    <main>
      <Banner
        title="Resources"
        text="Fundamental Cognitive learning"
        imageSrc="/community-app-assets/themes/cognitive/resources/banner.jpg"
        theme={bannerStyle}
      />
      <Section
        theme={{
          content: style.cardSectionContent,
          container: style.cardSectionContainer,
        }}
      >
        <ResourceCard
          icon={ibmIcon}
          link={{
            title: 'developerWorks®',
            url: 'https://www.ibm.com/developerworks/learn/cognitive/',
          }}
          theme={{ container: cardStyle.containerIBM, ...cardStyle }}
        />
        <ResourceCard
          icon={supportIcon}
          link={{
            title: 'Support',
            url: 'mailto:support@topcoder.com',
          }}
          theme={{ container: cardStyle.containerSupport, ...cardStyle }}
        />
        <ResourceCard
          icon={forumIcon}
          link={{
            title: 'Topcoder Forum',
            url: 'https://apps.topcoder.com/forums/?module=ThreadList&forumID=609116',
          }}
          theme={{ container: cardStyle.containerForum, ...cardStyle }}
        />
      </Section>
      <Section
        title="Frequently Asked Questions"
        theme={{
          content: style.faqSectionContent,
          container: style.faqSectionContainer,
          title: style.faqTitle,
        }}
      >
        <Accordion>
          <AccordionItem title="Are there any prerequisites required to learn Cognitive computing?">
            <Text><p>No, there are no prerequisites to get started! All you need is a passion for technology and learning.</p></Text>
          </AccordionItem>
          <AccordionItem title="How do I get started with Cognitive?">
            <Text>
              <p>The best way to start is by exploring the IBM Watson and Cognitive sites. Here you will find videos, demos, APIs, and helpful resources for starting your Cognitive journey.  Sites:</p>
              <p>
                <a href="https://www.ibm.com/developerworks/learn/cognitive/">developerWorks</a>
              </p>
              <p>
                <a href="https://www.ibm.com/watson/">Watson</a>
              </p>
              <p>
                <a href="https://www.ibm.com/cognitive/">IBM Cognitive</a>
              </p>
              <p>
                <a href="http://research.ibm.com/cognitive-computing/">IBM Research</a>
              </p>
              <p>
                Next, check out the fun educational challenges here in the Topcoder Cognitive Community. These challenges are designed to help you learn everything you need to compete in future Cognitive development challenges. New educational challenges launch every few weeks, so be sure to check back often.
              </p>
            </Text>
          </AccordionItem>
          <AccordionItem title="What are the official rules for the Topcoder Open 2017 (TCO17) trip competition?">
            <Text>
              <h3>Cognitive Points</h3>
              <p>
                Every educational Cognitive challenge gives you an opportunity to earn Cognitive Points. Note that you can only earn Cognitive Points once for every educational challenge and paid challenges tagged with “IBM Cognitive” or “IBM Watson”.
              </p>
              <p>
                All successful submissions for the educational / fun challenges will be awarded 500 cognitive points.
              </p>
              <p>
                You may also earn Cognitive points by competing in prize-backed challenges that are tagged with “IBM Cognitive” or “IBM Watson”. The placement you earn in these challenges (non-F2F) will determine how many Cognitive points will be added to your total on the leaderboard:
              </p>
              <p>
                <ul>
                  <li>1st place: 500pts</li>
                  <li>2nd place: 350pts</li>
                  <li>3rd place+: 100pts</li>
                </ul>
              </p>
              <p>
                For challenges tagged with “IBM Cognitive” or “IBM Watson” that are First 2 Finish challenges:
              </p>
              <p>
                Winner: 250pts
              </p>
              <h3>Cognitive Leaderboard and Prize Schedule</h3>
              <p>
                All Cognitive Points earned between January 2017 and August 31, 2017 are eligible for the TCO17 trip. All challenges that start in August 2017 are counted.
              </p>
              <p>
                After August 2017, the leaderboard will reset. All Cognitive Points earned between September 2017 and August 31, 2018 are eligible for the TCO18 trip prize.
              </p>
              <p>
                After August 2018, the leaderboard will again reset. All Cognitive Points earned between September 2018 and August 31, 2019 are eligible for the TCO19 trip prize.
              </p>
              <h3>TCO Trip Prizes</h3>
              <p>
                The Topcoder Cognitive Community member with the most leaderboard points (on the “All” Leaderboard) at the conclusion of each prize period will win an all-expenses paid trip to the Topcoder Open, including airfare, lodging, ground transportation, and certain meals. More prize details will be presented to the winner upon confirmation. Winner must have participated and earned points in at least one fun/educational challenge.
              </p>
              <p>
                Members may only win one trip to the TCO each year. If the Cognitive leaderboard winner has already won a trip to TCO through other Topcoder competitions, the Cognitive TCO trip prize will be offered to the next highest point scorer in line.
              </p>
              <h3>Tiebreaker</h3>
              <p>
                If there is a tie for first place, all tied members will compete in a final challenge. This challenge will be Cognitive-specific and reviewed to determine the winner, who will be awarded the TCO trip.
              </p>
            </Text>
          </AccordionItem>
          <AccordionItem title="How do I create or extend my Cloud trial account?">
            <Text>
              <p>
                Each Topcoder challenge forum page will give a special url link and instructions on how to either sign up for a new, or extend your existing Cloud trial account.
              </p>
              <p>
                Once you register for a given challenge, you will be faced with three scenarios:
              </p>
              <h3>1) You do not have a Cloud trial account.</h3>
              <p>
                In that case, a 90-day free trial will be created on your behalf using your registration credentials. You will need to activate your account by clicking the link in the separate activation email sent to you from IBM Cloud.
              </p>
              <h3>2) You already have an on-going or current Cloud trial account.</h3>
              <p>
                You will be given a promo-code to extend its duration.
                To enter the code:
              </p>
              <p>
                1. Go to http://bluemix.net and log in to your account.<br />
                2. At the top of the page, there will be a dropdown showing the days remaining on your Cloud trial. Hover over and click “Add Promo Code”.<br />
                3. Paste the promo code in and click Ok.
              </p>
              <h3>3) You already have a Cloud account but:</h3>
              <p>
                1. It was a free trial that expired a while ago (over a year ago) and cannot be re-instated. Or, <br />
                2. You entered a credit card in at some point because it required you to do so and your Cloud trial account is now a “Pay-as-you-go” account.
              </p>
              <p>
                We are not able to revert your account to a trial, nor can we delete it at this stage. The only way to get the free 90-day trial on Cloud is with a brand new trial account. You will need to sign up following the instructions posted on the forum for each specific challenge. To get this free trial, you must use a new/different email address. We are sorry for the inconvenience.
              </p>
            </Text>
          </AccordionItem>
        </Accordion>
      </Section>
      <Banner
        title="Haven't joined our community yet?"
        imageSrc="/community-app-assets/themes/cognitive/resources/join-banner.jpg"
        theme={joinBannerStyle}
      ><JoinCommunity theme={{ link: joinBannerStyle.link }} label="Sign up now" /></Banner>
    </main>
  );
}
