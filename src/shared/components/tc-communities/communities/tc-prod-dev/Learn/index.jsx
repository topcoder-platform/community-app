/**
 * Static implementation of Learn page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import { Link } from 'react-router-dom';
import Section from 'components/tc-communities/Section';
import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import ArticleCard from 'components/tc-communities/ArticleCard';
import LinksCard from 'components/tc-communities/LinksCard';
import Text from 'components/tc-communities/Text';

import style from './style.scss';

export default function Learn() {
  return (
    <main>

      <Banner
        title="Learning & Certification"
        text="Our continuously evolving structured learning paths, constantly abreast of the latest, tailored for employees to deepen your knowledge, infuses important software capabilities that are industry specific and help you get the skills you need to succeed."
        theme={{
          container: style.bannerContainer,
          content: style.bannerContent,
          contentInner: style.bannerContentInner,
        }}
        imageSrc="/themes/wipro/learn/banner.jpg"
      />

      <Section
        title="Learn The Basics"
        theme={{
          container: style.learnBasicsContainer,
        }}
      >
        <Accordion>
          <AccordionItem title="Joining the  Community">
            <Text>
              <p>First things first, ...make sure you sign up for Topcoder. It&apos;s quick and painless and opens the door to a whole new world.</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="How to sign up for work">
            <Text>
              <p>It&apos;s likely that you&apos;ll be working on code in a specific git repo. We have many of them, so be sure to ask if you&apos;re not sure which one you shoudl be looking at.</p>
              <p>In general, you&apos;ll typically find them at https://github.com/topcoder-platform</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="How to compete for work">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="Payment & Rewards">
            <Text>
              <p>If you&apos;d like to be a copilot for Topcoder projects, send an email to support@topcoder.com and tell us a little about yourself.</p>
              <p>If  you&apos;d like to work on challenges, check out what&apos;s active on the <a href="challenges">challenges</a> page.  If there is nothing active, send us a note and tell us to stop slacking! :)</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="Managing your Badges">
            <Text>
              <p>Make sure you&apos;ve setup your payment preferences at https://community.topcoder.com/tc?module=EditPaymentPreferences.  When you&apos;ve earned some money and want to withdraw it, you can do that at https://community.topcoder.com/PactsMemberServlet?module=PaymentHistory&full_list=false</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="Updating your Profile">
            <Text>
              <p>Everything to do with managing your profile and preferences can be found at https://www.topcoder.com/settings/account/.  If you can&apos;t find what you&apos;re looking for, send us a note at support@topcoder.com.</p>
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
          imageSrc="/themes/wipro/learn/courses-01.jpg"
        />
        <ArticleCard
          title="An Ugly Myspace Profile Will Sure Ruin Your Reputation"
          text="Planning to visit Las Vegas or any other vacational resort where casinos are a major portion of their business? I have just the thing for"
          link={{
            title: 'Read More',
            url: 'learn',
          }}
          imageSrc="/themes/wipro/learn/courses-02.jpg"
        />
        <ArticleCard
          title="3 Simple Ways Work Fast in Competition"
          text="If you are in the market for a computer, there are a number of factors to consider. Will it be used for your home, your office or"
          link={{
            title: 'Read More',
            url: 'learn',
          }}
          imageSrc="/themes/wipro/learn/courses-03.jpg"
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

      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest Topcoder IOS challenges and information!"
        imageSrc="/themes/wipro/subscribe-bg.jpg"
      />
    </main>
  );
}
