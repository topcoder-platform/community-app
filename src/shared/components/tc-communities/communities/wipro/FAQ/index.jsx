/**
 * Static implementation of Learn page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
// import { Link } from 'react-router-dom';
import Section from 'components/tc-communities/Section';
import VideoCard from 'components/tc-communities/VideoCard';
/*
import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
*/
import Banner from 'components/tc-communities/Banner';
/*
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import ArticleCard from 'components/tc-communities/ArticleCard';
import LinksCard from 'components/tc-communities/LinksCard';
import Text from 'components/tc-communities/Text';
*/

import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import Text from 'components/tc-communities/Text';
import { ThemeProvider } from 'react-css-super-themr';

import theme from '../theme';
import style from './style.scss';

export default function Learn() {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <Banner
          title="FAQ"
          text="The answers to questions you may have."
          theme={{
            container: style.bannerContainer,
            content: style.bannerContent,
            contentInner: style.bannerContentInner,
          }}
          imageSrc="/community-app-assets/themes/wipro/learn/banner.jpg"
        />
        <Section
          title="Tutorials"
          theme={{
            content: style.tutorialsContent,
            title: style.tutorialsTitle,
          }}
        >
          <VideoCard
            title="Introduction"
            url="https://s3.amazonaws.com/topcoder-prod-media/hybrid/topgear/1.Wipro-Crowdsourcing-Challenge-Intro.mp4"
          />
          <VideoCard
            title="Registration"
            url="https://s3.amazonaws.com/topcoder-prod-media/hybrid/topgear/2.Wipro-Crowdsourcing-Site-Registration.mp4"
          />
          <VideoCard
            title="Challenge Navigation"
            url="https://s3.amazonaws.com/topcoder-prod-media/hybrid/topgear/3.Wipro-Crowdsourcing-Challenge-Navigation.mp4"
          />
          <VideoCard
            title="Joining a Challenge"
            url="https://s3.amazonaws.com/topcoder-prod-media/hybrid/topgear/4.Join-Challenge.mp4"
          />
          <VideoCard
            title="Submission"
            url="https://s3.amazonaws.com/topcoder-prod-media/hybrid/topgear/5.Challenge-Submission.mp4"
          />
        </Section>
        <Section
          title="Frequently Asked Questions"
          theme={{
            container: style.faqContainer,
            content: style.faqContent,
            title: style.faqTitle,
          }}
        >
          <Accordion>
            <AccordionItem title="What is a challenge?">
              <Text>
                <p>
                  If you are new to Topcoder challenges, learn more about the overall concepts of challenges by watching this
                  <a href="https://www.yammer.com/wipro.com/#/files/101411706">
                    video
                  </a>
                  .
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How do I register for Topcoder?">
              <Text>
                <p>
                  Follow the instructions in this
                  <a href="https://www.yammer.com/wipro.com/#/files/101411768">
                    video
                  </a>
                  .
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How do I participate in a challenge?">
              <Text>
                <p>
                  Find a challenge that interests you on the
                  <a href="/challenges">
                    challenge listings page
                  </a>
                  . You can filter by challenge types, prizes, deadlines, etc. Look for challenges that are still open for registration. If you see something that interests you, click it and then you can read the details and register for the challenge. Watch the
                  <a href="https://www.yammer.com/wipro.com/#/files/101411899">
                    video
                  </a>
                  .
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How do I submit to a challenge?">
              <Text>
                <p>
                  Do all of your coding/design work offline, or as specified in the challenge spec. When you are ready to submit, come back to the challenge page and click the Submit button. The Submit page will give instructions to upload your submission. Watch the
                  <a href="https://www.yammer.com/wipro.com/#/files/101411933">
                    video
                  </a>
                  .
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Roles and responsibilities for reviewers and copilots">
              <Text>
                <p>
                  If you are a reviewer or copilot and need information about managing projects and challenges, please visit the
                  <a href="https://help.topcoder.com/hc/en-us/sections/204971587-Copilots-Reviewers">
                    Help Center
                  </a>
                  .
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Is there a role or band restriction for participation?">
              <Text>
                <p>
                  No role restrictions or band restrictions for participating in challenges.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Where can I see challenges and participate in the same?">
              <Text>
                <p>
                  In Home page click on Challenges; Look for challenges that are still open for registration. Click on the Challenge to see skills/technology involved and other details; Register to participate in the challenge OR go through video
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Can I participate in more than one challenge simultaneously?">
              <Text>
                <p>
                  Yes you can participate in more than one challenge simultaneously
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Where can I see prize and TopGear points for challenge?">
              <Text>
                <p>
                  Each challenge details will have details about winner prize and TopGear points associated
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Where can I get my queries clarified?">
              <Text>
                <p>
                  You can use Challenge Forum to get clarifications for your queries
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Where I can see different skills available on platform for learning?">
              <Text>
                <p>
                  On the Home page click on Learning; Navigate to communities to see skills available on platform.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How can I enhance my skills available on platform and get hands on experience?">
              <Text>
                <p>
                  In Home page click on Learning; Navigate to communities; Join a community where you want to enhance your skills; Join training/case study projects and complete the same.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Will my resume gets updated for enhancing my skill and participating in challenges?">
              <Text>
                <p>
                  Yes. The resume gets updated automatically after approval of submissions corresponding to training/case study and challenge.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Can I avail overtime benefits, for utilizing my time for participating in challenges?">
              <Text>
                <p>
                  No. Contribution time in participating will not be considered for over-time benefits.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How can I earn and accumulate TopGear points?">
              <Text>
                <p>
                  TopGear points can be earned by completing training/case study projects and by participating and submitting qualified submission in a challenge.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How long are the TopGear points that I earn are valid?">
              <Text>
                <p>
                  TopGear points accumulated by the employees after redemption post periodic contest/promotion shall be valid till the last working day of the employee. Beyond this period the points shall lapse.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="Can I exchange the rewards points for any other benefits?">
              <Text>
                <p>
                  No, the reward points cannot be exchanged for any other benefits.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="I have resigned from the company and I have TopGear points. What will happen to them?">
              <Text>
                <p>
                  If you are eligible for periodic contest – spot awards and you are exiting prior to contest/promotion scheduled date, the points get lapsed.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="How the TopGear points earned do reflected in TrendNxt credits?">
              <Text>
                <p>
                  TopGear contribution credits are considered under Organization Contribution category of TrendNxt.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="If I am not eligible/exempted from TrendNxt, what will happen to my TopGear points?">
              <Text>
                <p>
                  TopGear points earned may be considered for periodic contests.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="What will happen to existing TopGear points I have accumulated in this year so far?">
              <Text>
                <p>
                  TopGear points earned may be considered for periodic contests.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="What is the process to create a challenge in TopGear?">
              <Text>
                <p>
                  Send a mail to ask.topgear@wipro.com and TopGear team will get back to you with details and process.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="I am interested to contribute as Challenge Architect / Co-Pilot / Reviewer, what is the process?">
              <Text>
                <p>
                  Send a mail to ask.topgear@wipro.com and TopGear team will get back to you with details.  a.  User could also register on link
                  &zwnj;
                  <a href="https://topgear-app.wipro.com/topcoder_reviewer/registration">
                    https://topgear-app.wipro.com/topcoder_reviewer/registration
                  </a>
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="I am interested to add/initiate a new solution project/challenges on to the platform, what is the process?">
              <Text>
                <p>
                  On Home Page select ‘Initiate Project’ and provide initial information about projects OR send a mail to ask.topgear@wipro.com and TopGear team will get back to you with details OR go through video.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="I would like to create a new group that I can post challenges and tasks to. How do I get that setup?">
              <Text>
                <p>
                  Submit a request at
                  <a href="https://help.topcoder.com/hc/en-us/requests/new?ticket_form_id=779747">
                    https://help.topcoder.com/hc/en-us/requests/new?ticket_form_id=779747
                  </a>
                  {' '}
                  and a TopGear team member will help get it setup.
                </p>
              </Text>
            </AccordionItem>
            <AccordionItem title="I have more queries, whom should I contact?">
              <Text>
                <p>
                  Please write to ask.topgear@wipro.com
                </p>
              </Text>
            </AccordionItem>
          </Accordion>
        </Section>

      </main>
    </ThemeProvider>
  );
}
