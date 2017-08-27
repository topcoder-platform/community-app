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
import { ThemeProvider } from 'react-css-themr';

import theme from '../theme';
import style from './style.scss';

export default function Learn() {
  return (
    <ThemeProvider theme={theme} >
      <main>
        <Banner
          title="FAQ"
          text="The answers to questions you may have."
          theme={{
            container: style.bannerContainer,
            content: style.bannerContent,
            contentInner: style.bannerContentInner,
          }}
          imageSrc="/themes/wipro/learn/banner.jpg"
        />
        <Section
          title="Frequently Asked Questions"
          theme={{
            content: style.faqContent,
          }}
        >
          <Accordion>
            <AccordionItem title="What is a challenge?">
              <Text><p>If you are new to Topcoder challenges, learn more about the overall concepts of challenges by watching this <a href="https://www.yammer.com/wipro.com/#/files/101411706">video</a>.</p></Text>
            </AccordionItem>
            <AccordionItem title="How do I register for Topcoder?">
              <Text><p>Follow the instructions in this <a href="https://www.yammer.com/wipro.com/#/files/101411768">video</a>.</p></Text>
            </AccordionItem>
            <AccordionItem title="How do I participate in a challenge?">
              <Text><p>Find a challenge that interests you on the <a href="/challenges">challenge listings page</a>. You can filter by challenge types, prizes, deadlines, etc. Look for challenges that are still open for registration. If you see something that interests you, click it and then you can read the details and register for the challenge. Watch the <a href="https://www.yammer.com/wipro.com/#/files/101411899">video</a>.</p></Text>
            </AccordionItem>
            <AccordionItem title="How do I submit to a challenge?">
              <Text><p>Do all of your coding/design work offline, or as specified in the challenge spec. When you are ready to submit, come back to the challenge page and click the Submit button. The Submit page will give instructions to upload your submission. Watch the <a href="https://www.yammer.com/wipro.com/#/files/101411933">video</a>.</p></Text>
            </AccordionItem>
            <AccordionItem title="Roles and responsibilities for reviewers and copilots">
              <Text><p>If you are a reviewer or copilot and need information about managing projects and challenges, please visit the <a href="https://help.topcoder.com/hc/en-us/sections/204971587-Copilots-Reviewers">Help Center</a>.</p></Text>
            </AccordionItem>
          </Accordion>
        </Section>
        <Section
          title="Tutorials"
          theme={{
            content: style.tutorialsContent,
            title: style.tutorialsTitle,
          }}
        >
          <VideoCard
            title="Introduction"
            url="https://drive.google.com/uc?id=0B3y3SEA9cIEkUk9CNXdkdExpT0k"
          />
          <VideoCard
            title="Registration"
            url="https://drive.google.com/uc?id=0B3y3SEA9cIEkVVVNaW4xMjh6UVk"
          />
          <VideoCard
            title="Challenge Navigation"
            url="https://drive.google.com/uc?id=0B3y3SEA9cIEkNF9SNDM3Nnhldjg"
          />
          <VideoCard
            title="Joining a Challenge"
            url="https://drive.google.com/uc?id=0B3y3SEA9cIEkd1NzQWctNnQzOFU"
          />
          <VideoCard
            title="Submission"
            url="https://drive.google.com/uc?id=0B3y3SEA9cIEkMkdFYjF6NV9WM1E"
          />
        </Section>
      </main>
    </ThemeProvider>
  );
}
