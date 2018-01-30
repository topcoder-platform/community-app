/**
 * Static implementation of Get Started page for Cognitive community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */

import ImageText from 'components/tc-communities/ImageText2';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import primaryButtonTheme from 'topcoder-react-ui-kit/src/shared/components/buttons/themes/primary.scss';

import cardImg01 from
  'assets/images/communities/cognitive/get-started/card-01.jpg';
import cardImg02 from
  'assets/images/communities/cognitive/get-started/card-02.jpg';

import MonthOfLoveBanner from '../MonthOfLoveBanner';

import NewsSignup from '../NewsSignup';

import style from './style.scss';

export default function GetStarted({ baseUrl }) {
  return (
    <main>
      <h1 styleName="style.pageTitle">
        Getting Started in the Topcoder Cognitive Community
      </h1>
      <MonthOfLoveBanner to={`${baseUrl}/challenges`} />
      <div styleName="style.cardsContainer">
        <ImageText
          imageUrl={cardImg01}
          theme={{
            container: style.cardContainer,
            content: style.cardContent,
            image: style.cardImage,
          }}
        >
          <h1 styleName="style.cardHeading">Current Cognitive Challenges</h1>
          <p styleName="style.cardText">
            Topcoder and IBM have partnered to roll out a series of educational
            challenges that will help you learn everything you need to know to
            excel with cognitive technologies. Once you join the Topcoder
            Cognitive Community, we’ll notify you of the latest challenges as
            they’re released.
          </p>
          <PrimaryButton
            theme={{ button: style.cardButton }}
            to={`${baseUrl}/challenges`}
          >View Challenges</PrimaryButton>
        </ImageText>
        <ImageText
          imageUrl={cardImg02}
          theme={{
            container: style.cardContainer,
            content: style.cardContent,
            image: style.cardImage,
          }}
        >
          <h1 styleName="style.cardHeading">Perks and Prizes</h1>
          <p styleName="style.cardText">
            The Topcoder Cognitive Community is free to join — no strings
            attached. Winning submissions receive financial prizes, which vary
            by challenge. Leading challenge winners are also eligible to win a
            trip to the Topcoder Open to compete live. All that, and some of
            our most talented developers have gone on to work for companies
            like IBM and Google or even start their own businesses. What are
            you waiting for?
          </p>
          <JoinCommunity
            theme={{
              link: {
                ...primaryButtonTheme,
                button: `${primaryButtonTheme.button} ${style.cardButton}`,
              },
            }}
            label="Join The Cognitive Community"
          />
        </ImageText>
      </div>
      <NewsSignup />
    </main>
  );
}

GetStarted.propTypes = {
  baseUrl: PT.string.isRequired,
};
