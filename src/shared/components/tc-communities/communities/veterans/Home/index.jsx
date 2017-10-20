/**
 * Static implementation of Home page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import Section from 'components/tc-communities/Section';
import Banner from 'components/tc-communities/Banner';
import ImageText from 'components/tc-communities/ImageText';
import ResourceCard from 'components/tc-communities/ResourceCard';

import CommunityStats from 'containers/tc-communities/CommunityStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import style from './style.scss';

export default function Home() {
  return (
    <main>
      <Banner
        title="Topcoder Veterans Community"
        text={
          <div>
            <p styleName="paragraph2">
              Transition to a career in technology with our unique platform for military service members and veterans.
            </p>
            <p styleName="paragraph2">
              We help connect talented coders with organizations across the globe in need of your specialized skills.
            </p>
          </div>
        }
        link={{
          title: 'Compete Now',
          url: 'challenges',
        }}
        imageSrc="/themes/veterans/home/banner.jpg"
        theme={{
          container: style.bannerContainer,
        }}
      />

      <CommunityStats />

      <Section
        theme={{
          container: style.linksContainer,
        }}
      >
        <div>
          <ImageText
            title="Why We Started"
            text={
              <div styleName="bottomMargin paragraph">
                <p>
                  Some of the most talented and qualified coders in the world
                  are veterans and active military personnel. The US military
                  has some of the most sophisticated technology platforms and
                  equipment on the planet, which demand the brightest minds
                  available.
                </p>
                <p>
                  Their training and skills help them protect our country from
                  threats. Now, organizations and businesses can benefit from
                  their experience and expertise.
                </p>
                <p>
                  With 250,000 service members exiting the military annually,
                  they need to find opportunities in civilian employment.
                </p>
              </div>
            }
            imageSrc="/themes/veterans/home/image-01.jpg"
          />
          <ImageText
            title="Translating Military Experience into Civilian Employment"
            text={
              <div styleName="bottomMargin paragraph">
                <p>
                  Topcoder recognizes the invaluable experience our veterans
                  and military service members gain during their service.
                </p>
                <p>
                  Yet, there’s often a gap that exists in translating this
                  experience to civilian employment without a college degree.
                </p>
                <p>
                  A study by the nonprofit research group, Center for New
                  American Security, reports that 60% of employers see the
                  translation gap as the biggest obstacle to bringing more vets
                  on board.
                </p>
              </div>
            }
            imageSrc="/themes/veterans/home/image-02.jpg"
          />
          <ImageText
            title="Real-World Experience Counts"
            text={
              <div styleName="bottomMargin paragraph">
                <p>
                  We’ve partnered with the Department of Veterans Affairs to
                  assist in bridging the gap between real-world skills and a
                  career in technology as well as promote this platform.
                </p>
                <p>
                  Together, we’ve developed a coalition of companies that share
                  our vision and are committed to providing job opportunities to
                  members of The <strong>Veterans.Topcoder</strong> community.
                </p>
                <p>
                  If you’ve got what it takes and want to put your experience to
                  work right now, let’s get started.
                </p>
              </div>
            }
            imageSrc="/themes/veterans/home/image-03.jpg"
          />
          <ImageText
            title="How Topcoder.Veterans Works"
            text={
              <div styleName="bottomMargin paragraph">
                <p>
                  The Veterans.Topcoder program was designed to assist
                  military service members and veterans who want to pursue
                  a career in technology into viable job opportunities, which
                  can be difficult to obtain without a college degree.
                </p>
                <p>
                  Joining The Veterans.Topcoder community is free and
                  enables you to compete on projects, earn money and
                  continue to enhance your skills.
                </p>
                <p>
                  It also places you in the spotlight with some of the top
                  technology companies in the world, which also believe in
                  your background and capabilities.
                </p>
              </div>
            }
            imageSrc="/themes/veterans/home/image-05.jpg"
          />
          <ImageText
            title="Tech Talent Is Desperately Needed"
            text={
              <div styleName="bottomMargin paragraph">
                <p>
                  The technology sector will only continue grow. Technology
                  changes rapidly and is a key component of any industry from
                  banking to manufacturing to retail.
                </p>
                <p>
                  Software developers aren’t just needed for companies whose
                  main focus is software, they’re needed to keep many industries
                  on pace with competitors, delivering the options and
                  experiences their clients needs - but there’s a major talent
                  gap.
                </p>
                <p>
                  More than half of global IT leaders predict they will face a
                  lack of IT talent in the next year, as new technology demands
                  outpace the talent supply, according to a new study from
                  Brocade, which surveyed 630 IT leaders in the U.S., U.K.,
                  France, Germany, Australia and Singapore.
                </p>
                <p>
                  Understanding this great need, Veterans.Topcoder seeks to help
                  connect vets with the expertise and skill with the industries that need them most.
                </p>
              </div>
            }
            imageSrc="/themes/veterans/home/image-06.jpg"
          />
        </div>
      </Section>
      <Section
        title="From Our Community"
      >
        <ImageText
          text={
            <div styleName="bottomMargin paragraph">
              <p>
                <em>&ldquo;The Topcoder for Veterans Community
                has provided me with an opportunity to
                further my career for free while applying
                my current knowledge to highly-technical
                and complex projects while making
                money, all under the microscope for some
                of the largest companies in the world. It’s
                been an incredible resource!&rdquo;</em>
              </p>
              <p>
                <strong>Master Sergeant, Tim Clark, USAF</strong>
              </p>
            </div>
          }
          theme={{
            container: style.grayBack,
          }}
          imageSrc="/themes/veterans/home/image-04.jpg"
        />
      </Section>

      <Section
        theme={{
          container: style.hiringSection,
        }}
      >
        <div>
          <p styleName="paragraph">
            Companies Hiring on <strong>Veterans.Topcoder</strong>
          </p>
          <div styleName="logos">
            <img alt="logo-01" src="/themes/veterans/home/logo-01.jpg" />
            <img alt="logo-02" src="/themes/veterans/home/logo-02.jpg" />
            <img alt="logo-03" src="/themes/veterans/home/logo-03.jpg" />
            <img alt="logo-04" src="/themes/veterans/home/logo-04.jpg" />
            <img alt="logo-05" src="/themes/veterans/home/logo-05.jpg" />
          </div>
        </div>
      </Section>

      <Section
        subTitle="Find Out."
        title="What Can You Do?"
      >
        <img alt="card" src="/themes/veterans/home/card-01.jpg" />
        <img alt="card" src="/themes/veterans/home/card-02.jpg" />
        <img alt="card" src="/themes/veterans/home/card-03.jpg" />
        <img alt="card" src="/themes/veterans/home/card-04.jpg" />
        <img alt="card" src="/themes/veterans/home/card-05.jpg" />
        <img alt="card" src="/themes/veterans/home/card-06.jpg" />
        <img alt="card" src="/themes/veterans/home/card-07.jpg" />
      </Section>

      <Section
        subTitle="Create Your Account Today, Start Competing, Learning & Making Money Tomorrow."
        theme={{
          content: style.joinSectionContent,
        }}
        title="Get Started"
      >
        <JoinCommunity
          label="Join"
          theme={{ link: style.primaryButton }}
        />
      </Section>

      <Section
        theme={{
          container: style.resourcesContainer,
        }}
      >
        <ResourceCard
          icon={() => <img alt="icon" src="/themes/veterans/home/icon-01.jpg" />}
          theme={{ link: style.primaryButton }}
          title="Learning & Certification"
          text="Grow your knowledge-base and get Topcoder certified, all for free."
          link={{
            title: 'Learn More',
            url: 'learn',
          }}
        />
        <ResourceCard
          icon={() => <img alt="icon" src="/themes/veterans/home/icon-02.jpg" />}
          theme={{ link: style.primaryButton }}
          title="Explore The Platform"
          text="Explore the features and functionality to see how it can work for you."
          link={{
            title: 'Browse Resources',
            url: 'learn',
          }}
        />
        <ResourceCard
          icon={() => <img alt="icon" src="/themes/veterans/home/icon-03.jpg" />}
          theme={{ link: style.primaryButton }}
          title="Make money"
          text="We reward participants with cash. Produce deliverables as required and make money."
          link={{
            title: 'Learn About Rewards',
            url: 'challenges',
          }}
        />
        <ResourceCard
          icon={() => <img alt="icon" src="/themes/veterans/home/icon-04.jpg" />}
          theme={{ link: style.primaryButton }}
          title="Join Challenges"
          text="We add new challenges and tasks daily. Find projects that fit your skill set."
          link={{
            title: 'View Challenges & Tasks',
            url: 'challenges',
          }}
        />
      </Section>

      <Section
        subTitle="Explore other features and resources on the site."
        title="More Ways to Learn and Connect"
      >
        <img alt="card" src="/themes/veterans/home/card-b-01.jpg" />
        <img alt="card" src="/themes/veterans/home/card-b-02.jpg" />
        <img alt="card" src="/themes/veterans/home/card-b-03.jpg" />
        <img alt="card" src="/themes/veterans/home/card-b-04.jpg" />
        <img alt="card" src="/themes/veterans/home/card-b-05.jpg" />
        <img alt="card" src="/themes/veterans/home/card-b-06.jpg" />
      </Section>
    </main>
  );
}
