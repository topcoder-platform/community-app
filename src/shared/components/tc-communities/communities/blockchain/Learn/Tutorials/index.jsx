/**
 * Tutorials page.
 */

import React from 'react';
import Section from 'components/tc-communities/Section';
import YouTubeVideo from 'components/YouTubeVideo';

import style from './style.scss';

export default function Tutorials() {
  return (
    <div>
      <Section
        theme={{
          container: style.sectionContainer,
          content: style.sectionContent,
        }}
        title="Tutorials"
      >
        <div>
          <p>
            Have you missed Ethereum tutorial challenges at Topcoder, but still
            want to jump onboard to participate in all Ethereum work that is
            coming? We recommend to start by checking and trying the following
            Ethereum tutorials:
          </p>
          <ul>
            <li>
              <a
                href="https://ethereum.org/token"
                rel="noopener noreferrer"
                target="_blank"
              >
Create your own crypto-currency with Ethereum
              </a>
            </li>
            <li>
              <a
                href="https://ethereum.org/crowdsale"
                rel="noopener noreferrer"
                target="_blank"
              >
Crowdsale. Raising funds from friends without a third party
              </a>
            </li>
            <li>
              <a
                href="https://ethereum.org/dao"
                rel="noopener noreferrer"
                target="_blank"
              >
How to build a democracy on the blockchain
              </a>
            </li>
            <li>
              <a
                href="http://truffleframework.com/tutorials/pet-shop"
                rel="noopener noreferrer"
                target="_blank"
              >
Ethereum pet shop
              </a>
            </li>
            <li>
              <a
                href="http://truffleframework.com/tutorials/robust-smart-contracts-with-openzeppelin"
                rel="noopener noreferrer"
                target="_blank"
              >
Building robust smart contracts with OpenZeppelin
              </a>
            </li>
            <li>
              <a
                href="http://truffleframework.com/tutorials/building-dapps-for-quorum-private-enterprise-blockchains"
                rel="noopener noreferrer"
                target="_blank"
              >
Building dApps for Quorum: Private enterprise blockchains
              </a>
            </li>
            <p>
              Bored to read and try, or having some problems on the way you fail
              to resolve yourself? Watch these videos of Topcoder members doing
              these tutorials:
            </p>
            <div styleName="videos">
              <div styleName="video-block">
                <p>
                  Introduction, and walkthrough
                  &zwnj;
                  <em>
&ldquo;Ethereum pet shop&rdquo;
                  </em>
                  {' '}
and
                  &zwnj;
                  {
                    <em>
&ldquo;Building robust smart
                    contracts with OpenZppellin&rdquo;
                    </em>
                  }
                  {' '}
tutorials from
                  &zwnj;
                  {
                    <a
                      href="https://www.topcoder.com/members/OB3LISK/"
                      rel="noopener noreferrer"
                      styleName="OB3LISK"
                      target="_blank"
                    >
                      OB3LISK
                    </a>
                  }
.
                </p>
                <YouTubeVideo
                  src="https://www.youtube.com/embed/EIsXYZA1Yog?list=PLLarCc_4WR6bNYiqaWPUMvnzl6227y21X"
                  title="Fun tutorials walkthrough from OB3LISK"
                />
              </div>
              <div styleName="video-block">
                <p>
                  Detailed screencast of walkthrough all tutorials from
                  &zwnj;
                  {
                    <a
                      href="https://www.topcoder.com/members/Khadoos/"
                      rel="noopener noreferrer"
                      styleName="Khadoos"
                      target="_blank"
                    >
                      Khadoos
                    </a>
                  }
&zwnj;
                  (only the last three videos in the playlist contain
                  audio tracks).
                </p>
                <YouTubeVideo
                  src="https://www.youtube.com/embed/bTJzHxKDoU8"
                  title="Detailed tutorials walkthrough from Khadoos"
                />
              </div>
            </div>
          </ul>
        </div>
      </Section>
    </div>
  );
}
