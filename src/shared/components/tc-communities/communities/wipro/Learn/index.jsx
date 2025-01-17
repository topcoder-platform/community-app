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
import ArticleCard from 'components/tc-communities/ArticleCard';
import LinksCard from 'components/tc-communities/LinksCard';
import Text from 'components/tc-communities/Text';
*/

import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function Learn() {
  return (
    <main>
      <Banner
        title="Learn and earn rewards"
        text="Our continuously evolving structured learning paths are customized to deepen your knowledge and help you acquire industry specific software capabilities. Master the in-demand technologies to succeed in this rapidly changing technology landscape."
        theme={{
          container: style.bannerContainer,
          content: style.bannerContent,
          contentInner: style.bannerContentInner,
        }}
        imageSrc="/community-app-assets/themes/wipro/learn/banner.jpg"
      />
      <Section>
        <div styleName="message">
          <p>
            To access the TopGear
            <span styleName="highlighted">
              Learning
            </span>
            {' '}
            Platform, click on &ldquo;
            <strong>
              CONTINUE
            </strong>
            &rdquo;.
          </p>
          <p styleName="button-container">
            <PrimaryButton
              openNewTab
              to="https://topgear-app.wipro.com"
            >
              Continue
            </PrimaryButton>
          </p>
        </div>
      </Section>

      {/*

      <Section
        title="Learn The Basics"
        theme={{
          container: style.learnBasicsContainer,
        }}
      >
        <Accordion>
          <AccordionItem title="Overview">
            <Text>
              <p>The FULCRUM is &ldquo;one stop shop&rdquo; for access to a wide range of training and learning opportunities on Wipro’s Hybrid Crowd. Designed to strengthen the skills of employees, the hub offers physical and online platforms to learn skills on demand, gain hands-on experience, and be future ready.</p>
              <p>Meticulously crafted comprehensive learning paths, detailed study material, engaging case studies, training projects to systematically enhance your career, development environments to practice, convenient online accessibility, opportunity to connect with mentors, peers, SMEs of various technologies – a variety of resources bringing people and technology together for an innovative and valuable learning experience.</p>
              <p>Our compelling learning environment across wide range of emerging technologies helps you in mastering today’s most essential skills, that brings your knowledge to the next level, step by step, which ultimately creates a more effective learning experience.</p>
              <p>Are you ready to step onto the innovative journey of learning?</p>
              <div styleName="joinnowWrap">
                <a styleName="joinnow" href="https://topgear-app.wipro.com">Start Exploring</a>
              </div>
            </Text>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Courses and Tutorials"
        link={{
          title: 'View All',
          url: 'learn',
        }}
        theme={{
          container: style.coursesContainer,
        }}
      >
        <ArticleCard
          title="What You Need to Join a Challenge"
          text="There are advances being made in science and technology everyday, and a good example of this is the LCD monitor. LCD monitors have"
          link={{
            title: 'Read More',
            url: 'learn',
          }}
          imageSrc="/community-app-assets/themes/wipro/learn/courses-01.jpg"
        />
        <ArticleCard
          title="An Ugly Myspace Profile Will Sure Ruin Your Reputation"
          text="Planning to visit Las Vegas or any other vacational resort where casinos are a major portion of their business? I have just the thing for"
          link={{
            title: 'Read More',
            url: 'learn',
          }}
          imageSrc="/community-app-assets/themes/wipro/learn/courses-02.jpg"
        />
        <ArticleCard
          title="3 Simple Ways Work Fast in Competition"
          text="If you are in the market for a computer, there are a number of factors to consider. Will it be used for your home, your office or"
          link={{
            title: 'Read More',
            url: 'learn',
          }}
          imageSrc="/community-app-assets/themes/wipro/learn/courses-03.jpg"
        />
      </Section>

      <Section
        title="Resources"
        theme={{
          title: style.resourcesTitle,
          container: style.resourcesContainer,
        }}
      >
        <LinksCard
          title="Documents"
          links={[{
            title: 'Nam dapibus nisl vitae elit fringilla',
            url: 'learn',
          }, {
            title: 'Aenean sollicitudin',
            url: 'learn',
          }, {
            title: 'Erat a elementum rutrum',
            url: 'learn',
          }, {
            title: 'Neque sem pretium metus',
            url: 'learn',
          }]}
        />
        <LinksCard
          title="Videos"
          links={[{
            title: 'Tristique ullamcorper id vitae',
            url: 'learn',
          }, {
            title: 'Nulla mollis sapien sollicitudin',
            url: 'learn',
          }, {
            title: 'Vivamus facilisis dolor et massa',
            url: 'learn',
          }, {
            title: 'Vestibulum nisl egestas',
            url: 'learn',
          }]}
        />
        <LinksCard
          title="Useful Links"
          links={[{
            title: 'Nam dapibus nisl vitae elit fringilla',
            url: 'learn',
          }, {
            title: 'Aenean sollicitudin',
            url: 'learn',
          }, {
            title: 'Erat a elementum rutrum',
            url: 'learn',
          }, {
            title: 'Neque sem pretium metus',
            url: 'learn',
          }]}
        />
      </Section>
      */}
    </main>
  );
}
