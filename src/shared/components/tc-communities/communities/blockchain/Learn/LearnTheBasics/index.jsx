import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import PT from 'prop-types';
import React from 'react';
import Section from 'components/tc-communities/Section';
import Text from 'components/tc-communities/Text';
import joinButtonStyle from 'components/buttons/outline/round/open-sans/blue-uppercase.scss';

import { SecondaryButton } from 'topcoder-react-ui-kit';
import { Link } from 'react-router-dom';

import style from './style.scss';

export default function LearnTheBasics({ baseUrl }) {
  return (
    <Section
      title="Learn The Basics"
      theme={{
        container: style.learnBasicsContainer,
      }}
    >
      <Accordion>
        <AccordionItem title="Joining the Blockchain Community">
          <Text>
            <p>
              Join the fastest-growing blockchain community on the world’s
              premier crowdsourcing platform. As a member, you’ll get access to
              all the tools, tutorials, and hands-on challenges you need to
              help you master blockchain. Compete in fun challenges to hone
              your skills and competitive challenges to solve real-life
              problems for businesses&nbsp;— all using today’s most in-demand
              skills and technology.
            </p>
            <JoinCommunity
              label="Join Now"
              theme={{ link: joinButtonStyle }}
            />
          </Text>
        </AccordionItem>
        <AccordionItem title="How to sign up for work">
          <Text>
            <p>
              If you are new to Topcoder, you can register through the
              Blockchain Community by clicking the Join Now button on
              &zwnj;
              <Link to={baseUrl}>
the homepage
              </Link>
.
              For more information on getting started with Topcoder,
              visit
              &zwnj;
              {
                <a
                  href="https://www.topcoder.com/getting-started/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
https://www.topcoder.com/getting-started
                </a>
              }
            </p>
          </Text>
        </AccordionItem>
        <AccordionItem title="How to compete for work">
          <Text>
            <p>
              Once you are registered for the Blockchain community, head to the
              Challenges tab and look for challenges that are still open for
              registration. If you see something that interests you, click on
              it and then you can read the details and register for the challenge.
            </p>
            <SecondaryButton
              openNewTab
              to="https://www.topcoder.com/member-onboarding/choosing-your-first-competition-whats-right-for-you/"
            >
              Learn more
            </SecondaryButton>
          </Text>
        </AccordionItem>
        <AccordionItem title="Payment & Rewards">
          <Text>
            <p>
              Win prize money when you deliver the best solution to a challenge.
              You could also earn more as a copilot or reviewer or even win a
              large cash prize in our yearly tournament, the Topcoder Open.
            </p>
            <SecondaryButton
              openNewTab
              to="https://www.topcoder.com/member-onboarding/winning-getting-paid/"
            >
              Learn more
            </SecondaryButton>
          </Text>
        </AccordionItem>
        <AccordionItem title="Managing your Profile">
          <Text>
            <p>
              Everything to do with managing your profile and preferences can
              be found at
              &zwnj;
              {
                <a
                  href="https://www.topcoder.com/settings/account/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
https://www.topcoder.com/settings/account
                </a>
              }
. If you
              can’t find what you’re looking for, send us a note at
              &zwnj;
              {
                <a
                  href="mailto:support@topcoder.com"
                >
support@topcoder.com
                </a>
              }
.
            </p>
          </Text>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}

LearnTheBasics.propTypes = {
  baseUrl: PT.string.isRequired,
};
