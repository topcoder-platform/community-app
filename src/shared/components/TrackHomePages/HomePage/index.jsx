/**
 * Home Page Component
 */
/* eslint-disable react/no-danger */
/* eslint-disable prefer-destructuring */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import { processLinkData } from 'utils/track-homepages';
import Welcome from './Welcome';
import TipsQuotes from './TipsQuotes';
import Tutorials from './Tutorials';
import ImportantPolicies from './ImportantPolicies';
import CompetitionLeaderboard from './CompetitionLeaderboard';

import './styles.scss';

const converter = new showdown.Converter();

const HomePage = ({ homePage, auth }) => {
  let result = null;
  let competitionTypes = {};
  let tcoLeaderboard = {};
  let tipsQuotes = {};
  let importantPolicies = {};
  let tutorials = {};
  const welcome = {};

  // Process Welcome
  welcome.track = homePage.track;
  welcome.title = homePage.introTitle;
  welcome.text = homePage.introText;
  welcome.footerText = homePage.introFooterText;
  welcome.primaryButton = {
    URL: homePage.primaryButtonUrl,
    text: homePage.primaryButtonText,
  };
  if (homePage.videoOrImage) {
    const media = [];
    const mediaFile = {};
    media.push(homePage.videoOrImage);
    _.set(mediaFile, 'Media', media);
    result = processLinkData(mediaFile, homePage.includes);
    if (result.Media.length > 0) {
      welcome.media = result.Media[0];
    }
  }

  // Process Competition Type
  if (homePage.competitionTypes) {
    _.set(competitionTypes, 'CompetitionTypes', homePage.competitionTypes);
    result = processLinkData(competitionTypes, homePage.includes);
    if (result.CompetitionTypes) {
      competitionTypes = _.assign({}, result.CompetitionTypes);
    }
  }

  // Process TCO Leaderboard
  if (homePage.tcoLeaderboard) {
    _.set(tcoLeaderboard, 'TCOLeaderboard', homePage.tcoLeaderboard);
    result = processLinkData(tcoLeaderboard, homePage.includes);
    if (result.TCOLeaderboard) {
      tcoLeaderboard = _.assign({}, result.TCOLeaderboard);
    }
  }

  // Process Tips&Quotes
  if (homePage.tipsQuotes) {
    _.set(tipsQuotes, 'TipsQuotes', homePage.tipsQuotes);
    result = processLinkData(tipsQuotes, homePage.includes);
    if (result.TipsQuotes) {
      tipsQuotes = _.assign({}, result.TipsQuotes);
    }
  }

  // Process Important Policies
  if (homePage.importantPolicies) {
    _.set(importantPolicies, 'ImportantPolicies', homePage.importantPolicies);
    result = processLinkData(importantPolicies, homePage.includes);
    if (result.ImportantPolicies) {
      importantPolicies = _.assign({}, result.ImportantPolicies);
    }
  }

  // Process Tutorials
  if (homePage.tutorials) {
    _.set(tutorials, 'Tutorials', homePage.tutorials);
    result = processLinkData(tutorials, homePage.includes);
    if (result.Tutorials) {
      tutorials = _.assign({}, result.Tutorials);
    }
  }


  return (
    <div styleName="outer-container">
      <div styleName="page">
        <div styleName="welcome">
          <Welcome data={welcome} />
        </div>
        <div styleName="body">
          <CompetitionLeaderboard
            data={{ competitionTypes, tcoLeaderboard }}
            track={homePage.track}
          />
        </div>
        <div styleName="tips-quotes">
          <h1>
Tips & Quotes
          </h1>
          <div
            styleName="text"
            dangerouslySetInnerHTML={
              { __html: converter.makeHtml(tipsQuotes.description) }
            }
          />
          <TipsQuotes data={tipsQuotes} />
        </div>
        <div styleName="important-policies">
          <h1>
Important Policies
          </h1>
          <div
            styleName="text"
            dangerouslySetInnerHTML={
              { __html: converter.makeHtml(importantPolicies.description) }
            }
          />
          <ImportantPolicies data={importantPolicies} />
          <div styleName="button-wrapper-learn-more">
            <PrimaryButton to={importantPolicies.learnMore} openNewTab>
Learn More
            </PrimaryButton>
          </div>
        </div>
        <div styleName={`tutorials ${auth.user ? 'last-section' : ''}`}>
          <h1>
Tutorials
          </h1>
          <div
            styleName="text"
            dangerouslySetInnerHTML={
              { __html: converter.makeHtml(tutorials.description) }
            }
          />
          <Tutorials data={tutorials} />
          <div styleName="button-wrapper-learn-more">
            <PrimaryButton to={tutorials.learnMore} openNewTab>
Learn More
            </PrimaryButton>
          </div>
        </div>
        <div styleName={`sign-up ${auth.user ? 'hidden' : ''}`}>
          <p>
Ready to Design? Click here to sign up with Topcoder!
          </p>
          <div styleName="button-wrapper-view-all">
            <PrimaryButton to="/">
Sign Up Now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  homePage: PT.shape().isRequired,
  auth: PT.shape().isRequired,
};

export default HomePage;
