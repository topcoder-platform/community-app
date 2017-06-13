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
        title="Learning"
        text="Learn by doing. The Topcoder Platform leverages several technology stacks ranging from J2EE to Node and ReactJS. We run on a cloud based infrastructure that is primarily hosted in AWS."
        theme={{
          container: style.bannerContainer,
          content: style.bannerContent,
          contentInner: style.bannerContentInner,
        }}
        imageSrc="/themes/wipro/learn/banner.jpg"
      />

      <Section
        title="Things To Know"
        theme={{
          container: style.learnBasicsContainer,
        }}
      >
        <Accordion>
          <AccordionItem title="Joining the  Community">
            <Text>
              <p>First things first, ...make sure you sign up for Topcoder. It's quick and painless and opens the door to a whole new world.</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="Get familiar with the platform">
            <Text>
              <p>It's likely that you'll be working on code in a specific git repo. We have many of them, so be sure to ask if you're not sure which one you shoudl be looking at.</p>
              <p>In general, you'll typically find them at https://github.com/topcoder-platform</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="Look at past challenges">
            <Text>
              <p>You can learn a lot from the past. Take a look at previous challenges that were run to do design and development on the Topcoder Platform. https://www.topcoder.com/challenges/#&query=topcoder&tracks=design&tracks=develop </p>
            </Text>
          </AccordionItem>
          <AccordionItem title="How to compete for work">
            <Text>
              <p>If you'd like to be a copilot for Topcoder projects, send an email to support@topcoder.com and tell us a little about yourself.  
              <p>If  you'd like to work on challenges, check out what's active on the <a href=/challenges>challenges</a> page.  If there is nothing active, send us a note and tell us to stop slacking! :)</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="challenges">Compete</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="Payments & Rewards">
            <Text>
              <p>Make sure you've setup your payment preferences at https://community.topcoder.com/tc?module=EditPaymentPreferences.  When you've earned some money and want to withdraw it, you can do that at https://community.topcoder.com/PactsMemberServlet?module=PaymentHistory&full_list=false</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="Manage your Profile">
            <Text>
              <p>Everything to do with managing your profile and preferences can be found at https://www.topcoder.com/settings/account/.  If you can't find what you're looking for, send us a note at support@topcoder.com.</p>
            </Text>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Tutorials"
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
