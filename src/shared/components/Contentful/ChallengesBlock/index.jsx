/**
 * Displays a few challenge cards and the link to challenge listing.
 */

import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import Carousel from 'nuka-carousel';
import ArrowNext from 'assets/images/arrow_right.svg';
import ArrowPrev from 'assets/images/arrow-left.svg';

import Card from './Card';

import './style.scss';

export default function ChallengesBlock({
  baseUrl,
  challenges,
  fields,
}) {
  const challengesToRender = challenges.slice(0, fields.limit || 10);
  return (
    <div styleName="container">
      <h1 styleName="title">{fields.title}</h1>
      <div styleName="list">
        {
            challengesToRender.length > 2 ? (
              <Carousel
                dragging={false}
                slidesToShow={3}
                styleName="multiContent"
                framePadding="80px"
                heightMode="max"
                cellSpacing={30}
                autoplay
                renderCenterLeftControls={({ previousSlide }) => (
                  <a
                    onClick={previousSlide}
                    onKeyPress={previousSlide}
                    role="button"
                    tabIndex={0}
                    styleName="control"
                  >
                    <ArrowPrev />
                  </a>
                )}
                renderCenterRightControls={({ nextSlide }) => (
                  <a
                    onClick={nextSlide}
                    onKeyPress={nextSlide}
                    role="button"
                    tabIndex={0}
                    styleName="control"
                  >
                    <ArrowNext />
                  </a>
                )}
              >
                {
                  challengesToRender.map(challenge => (
                    <Card
                      baseUrl={baseUrl}
                      challenge={challenge}
                      key={challenge.id}
                    />
                  ))
                }
              </Carousel>
            ) : (
              challengesToRender.map(challenge => (
                <Card
                  baseUrl={baseUrl}
                  challenge={challenge}
                  key={challenge.id}
                />
              ))
            )
          }
      </div>
      {
        fields.buttonText && fields.buttonUrl ? (
          <PrimaryButton
            to={fields.buttonUrl}
          >
            {fields.buttonText}
          </PrimaryButton>
        ) : null
      }
    </div>
  );
}

ChallengesBlock.propTypes = {
  baseUrl: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  fields: PT.shape().isRequired,
};
