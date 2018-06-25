/**
 * HowToComplete Component
 */
/* eslint-disable prefer-destructuring */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { processLinkData } from 'utils/track-homepages';
import FAQ from './FAQ';
import Header from './Header';
import StepByStep from './StepByStep';

import './styles.scss';

const HowToCompletePage = ({ howToComplete }) => {
  let faq = {};
  let howToExtras = {};
  let result = null;
  const header = {};
  let steps = {};

  // Process Header
  header.title = howToComplete.introTitle;
  header.text = howToComplete.introText;
  if (howToComplete.timeTable) {
    const timeTable = {};
    _.set(timeTable, 'TimeTable', howToComplete.timeTable);
    result = processLinkData(timeTable, howToComplete.includes);
    if (result.TimeTable) {
      header.table = result.TimeTable;
    }
  }
  if (howToComplete.videoOrImage) {
    const media = [];
    const mediaFile = {};
    media.push(howToComplete.videoOrImage);
    _.set(mediaFile, 'Media', media);
    result = processLinkData(mediaFile, howToComplete.includes);
    if (result.Media.length > 0) {
      header.media = result.Media[0];
    }
  }

  // Process StepByStep
  if (howToComplete.stepByStep) {
    _.set(steps, 'Steps', howToComplete.stepByStep);
    result = processLinkData(steps, howToComplete.includes);
    if (result.Steps.length > 0) {
      steps = result;
    }
  }

  // Process How To Extras
  if (howToComplete.howToExtras) {
    _.set(howToExtras, 'AQs', howToComplete.howToExtras);
    result = processLinkData(howToExtras, howToComplete.includes);
    if (result.AQs) {
      howToExtras = result;
    }
  }
  // Process FAQ
  if (howToComplete.faq) {
    _.set(faq, 'AQs', howToComplete.faq);
    result = processLinkData(faq, howToComplete.includes);
    if (result.AQs) {
      faq = result;
    }
  }


  return (
    <div styleName="outer-container">
      <div styleName="page">
        <div styleName="header">
          <Header data={header} />
        </div>
        <div styleName="steps" id="steps">
          <h1>Step by Step</h1>
          <StepByStep data={steps} />
        </div>
        <div styleName="how-to-extras">
          <h1>How-to Extras</h1>
          <FAQ data={howToExtras} />
        </div>
        <div styleName="faq">
          <h1>FAQ</h1>
          <div styleName="text">Here’s a few answers to our most common questions</div>
          <FAQ data={faq} />
        </div>
      </div>
    </div>
  );
};

HowToCompletePage.propTypes = {
  howToComplete: PT.shape().isRequired,
};

export default HowToCompletePage;
