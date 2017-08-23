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
            <AccordionItem title="How to participate in a challenge">
              <Text><p>Find a challenge that interests you on the <a href="/challenges">challenge listings page</a>. You can filter by challenge types, prizes, deadlines, etc. Look for challenges that are still open for registration. If you see something that interests you, click it and then you can read the details and register for the challenge.</p></Text>
            </AccordionItem>
            <AccordionItem title="Code submissions for a challenge">
              <Text><p>Do all of your coding/design work offline, or as specified in the challenge spec. When you are ready to submit, come back to the challenge page and click the Submit button. The Submit page will give instructions to upload your submission.</p></Text>
            </AccordionItem>
            <AccordionItem title="Roles and responsibilities for reviewers and copilots">
              <Text><p>If you are a reviewer or copilot and need information about managing projects and challenges, please visit the <a href="https://help.topcoder.com/hc/en-us/sections/204971587-Copilots-Reviewers">Help Center</a>.</p></Text>
            </AccordionItem>
          </Accordion>
        </Section>
      </main>
    </ThemeProvider>
  );
}
