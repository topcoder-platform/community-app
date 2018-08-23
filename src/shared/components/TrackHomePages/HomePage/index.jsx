/**
 * Home Page Component
 */
/* eslint-disable react/no-danger */
/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import ContentfulLoader from 'containers/ContentfulLoader';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import Welcome from './Welcome';
import TipsQuotes from './TipsQuotes';
import Tutorials from './Tutorials';
import ImportantPolicies from './ImportantPolicies';
import CompetitionLeaderboard from './CompetitionLeaderboard';

import './styles.scss';

const converter = new showdown.Converter();

const HomePageLoader = ({ homePage, auth }) => {
  let competitionTypes = {};
  let tcoLeaderboard = {};
  let tipsQuotes = {};
  let importantPolicies = {};
  let tutorials = {};
  const welcome = {};
  const assetIds = [];
  const entryIds = [];


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
    assetIds.push(homePage.videoOrImage.sys.id);
  }

  // Process Competition Type
  if (homePage.competitionTypes) {
    entryIds.push(homePage.competitionTypes.sys.id);
  }

  // Process TCO Leaderboard
  if (homePage.tcoLeaderboard) {
    entryIds.push(homePage.tcoLeaderboard.sys.id);
  }

  // Process Tips&Quotes
  if (homePage.tipsQuotes) {
    entryIds.push(homePage.tipsQuotes.sys.id);
  }

  // Process Important Policies
  if (homePage.importantPolicies) {
    entryIds.push(homePage.importantPolicies.sys.id);
  }

  // Process Tutorials
  if (homePage.tutorials) {
    entryIds.push(homePage.tutorials.sys.id);
  }

  return (
    <ContentfulLoader
      assetIds={assetIds}
      entryIds={entryIds}
      render={(data) => {
        welcome.media = data.assets.items[homePage.videoOrImage.sys.id].fields;
        competitionTypes = data.entries.items[homePage.competitionTypes.sys.id].fields;
        tcoLeaderboard = homePage.tcoLeaderboard
          ? data.entries.items[homePage.tcoLeaderboard.sys.id].fields : null;
        tipsQuotes = data.entries.items[homePage.tipsQuotes.sys.id].fields;
        importantPolicies = data.entries.items[homePage.importantPolicies.sys.id].fields;
        tutorials = data.entries.items[homePage.tutorials.sys.id].fields;
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
                  {
                    importantPolicies.sectionTitle || 'Important Policies'
                  }
                </h1>
                <div
                  styleName="text"
                  dangerouslySetInnerHTML={
                    { __html: converter.makeHtml(importantPolicies.description) }
                  }
                />
                <ImportantPolicies data={importantPolicies} />
                {
                  importantPolicies.learnMore
                  && (
                    <div styleName="button-wrapper-learn-more">
                      <PrimaryButton to={importantPolicies.learnMore} openNewTab>
  Learn More
                      </PrimaryButton>
                    </div>
                  )
                }
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
                {
                  tutorials.learnMore
                  && (
                    <div styleName="button-wrapper-learn-more">
                      <PrimaryButton to={tutorials.learnMore} openNewTab>
  Learn More
                      </PrimaryButton>
                    </div>
                  )
                }
              </div>
              <div styleName={`sign-up ${auth.user ? 'hidden' : ''}`}>
                <p>
Ready to Compete? Click here to sign up with Topcoder!
                </p>
                <div styleName="button-wrapper-view-all">
                  <PrimaryButton to="/register">
Sign Up Now
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

HomePageLoader.propTypes = {
  homePage: PT.shape().isRequired,
  auth: PT.shape().isRequired,
};

export default HomePageLoader;
