import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import React from 'react';
import { Button } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';

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
              reputable impact investors, NGOs, philanthropists, charities
              during conference in June in London, UK.
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
              text={
                <div>
                  From Myanmar to Syria, geopolitical instability has created
                  the largest humanitarian crisis since WWII. 65.6 million
                  people are forcibly displaced, and lack of identity,
                  opaqueness of process, insufficient aid and political
                  obstructions are adding to their undue burden. Blockchain
                  technology is often touted as a solution to uplift refugees,
                  providing services ranging from self-agency and educational
                  credentialing to crisis response and evidence collection in
                  dangerous regions. As the technology matures, it has become
                  more durable, reliable, and appropriate to deploy in many of
                  these use cases.
                  <ul>
                    <li>
                      <Link
                        openNewTab
                        to="https://www.wired.com/story/refugees-but-on-the-blockchain/"
                      >
                        How Refugees Are Helping Create Blockchain&apos;s Brand
                        New World
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="http://www.qeh.ox.ac.uk/blog/blockchain-refugees-great-hopes-deep-concerns"
                      >
                        Blockchain for Refugees: Great Hopes, Deep Concerns
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://www.devex.com/news/has-global-development-reached-peak-blockchain-hype-91906"
                      >
                        Has Global Development Reached &ldquo;Peak Blockchain
                        Hype?&rdquo;
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="http://fortune.com/2018/01/20/blockchain-identity-civic-silicon-slopes/"
                      >
                        Why Blockchains and Identity Go Together
                      </Link>
                    </li>
                  </ul>
                </div>
              }
            />
            <ChallengeCard
              imgUrl={ChallengeImgDemocracy}
              title="Democracy Challenge"
              text={
                <div>
                  Secure voting, protected privacy, free flow of
                  information...these ideas empower an equitable, distributed
                  world, but they are also the most susceptible to violations.
                  Blockchain is a “political” “human” technology. The central
                  ethos of the technology is about inclusion and equality,
                  cutting out the intermediary where corruption and collusion
                  breed. Dive deep into the world of democracy, autonomy, and
                  self-sovereignty, and you will see many opportunities for
                  blockchain to benefit the vulnerable populations of the world.
                  <ul>
                    <li>
                      <Link
                        openNewTab
                        to="https://www.fastcompany.com/3062386/democracy-is-getting-a-reboot-on-the-blockchain"
                      >Democracy Is Getting A Reboot On The Blockchain</Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://ssir.org/articles/entry/will_blockchain_disrupt_government_corruption"
                      >Will Blockchain Disrupt Government Corruption?</Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://www.theatlantic.com/technology/archive/2017/05/blockchain-of-command/528543/"
                      >
                        Cryptocurrency Might be a Path to Authoritarianism:
                        Extreme Libertarians Built Blockchain To Decentralize
                        Government and Corporate Power; It Could Consolidate
                        Their Control Instead.
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://opendocs.ids.ac.uk/opendocs/bitstream/handle/123456789/12945/RRB17.pdf"
                      >
                        Blockchain for Development - Hope or Hype? Read
                        Section: A Ten-Point Checklist for Development
                        Policymakers and Practitioners Interested in Blockchain
                      </Link>
                    </li>
                  </ul>
                </div>
              }
            />
            <ChallengeCard
              imgUrl={ChallengeImgHardware}
              title="Hardware Challenge"
              text={
                <div>
                  As more and more blockchain for social impact projects pop up,
                  a pattern of problems has arisen. How do we reduce the need
                  for human verification? How do we allow for localized
                  blockchain access in low infrastructure areas? How do we
                  create trusted automated interactions between IoT devices?
                  There is an increasing need for reliable hardware
                  architectures to support blockchain solutions. Without those,
                  blockchain remains out of reach for the majority.
                  <ul>
                    <li>
                      <Link
                        openNewTab
                        to="https://blockchainatberkeley.blog/on-blockchain-and-the-internet-of-things-f6b0b2deb528"
                      >
                        On Blockchain and the Internet of Things: Strengths,
                        Weaknesses, and the Likely Road Ahead
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="http://www.ibtimes.co.uk/how-realise-potential-blockchain-developing-economies-1649410"
                      >
                        How to Realise the Potential of Blockchain in
                        Developing Countries
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://medium.com/rightmesh/demystifying-mesh-networks-6c7aaac07e1a"
                      >
                        Demystifying Mesh Networks: To understand what
                        RightMesh is, let&apos;s first understand what a mesh
                        network is.
                      </Link>
                    </li>
                  </ul>
                </div>
              }
            />
            <ChallengeCard
              imgUrl={ChallengeImgAgriculture}
              title="Agriculture Challenge"
              text={
                <div>
                  Poor agricultural practices are damaging the Earth&apos;s
                  land and environment. Overgrazing and overdrafting lead to
                  soil erosion. Slash and burn farming devastates our forests.
                  Pollutants and harmful chemicals get recycled into aquatic
                  ecosystems, endangering various species that rely on delicate
                  natural habitats. Blockchain technology represents to
                  increase the sustainability of agricultural practices through
                  a plethora of ways. Securing the supply chain, reducing waste,
                  and incentivizing better habits are just a few of the
                  possibilities!
                  <ul>
                    <li>
                      <Link
                        openNewTab
                        to="https://theconversation.com/how-blockchain-is-strengthening-tuna-traceability-to-combat-illegal-fishing-89965"
                      >
                        How Blockchain is Strengthening Tuna Traceability to
                        Combat Illegal Fishing
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://cointelegraph.com/news/growing-the-garden-how-to-use-blockchain-in-agriculture"
                      >
                        Growing the Garden: How to Use Blockchain in Agriculture
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://inc42.com/resources/blockchain-technology-agriculture/"
                      >
                        How Adoption Of Blockchain Technology Will Disrupt
                        Agriculture
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://www.reuters.com/article/us-africa-landrights-blockchain/african-startups-bet-on-blockchain-to-tackle-land-fraud-idUSKCN1G00YK"
                      >
                        African Startups Bet on Blockchain to Tackle Land Fraud
                      </Link>
                    </li>
                    <li>
                      <Link
                        openNewTab
                        to="https://www.washingtonpost.com/news/monkey-cage/wp/2014/08/15/land-rights-and-conflict-in-africa/?utm_term=.e5f484734eb1"
                      >
                        Land rights and conflict in Africa
                      </Link>
                    </li>
                  </ul>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
