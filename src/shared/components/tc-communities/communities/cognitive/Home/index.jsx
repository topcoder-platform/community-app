/**
 * Static implementation of Home page for Cognitive community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */

import config from 'utils/config';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import PT from 'prop-types';
import React from 'react';

import { PrimaryButton } from 'components/buttons';
import { Link } from 'utils/router';

import style from './style.scss';

export default function Home({ baseUrl, member }) {
  return (
    <main>
      <div styleName="head-banner">
        <div styleName="head-banner-overlay" />
        <div styleName="head-banner-text-content">
          <h1 styleName="head-banner-title">Topcoder Cognitive Community</h1>
          <p styleName="head-banner-text">
            Join the world’s premier cognitive community and get hands-on
            experience with today’s most cutting-edge technologies and business
            challenges.
          </p>
          <div styleName="head-banner-join-button-wrap">
            <JoinCommunity
              label="Join The Cognitive Community"
            />
          </div>
        </div>
      </div>
      <div styleName="container">
        <div styleName="mission">
          <div styleName="mission-main">
            Cognitive is gaining traction across all industries&nbsp;— from
            financial evaluation tools to sentiment analysis solutions to
            intelligent recommendation bots. But companies need cognitive
            experts to fully realize the power of next&#8209;generation tools
            and solutions.
          </div>
          <div styleName="mission-details">
            By becoming a member of the Topcoder Community and registering for
            this specialized community, you can compete in fun cognitive
            challenges, access educational resources, and win money by solving
            real-life business problems for companies in need of cognitive
            expertise. Develop your skills and you may even win a trip to the
            &zwnj;<a
              href={config.URL.TCO}
              rel="noopener noreferrer"
              styleName="link"
              target="_blank"
            >Topcoder Open</a>,
            our largest competitive programming and design
            competition of the year.
            <PrimaryButton
              theme={{ button: style['mission-details-button'] }}
              to={`${baseUrl}/get-started`}
            >Get Started</PrimaryButton>
          </div>
        </div>
        <div styleName="quote">
          <div styleName="qoute-box">
            <p styleName="qoute-text">
              “Cognitive computing is the next wave of software development,
              and for good reason! The mantra of mobile-first is now being
              replaced by AI-first, and consumer dependency on smartphones will
              soon be replaced by a dependency on cognitive computing — ranging
              from voice controls and natural language parsing to bots.
              Developers with this skill set will be in high demand.”
            </p>
            <p styleName="quote-author-name">Dave Messinger</p>
            <p styleName="qoute-author-who">
              Topcoder VP of Product Architecture & Global Developer Community
              Director
            </p>
          </div>
        </div>
      </div>
      {
        member ? null : (
          <div styleName="joining-is-simple-container">
            <div styleName="joining-is-simple-content">
              <h1 styleName="joining-is-simple-title">
                Joining the Cognitive Community is Simple
              </h1>
              <div styleName="joining-flex">
                <div>
                  <p styleName="joining-is-simple-text">
                    Topcoder and IBM have partnered to bring you all the resources
                    you need to excel with today’s cognitive technologies, like IBM
                    Watson, AI, and chatbots. And in order to participate in
                    cognitive challenges on Topcoder, you’ll need to deploy your
                    code in IBM Cloud Lite.
                  </p>
                  <p styleName="joining-is-simple-text">
                    Also, be sure to check out the cognitive computing zone on
                    &zwnj;<a
                      href="https://www.ibm.com/developerworks/"
                      rel="noopener noreferrer"
                      styleName="link"
                      target="_blank"
                    >IBM developerWorks</a>.
                    There you’ll find how-to content and community
                    expertise to help you succeed with your own cognitive apps and
                    solutions, and get more information on machine learning and AI.
                  </p>
                </div>
                <div styleName="joining-howto">
                  <h2 styleName="joining-h2">Get Started Today</h2>
                  <div styleName="joining-point-container">
                    <div styleName="joining-point">1</div>
                    <p styleName="joining-point-text">
                      <JoinCommunity
                        label="Join"
                        theme={{
                          link: {
                            button: style['joining-join-button'],
                          },
                        }}
                      /> the Topcoder Cognitive Community
                    </p>
                  </div>
                  <div styleName="joining-point-container">
                    <div styleName="joining-point">2</div>
                    <p styleName="joining-point-text">
                      Register for
                      &zwnj;<Link
                        openNewTab
                        styleName="link"
                        to={`${baseUrl}/challenges`}
                      >cognitive challenges</Link>
                    </p>
                  </div>
                  <div styleName="joining-point-container">
                    <div styleName="joining-point">3</div>
                    <p styleName="joining-point-text">
                      Compete using
                      &zwnj;<a
                        href="https://www.ibm.com/cloud/lite-account"
                        rel="noopener noreferrer"
                        styleName="link"
                        target="_blank"
                      >IBM Cloud Lite</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div styleName="learn-container">
        <div styleName="learn-content">
          <h1 styleName="learn-title">Learn and Compete</h1>
          <div styleName="style.cardsBlock">
            <div styleName="style.card style.card-01">
              <div styleName="style.cardImage" />
              <div styleName="style.cardContent">
                <h1>Resources</h1>
                <a
                  href="https://www.ibm.com/cloud/lite-account"
                  rel="noopener noreferrer"
                  styleName="card-link"
                  target="_blank"
                >What is IBM Cloud Lite?</a>
                <a
                  href="https://www.ibm.com/developerworks/"
                  rel="noopener noreferrer"
                  styleName="card-link"
                  target="_blank"
                >Explore IBM developerWorks</a>
                <a
                  href="https://developer.ibm.com/events/"
                  rel="noopener noreferrer"
                  styleName="card-link"
                  target="_blank"
                >Take part in a developerWorks Event</a>
                <PrimaryButton
                  theme={{ button: style.readMoreButton }}
                  to={`${baseUrl}/resources`}
                  size="sm"
                >View Resources</PrimaryButton>
              </div>
            </div>
            <div styleName="style.card style.card-02">
              <div styleName="style.cardImage" />
              <div styleName="style.cardContent">
                <h1>Challenges</h1>
                {/* TODO: This should be dynamically populated from the listing. */}
                <Link
                  to={`${baseUrl}/challenges`}
                  styleName="card-link"
                >2017 Humblefool Charity Hackathon</Link>
                <Link
                  to={`${baseUrl}/challenges`}
                  styleName="card-link"
                >IBM Cognitive – Image Recognition Training with PowerAI Notebooks</Link>
                <PrimaryButton
                  theme={{ button: style.readMoreButton }}
                  to={`${baseUrl}/challenges`}
                  size="sm"
                >View All Challenges</PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterSignup
        theme={{
          container: style['newsletter-signup-container'],
        }}
        title="Sign up for our newsletter"
        text="Don’t miss out on the latest Topcoder Cognitive challenges and information!"
        imageSrc="/community-app-assets/themes/cognitive/home/newsletter.jpg"
      />
    </main>
  );
}

Home.defaultProps = {
};

Home.propTypes = {
  baseUrl: PT.string.isRequired,
  member: PT.bool.isRequired,
};
