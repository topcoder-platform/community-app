import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import React from 'react';
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

import './style.scss';

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
        <h1 styleName="h1">
About the Incubator
        </h1>
        <p>
          The Decentralized Impact Incubator was a 6-week program built off of
          the traditional idea of a hackathon to ideate and prototype
          blockchain-based solutions to global social and environmental
          challenges. We called it an incubator because we challenged
          participants to build an actual, deployable solution on the ground,
          more than just code. During the competition, participants from around
          the world gathered to form teams, study human landscape, design
          business models, and define impact metrics. Teams needed to pass
          through weekly checkpoints and were guided by mentors throughout the
          process. Winning projects received grants and training to support
          continued development.
        </p>
      </div>
      <div styleName="contentBlock">
        <h1 styleName="h1">
Prizes
        </h1>
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
              during conference in June in Washington, DC.
            </li>
          </ul>
        </div>
      </div>
      <div styleName="contentBlock">
        <h1 styleName="h1">
Judging Criteria
        </h1>
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
      <div styleName="challengesContainer">
        <div styleName="challengesContent">
          <h1 styleName="h1">
            Completed
          </h1>
          <div styleName="facts wide">
            <p>
              664
              <br />
              Registrants
            </p>
            <p>
              94
              <br />
              Teams
            </p>
            <p>
              58
              <br />
              Countries
            </p>
            <p>
              47
              <br />
              Submissions
            </p>
            <p>
              4
              <br />
              Use Cases
            </p>
          </div>
          <div styleName="facts">
            <p>
              $40 000 +
              <br />
              Prize Money Awarded
            </p>
          </div>
          <JoinCommunity
            label="Join Topcoder Blockchain Community"
          />
          <div styleName="challengeCardsContainer">
            <ChallengeCard
              imgUrl={ChallengeImgRefugees}
              title="Refugees Challenge"
              text={(
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
                </div>
              )}
              winners={(
                <div>
                  <h3>
                    Winning Team
                  </h3>
                  <p>
                    unCHAINed
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Trevor Campbell (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/tdcampbell/"
                    >
                      tdcampbell
                    </Link>
                    ), Todd Schultz (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/tschultz1216/"
                    >
                      tschultz1216
                    </Link>
                    ), Sam Blumenthal (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/sam.blumenthal/"
                    >
                      sam.blumenthal
                    </Link>
                    ), Gurmeet Budhraja (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/khojsolutions/"
                    >
                      khojsolutions
                    </Link>
                    ), Madhu Machavarapu (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/94madhu94/"
                    >
                      94madhu94
                    </Link>
                    ), Urja Pawar (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/urjapawar/"
                    >
                      urjapawar
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Detail
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=HDWE0cKNcZM&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                  <br />
                  <h3>
                    Runner-up
                  </h3>
                  <p>
                    Arcadia
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Elisa Pasquali (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/epg/"
                    >
                      epg
                    </Link>
                    ), Ana Zamfir (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/ancaz/"
                    >
                      ancaz
                    </Link>
                    ), Ioana Stanescu (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/osninja/"
                    >
                      osninja
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Details
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=MvGXMZ9bsCQ&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                </div>
              )}
            />
            <ChallengeCard
              imgUrl={ChallengeImgDemocracy}
              title="Democracy Challenge"
              text={(
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
                </div>
              )}
              winners={(
                <div>
                  <h3>
                    Winning Team
                  </h3>
                  <p>
                    Popchain*
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Val Denay Mack (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/valem21/"
                    >
                      valem21
                    </Link>
                    ), Gael Gundin (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/wapinpana/"
                    >
                      wapinpana
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Detail
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=QHJfLn0nwpM&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                  <br />
                  <h3>
                    Runner-up
                  </h3>
                  <p>
                    Akshar
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Rahul Bansal (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/rahulb/"
                    >
                      rahulb
                    </Link>
                    ), Siddharth Swarnkar (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/siddharthsoni/"
                    >
                      siddharthsoni
                    </Link>
                    ), Sundari Narayan Swami (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/sswami/"
                    >
                      sswami
                    </Link>
                    ), Bhavyaa Rastogi (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/krusherz/"
                    >
                      krusherz
                    </Link>
                    ), Carlos Rojas Noveron (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/CarlosNoveron/"
                    >
                      CarlosNoveron
                    </Link>
                    ), Dr. Hugh Gosnell (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/hugh_g/"
                    >
                      hugh_g
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Details
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=0Onj1IhtWgs&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                </div>
              )}
            />
            <ChallengeCard
              imgUrl={ChallengeImgHardware}
              title="Hardware Challenge"
              text={(
                <div>
                  As more and more blockchain for social impact projects pop up,
                  a pattern of problems has arisen. How do we reduce the need
                  for human verification? How do we allow for localized
                  blockchain access in low infrastructure areas? How do we
                  create trusted automated interactions between IoT devices?
                  There is an increasing need for reliable hardware
                  architectures to support blockchain solutions. Without those,
                  blockchain remains out of reach for the majority.
                </div>
              )}
              winners={(
                <div>
                  <h3>
                    Winning Team
                  </h3>
                  <p>
                    Kidner Project
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Sajida Zouarhi (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/sajz/"
                    >
                      SajZ
                    </Link>
                    ), Noah Basri (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/noah-basri/"
                    >
                      Noah-Basri
                    </Link>
                    ), Maroussia Arnault (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/marou_kid/"
                    >
                      Marou_Kid
                    </Link>
                    ), Amelia Lintern-Smith (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/amelials/"
                    >
                      amelials
                    </Link>
                    ), Clément Massonnaud (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/clemass/"
                    >
                      CleMass
                    </Link>
                    ), Mathieu Vincens (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/Mathvincens/"
                    >
                      Mathvincens
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Detail
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=Y_Td2_0rxYo&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                  <br />
                  <h3>
                    Runner-up
                  </h3>
                  <p>
                    Aphetor
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Alexander S. Blum (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/ablumbc/"
                    >
                      ablumbc
                    </Link>
                    ), Meredith Finkelstein (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/msrobot0/"
                    >
                      msrobot0
                    </Link>
                    ), Seth Weiner (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/sethweiner/"
                    >
                      sethweiner
                    </Link>
                    ), Chris Jaroszewski (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/CJaroszewski/"
                    >
                      Cjaroszewski
                    </Link>
                    ) , Peter Lyons (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/anemas971/"
                    >
                      Anemas971
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Details
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=bHTaiihtlm8&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                </div>
              )}
            />
            <ChallengeCard
              imgUrl={ChallengeImgAgriculture}
              title="Agriculture Challenge"
              text={(
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
                </div>
              )}
              winners={(
                <div>
                  <p>
                    This sub-challenge witnessed a tie
                  </p>
                  <h3>
                    Winning Teams
                  </h3>
                  <p>
                    Team 1: Greenblocks
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Philipp Beer (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/Depose/"
                    >
                      Depose
                    </Link>
                    ), Lewis Daly (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/lwilld/"
                    >
                      lwilld
                    </Link>
                    ), Billy Garrison (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/BillyGarrison/"
                    >
                      BillyGarrison
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Detail
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=DGyOvjV9I90&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                  <br />
                  <p>
                    Team 2: Thor
                  </p>
                  <h3>
                    Team members
                  </h3>
                  <p>
                    Ylli Vllasolli (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/Team-Thor/"
                    >
                      Team-Thor
                    </Link>
                    ), Charlotte Stephens (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/Charlotte-Thor/"
                    >
                      Charlotte-Thor
                    </Link>
                    ), Bayo Akins (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/BayoAkins/"
                    >
                      Bayoakins
                    </Link>
                    ), Erica Sundberg (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/e5r34t/"
                    >
                      e5r34t
                    </Link>
                    ), Stephen Jackson (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/stevejaxon/"
                    >
                      stevejaxon
                    </Link>
                    ), Ife Nkechukwu (
                    <Link
                      openNewTab
                      to="https://www.topcoder.com/members/ife-thor/"
                    >
                      ife-thor
                    </Link>
                    )
                  </p>
                  <h3>
                    Project Detail
                  </h3>
                  <p>
                    <Link
                      openNewTab
                      to="https://www.youtube.com/watch?v=c4YUOoE7Cyc&feature=youtu.be"
                    >
                      watch this video
                    </Link>
                  </p>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
