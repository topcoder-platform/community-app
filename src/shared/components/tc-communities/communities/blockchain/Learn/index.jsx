/**
 * Static implementation of Learn page for QA community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Section from 'components/tc-communities/Section';
import YouTubeVideo from 'components/YouTubeVideo';

import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import ArticleCard from 'components/tc-communities/ArticleCard2';
import LinksCard from 'components/tc-communities/LinksCard';

import ConsenSysAtMedium from './ConsenSysAtMedium';
import TopcoderBlockchainBlog from './TopcoderBlockchainBlog';
import LearnTheBasics from './LearnTheBasics';
import Tutorials from './Tutorials';

import style from './style.scss';

export default function Learn({
  baseUrl,
  consenSysRss,
  topcoderBlockchainBlogRss,
}) {
  return (
    <main>
      <Banner
        title="Learning & Certification"
        text="Blockchain Community offers you an opportunity to get involved with a variety of challenging and interesting projects. It will help to accelerate your learning path and open up opportunities that were not visible in the past."
        theme={{
          container: style.bannerContainer,
          content: style.bannerContent,
          contentInner: style.bannerContentInner,
        }}
        imageSrc="/community-app-assets/themes/blockchain/learn/banner.jpg"
      />
      <LearnTheBasics baseUrl={baseUrl} />
      <Section
        title="Learn More About Ethereum and Blockchain"
        theme={{
          container: style.coursesContainer,
          content: style.coursesContent,
        }}
      >
        <YouTubeVideo
          src="https://www.youtube.com/embed/j23HnORQXvs"
          styleName="videoContainer"
          title="Ethereum: the World Computer"
        />
        <YouTubeVideo
          src="https://www.youtube.com/embed/TDGq4aeevgY"
          styleName="videoContainer"
          title="Vitalik Buterin explains Ethereum"
        />
        <ArticleCard
          title="History and Promise of Blockchain"
          imageSrc="/community-app-assets/themes/blockchain/learn/courses-01.jpg"
        >
          <ul styleName="linksList">
            <li>
              <a
                href="https://hbr.org/2017/02/a-brief-history-of-blockchain"
                rel="noopener noreferrer"
                target="_blank"
              >
A Brief History of Blockchain
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/embed/7Y3fWXA6d5k"
              >
History of Blockchain (Video)
              </a>
            </li>
            <li>
              <a
                href="https://hbr.org/2017/03/the-promise-of-blockchain-is-a-world-without-middlemen"
                rel="noopener noreferrer"
                target="_blank"
              >
A World Without Middleman
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@mattcondon/getting-up-to-speed-on-ethereum-63ed28821bbe"
                rel="noopener noreferrer"
                target="_blank"
              >
Getting Up to Speed on Ethereum
              </a>
            </li>
          </ul>
        </ArticleCard>
        <ArticleCard
          title="Principles of Decentralization"
          imageSrc="/community-app-assets/themes/blockchain/learn/courses-02.jpg"
        >
          <ul styleName="linksList">
            <li>
              <a
                href="https://www.coindesk.com/information/what-is-ethereum/"
                rel="noopener noreferrer"
                target="_blank"
              >
What Is Ethereum
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@VitalikButerin/the-meaning-of-decentralization-a0c92b76a274"
                rel="noopener noreferrer"
                target="_blank"
              >
The Meaning of Decentralization
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@ConsenSys/welcome-to-3-0-f4552fb02302"
                rel="noopener noreferrer"
                target="_blank"
              >
Welcome to 3.0
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@wen_xs/what-is-blockchain-really-an-intro-for-regular-people-e51578d98a96"
                rel="noopener noreferrer"
                target="_blank"
              >
What Is Blockchain, Really? (An&nbsp;Intro For Regular People)
              </a>
            </li>
          </ul>
        </ArticleCard>
        <ArticleCard
          title="Technical Basics of Blockchain"
          imageSrc="/community-app-assets/themes/blockchain/learn/courses-03.jpg"
        >
          <ul styleName="linksList">
            <li>
              <a
                href="https://www.youtube.com/embed/fgSvXFZ1GuU?start=1005&end=1187&version=3"
                rel="noopener noreferrer"
                target="_blank"
              >
Cryptographic Identity in Blockchain
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=Aq3a-_O2NcI&feature=youtu.be"
                rel="noopener noreferrer"
                target="_blank"
              >
Bitcoin - Digital Signatures
              </a>
            </li>
            <li>
              <a
                href="https://decentralize.today/if-you-understand-hash-functions-youll-understand-blockchains-9088307b745d"
                rel="noopener noreferrer"
                target="_blank"
              >
Hash Functions
              </a>
            </li>
            <li>
              <a
                href="https://medium.com/@ConsenSys/blockchain-underpinnings-hashing-7f4746cbd66b"
                rel="noopener noreferrer"
                target="_blank"
              >
Blockchain Underpinnings: Hashing
              </a>
            </li>
            <li>
              <a
                href="https://media.consensys.net/guide-hashing-33dc0467c126"
                rel="noopener noreferrer"
                target="_blank"
              >
Guide: Hashing
              </a>
            </li>
          </ul>
        </ArticleCard>
      </Section>
      <Tutorials />
      <ConsenSysAtMedium consenSysRss={consenSysRss} />
      <TopcoderBlockchainBlog
        topcoderBlockchainBlogRss={topcoderBlockchainBlogRss}
      />
      <Section
        title="More Resources"
        theme={{
          title: style.resourcesTitle,
          container: style.resourcesContainer,
        }}
      >
        <LinksCard
          title="Useful Information"
          theme={{
            container: style.linksCardContainer,
          }}
          links={[{
            openNewTab: true,
            title: 'Blockchain, Accounting, Audit and Tax Conference',
            url: 'https://www.accountingblockchain.net/#home-hero',
          }, {
            openNewTab: true,
            title: 'Blockchain for Social Impact',
            url: 'https://www.blockchainforsocialimpact.com/',
          }, {
            openNewTab: true,
            title: 'Ethereum Aliance',
            url: 'https://entethalliance.org/about/',
          }, {
            openNewTab: true,
            title: 'Ethereum Blockchain Education: ConsenSys Academy',
            url: 'https://consensys.net/academy/',
          }, {
            openNewTab: true,
            title: 'Ethereum Foundation',
            url: 'https://www.ethereum.org/foundation',
          }, {
            openNewTab: true,
            title: 'Ethereum Meetups',
            url: 'https://www.meetup.com/topics/ethereum/',
          }, {
            openNewTab: true,
            title: 'reddit - Ethereum • r/ethereum',
            url: 'https://www.reddit.com/r/ethereum/',
          }, {
            openNewTab: true,
            title: 'Week in Ethereum News',
            url: 'http://www.weekinethereum.com/',
          }]}
        />
        {
          topcoderBlockchainBlogRss ? (
            <LinksCard
              theme={{
                container: style.linksCardContainer,
              }}
              title="More From Topcoder Blog"
              links={_.get(topcoderBlockchainBlogRss, 'data.item', []).slice(3).map(it => ({
                openNewTab: true,
                title: it.title,
                url: it.link,
              }))}
            />
          ) : null
        }
      </Section>

      <NewsletterSignup
        title="Sign up for our newsletter"
        text="Don't miss out on the latest Topcoder Blockchain challenges and information!"
        imageSrc="/community-app-assets/themes/blockchain/subscribe-bg.jpg"
      />
    </main>
  );
}

Learn.defaultProps = {
  consenSysRss: null,
  topcoderBlockchainBlogRss: null,
};

Learn.propTypes = {
  baseUrl: PT.string.isRequired,
  consenSysRss: PT.shape(),
  topcoderBlockchainBlogRss: PT.shape(),
};
