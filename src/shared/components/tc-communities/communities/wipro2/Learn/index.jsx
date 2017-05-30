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
        text="IOS Community offers you an opportunity to get involved with a variety of challenging and interesting projects. It will help accelerate your learning path and open up opportunities that were not visible in the past."
        theme={{
          container: style.bannerContainer,
          content: style.bannerContent,
          contentInner: style.bannerContentInner,
        }}
        imageSrc="/themes/wipro2/learn/banner.jpg"
      />

      <Section
        title="Learn The Basics"
        theme={{
          container: style.learnBasicsContainer,
        }}
      >
        <Accordion>
          <AccordionItem title="Joining the IOS Community">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="/community/wipro2/learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="How to sign up for work">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="How to compete for work">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="/community/wipro2/learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="Payment & Rewards">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="Managing your Certifications">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
              <div styleName="joinnowWrap">
                <Link styleName="joinnow" to="/community/wipro2/learn">Join Now</Link>
              </div>
            </Text>
          </AccordionItem>
          <AccordionItem title="Managing your Badges">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
            </Text>
          </AccordionItem>
          <AccordionItem title="Updating your Profile">
            <Text>
              <p>Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent blandit, augue a posuere aliquam, arcu tortor feugiat turpis,</p>
            </Text>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Courses and Tutorials"
        link={{
          title: 'View All',
          url: '/community/wipro2/learn',
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
            url: '/community/wipro2/learn',
          }}
          imageSrc="/themes/wipro2/learn/courses-01.jpg"
        />
        <ArticleCard
          title="An Ugly Myspace Profile Will Sure Ruin Your Reputation"
          text="Planning to visit Las Vegas or any other vacational resort where casinos are a major portion of their business? I have just the thing for"
          link={{
            title: 'Read More',
            url: '/community/wipro2/learn',
          }}
          imageSrc="/themes/wipro2/learn/courses-02.jpg"
        />
        <ArticleCard
          title="3 Simple Ways Work Fast in Competition"
          text="If you are in the market for a computer, there are a number of factors to consider. Will it be used for your home, your office or"
          link={{
            title: 'Read More',
            url: '/community/wipro2/learn',
          }}
          imageSrc="/themes/wipro2/learn/courses-03.jpg"
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
            url: '/community/wipro2/learn',
          }, {
            title: 'Aenean sollicitudin',
            url: '/community/wipro2/learn',
          }, {
            title: 'Erat a elementum rutrum',
            url: '/community/wipro2/learn',
          }, {
            title: 'Neque sem pretium metus',
            url: '/community/wipro2/learn',
          }]}
        />
        <LinksCard
          title="Videos"
          links={[{
            title: 'Tristique ullamcorper id vitae',
            url: '/community/wipro2/learn',
          }, {
            title: 'Nulla mollis sapien sollicitudin',
            url: '/community/wipro2/learn',
          }, {
            title: 'Vivamus facilisis dolor et massa',
            url: '/community/wipro2/learn',
          }, {
            title: 'Vestibulum nisl egestas',
            url: '/community/wipro2/learn',
          }]}
        />
        <LinksCard
          title="Useful Links"
          links={[{
            title: 'Nam dapibus nisl vitae elit fringilla',
            url: '/community/wipro2/learn',
          }, {
            title: 'Aenean sollicitudin',
            url: '/community/wipro2/learn',
          }, {
            title: 'Erat a elementum rutrum',
            url: '/community/wipro2/learn',
          }, {
            title: 'Neque sem pretium metus',
            url: '/community/wipro2/learn',
          }]}
        />
      </Section>

      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest Topcoder IOS challenges and information!"
        imageSrc="/themes/wipro2/subscribe-bg.jpg"
      />
    </main>
  );
}
