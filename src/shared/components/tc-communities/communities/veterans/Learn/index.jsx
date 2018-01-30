/**
 * Static implementation of Learn page for QA community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */

import JoinCommunity from 'containers/tc-communities//JoinCommunity';
import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import joinButtonStyle from 'topcoder-react-ui-kit/src/shared/components/buttons/themes/primary.scss';
import style from './style.scss'; // eslint-disable-line no-unused-vars

export default function Learn({ member }) {
  return (
    <main>
      <div styleName="style.headerBlock">
        <h1>LEARNING & CERTIFICATION</h1>
        <p>
          Just like our members, our learning paths are constantly evolving.
          Deepen your knowledge, get hands-on experience with industry-specific
          software, and hone the skills you need to succeed.
        </p>
      </div>
      {
        member ? null : (
          <div styleName="style.joinBlock">
            <h1>Topcoder for Veterans 101</h1>
            <p>
              Before you can compete in challenge, you need to sign up for
              Topcoder. It’s free and easy to get started right away. Once you
              complete your Topcoder registration, we will also ask you to
              verify that you are currently in the service or reserves, or have
              been honorably discharged.
            </p>
            <JoinCommunity
              label="Join Now"
              theme={{
                link: joinButtonStyle,
              }}
            />
          </div>
        )
      }
      <div styleName="style.cardsBlock">
        <div styleName="style.card style.card-01">
          <div styleName="style.cardImage" />
          <div styleName="style.cardContent">
            <h1>The Types of Challenges</h1>
            <p>
              There are three main tracks: design, development, and data science.
              Whether you’re looking to design a landing page, solve a coding
              problem, or submit a winning algorithm, there’s a challenge for you.
            </p>
            <PrimaryButton
              theme={{ button: style.readMoreButton }}
              to="https://help.topcoder.com/hc/en-us"
            >Read More</PrimaryButton>
          </div>
        </div>
        <div styleName="style.card style.card-02">
          <div styleName="style.cardImage" />
          <div styleName="style.cardContent">
            <h1>Getting Paid</h1>
            <p>
              With Topcoder, you get paid for winning challenges, not for hours
              worked. The reward varies for each challenge — from checkpoint to
              final round — but you’ll always know in advance of competing.
            </p>
            <PrimaryButton
              theme={{ button: style.readMoreButton }}
              to="https://help.topcoder.com/hc/en-us/sections/203968098-Getting-Paid"
            >Read More</PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
}

Learn.propTypes = {
  member: PT.bool.isRequired,
};
