import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import React from 'react';
import { Button } from 'topcoder-react-ui-kit';

import HeadBannerImage from
  'assets/images/communities/blockchain/bsic-hackathon/head-banner.jpg';

import ChallengeImgHardware from
  'assets/images/communities/blockchain/bsic-hackathon/challenge-hardware.jpg';
import ChallengeImgDemocracy from
  'assets/images/communities/blockchain/bsic-hackathon/challenge-democracy.jpg';
import ChallengeImgAgriculture from
  'assets/images/communities/blockchain/bsic-hackathon/challenge-agriculture.jpg';
import ChallengeImgRefugees from
  'assets/images/communities/blockchain/bsic-hackathon/challenge-refugees.jpg';

import ChallengeCard from './ChallengeCard';

import style from './style.scss';

export default function BsicHackathon() {
  return (
    <div>
      <div styleName="bannerContainer">
        <div styleName="bannerContent">
          <div styleName="bannerMaskLeft" />
          <img
            alt="Head Banner"
            src={HeadBannerImage}
            styleName="bannerImage"
          />
          <div styleName="bannerMaskRight" />
        </div>
      </div>
      <div styleName="contentBlock">
        <h1 styleName="h1">About the Incubator</h1>
        <p>
          The Decentralized Impact Incubator is a 6-week program built off of
          the traditional idea of a hackathon to ideate and prototype
          blockchain-based solutions to global social and environmental
          challenges. We are calling it an incubator because we will challenge
          you to build an actual, deployable solution on the ground, more than
          just code. During the competition, participants from around the will
          gather to form teams, study human landscape, design business models,
          and define impact metrics. Teams need to pass through weekly
          checkpoints and are guided by mentors throughout the process. Winning
          projects will receive grants and training to support continued
          development.
        </p>
      </div>
      <div styleName="contentBlock">
        <h1 styleName="h1">Prizes</h1>
        <div>
          Cash prize of $50,000 USD to best teams of each challenge category:
          <ul>
            <li>
              $10k for winners, $2.5k for runner-ups.
            </li>
            <li>
              Business development training for all winning teams to accelerate
              solutions beyond PoC stage.
            </li>
            <li>
              Exposure and visibility across BSIC channels, networks, and more.
            </li>
            <li>
              Opportunity to showcase their solutions in front of the most
              reputable impact ivestors, NGOs, philanthropists, charities during
              conference in June in London, UK.
            </li>
          </ul>
        </div>
      </div>
      <div styleName="contentBlock twoColumns">
        <div styleName="timelineCardContainer">
          <h1 styleName="h1">Timeline</h1>
          <div styleName="nowrap">
            <h3 styleName="timelinePhaseName">
              Registration and Team Formation:
            </h3>&zwnj;
            March 21st - April 9th
          </div>
          <div styleName="nowrap">
            <h3 styleName="timelinePhaseName">Competition:</h3>&zwnj;
            April 9th - May 21st
          </div>
          <div styleName="nowrap">
            <h3 styleName="timelinePhaseName">Judging:</h3>&zwnj;
            May 21st - June 4th
          </div>
          <div styleName="nowrap">
            <h3 styleName="timelinePhaseName">Winners Announced:</h3>&zwnj;
            June 4th
          </div>
        </div>
        <div>
          <h1 styleName="h1">Judging Criteria</h1>
          <ul>
            <li>
              Weekly checkpoints (which will guide you to create an excellent
              White Paper)
            </li>
            <li>
              White Paper (optional, in case of updates/changes uncovered in
              your weekly checkpoints)
            </li>
            <li>
              5-min video demo demonstrating:
              <ul>
                <li>
                  A description of your early stage idea: The challenge of your
                  choice and the overview of your solution.
                </li>
                <li>
                  An explanation of your business model: How does your solution
                  create value and be financially sustainable?
                </li>
                <li>
                  Prototype / Proof-of-concept: A minimum viable product that
                  captures how your product functions.
                </li>
                <li>
                  Timeline for sustained development: A plan for project&apos;s
                  growth beyond the scope of the incubator.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div styleName="challengesContainer">
        <div styleName="challengesContent">
          <h1 styleName="h1">Get Started</h1>
          <JoinCommunity
            label="Join Topcoder Blockchain Community"
          />
          <Button
            enforceA
            theme={{ button: style.regButtonsW }}
            to="https://blockchain.topcoder.com/challenges/30063672"
          >Register for the Challenge</Button>
          <div styleName="challengeCardsContainer">
            <ChallengeCard
              imgUrl={ChallengeImgRefugees}
              title="Refugees Challenge"
              text="From Myanmar to Syria, geopolitical instability has created the largest humanitarian crisis since WWII. 65.6 million people are forcibly displaced, and lack of identity, opaqueness of process, insufficient aid and political obstructions are adding to their undue burden. Blockchain technology is often touted as a solution to uplift refugees, providing services ranging from self-agency and educational credentialing to crisis response and evidence collection in dangerous regions. As the technology matures, it has become more durable, reliable, and appropriate to deploy in many of these use cases."
            />
            <ChallengeCard
              imgUrl={ChallengeImgDemocracy}
              title="Democracy Challenge"
              text="Secure voting, protected privacy, free flow of information...these ideas empower an equitable, distributed world, but they are also the most susceptible to violations. Blockchain is a “political” “human” technology. The central ethos of the technology is about inclusion and equality, cutting out the intermediary where corruption and collusion breed. Dive deep into the world of democracy, autonomy, and self-sovereignty, and you will see many opportunities for blockchain to benefit the vulnerable populations of the world."
            />
            <ChallengeCard
              imgUrl={ChallengeImgHardware}
              title="Hardware Challenge"
              text="As more and more blockchain for social impact projects pop up, a pattern of problems has arisen. How do we reduce the need for human verification? How do we allow for localized blockchain access in low infrastructure areas? How do we create trusted automated interactions between IoT devices? There is an increasing need for reliable hardware architectures to support blockchain solutions. Without those, blockchain remains out of reach for the majority."
            />
            <ChallengeCard
              imgUrl={ChallengeImgAgriculture}
              title="Agriculture Challenge"
              text="Poor agricultural practices are damaging the Earth's land and environment. Overgrazing and overdrafting lead to soil erosion. Slash and burn farming devastates our forests. Pollutants and harmful chemicals get recycled into aquatic ecosystems, endangering various species that rely on delicate natural habitats. Blockchain technology represents to increase the sustainability of agricultural practices through a plethora of ways. Securing the supply chain, reducing waste, and incentivizing better habits are just a few of the possibilities!"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
