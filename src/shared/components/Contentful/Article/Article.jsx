/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/**
 * The core article rendering.
 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { fixStyle } from 'utils/contentful';
import { getService } from 'services/contentful';
import MarkdownRenderer from 'components/MarkdownRenderer';
import ReactDOMServer from 'react-dom/server';
import markdown from 'utils/markdown';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import YouTubeVideo from 'components/YouTubeVideo';
import Viewport from 'components/Contentful/Viewport';
import moment from 'moment';
import localStorage from 'localStorage';
import { Helmet } from 'react-helmet';
import {
  config, Link, isomorphy,
} from 'topcoder-react-utils';
import qs from 'qs';
import LoginModal from 'components/LoginModal';
import modalStyle from 'components/LoginModal/modal.scss';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import tc from 'components/buttons/themed/tc.scss';
// SVGs and assets
import GestureIcon from 'assets/images/icon-gesture.svg';
import ReadMoreArrow from 'assets/images/read-more-arrow.svg';
import IconFacebook from 'assets/images/icon-facebook.svg';
import IconTwitter from 'assets/images/icon-twitter.svg';
import IconLinkedIn from 'assets/images/icon-linkedIn.svg';
import DiscordIconWhite from 'assets/images/tc-edu/discord-icon-white.svg';
import { getSecureRandomIndex } from 'utils/secureRandom';

const htmlToText = require('html-to-text');

// character length for the content preview
const CONTENT_PREVIEW_LENGTH = 110;
// Votes local storage key
const LOCAL_STORAGE_KEY = 'VENBcnRpY2xlVm90ZXM=';
// def banner image
const DEFAULT_BANNER_IMAGE = 'https://images.ctfassets.net/piwi0eufbb2g/7v2hlDsVep7FWufHw0lXpQ/2505e61a880e68fab4e80cd0e8ec1814/0C37CB5E-B253-4804-8935-78E64E67589E.png?w=1200&h=630';
// random ads banner - left sidebar
const RANDOM_BANNERS = ['6G8mjiTC1mzeSQ2YoUG1gB', '1DnDD02xX1liHfSTf5Vsn8', 'HQZ3mN0rR92CbNTkKTHJ5', '1OLoX8ZsvjAnn4TdGbZESD', '77jn01UGoQe2gqA7x0coQD'];
const RANDOM_BANNER = RANDOM_BANNERS[getSecureRandomIndex(RANDOM_BANNERS.length)];

class Article extends React.Component {
  componentDidMount() {
    const { fields } = this.props;
    this.setState({
      upvotes: fields.upvotes || 0,
      downvotes: fields.downvotes || 0,
      showLogin: false,
      voting: false,
    });
  }

  // eslint-disable-next-line consistent-return
  updateVote(type) {
    const {
      id, spaceName, environment, preview, auth,
    } = this.props;
    // check for auth?
    if (!auth) {
      return this.setState({
        showLogin: true,
      });
    }
    let userVotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    userVotes = userVotes ? JSON.parse(userVotes) : {};
    const articleVote = userVotes[id];
    let { upvotes, downvotes } = this.state;
    // Check if user alredy voted on this article?
    if (!articleVote) {
      // No vote yet. Allow the vote...
      upvotes = type === 'up' ? upvotes + 1 : upvotes;
      downvotes = type === 'down' ? downvotes + 1 : downvotes;
      userVotes[id] = type === 'up' ? 1 : -1;
    } else {
      // Vote exists. Handle vote corrections...
      // eslint-disable-next-line default-case
      switch (articleVote) {
        case 1:
          // user already voted up on the article
          if (type === 'down') {
            upvotes -= 1;
            downvotes += 1;
            userVotes[id] = -1;
          } else {
            upvotes -= 1;
            delete userVotes[id];
          }
          break;
        case -1:
          // user already voted down on the article
          if (type === 'up') {
            upvotes += 1;
            downvotes -= 1;
            userVotes[id] = 1;
          } else {
            downvotes -= 1;
            delete userVotes[id];
          }
          break;
      }
    }
    // Store user action
    this.setState({
      voting: true,
    });
    getService({ spaceName, environment, preview }).articleVote(id, {
      upvotes,
      downvotes,
    }, auth.tokenV3)
      .then(() => {
        // Only when Contentful enntry was succesfully updated
        // then we update the local store and the state
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userVotes));
        this.setState({
          upvotes,
          downvotes,
          voting: false,
        });
      });
  }

  render() {
    const {
      theme, fields, subData, spaceName, environment, preview,
    } = this.props;
    const contentfulConfig = {
      spaceName, environment, preview,
    };
    const {
      upvotes, downvotes, showLogin, voting,
    } = this.state || {};
    let shareUrl;
    if (isomorphy.isClientSide()) {
      shareUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}`);
    }
    const description = htmlToText.fromString(
      ReactDOMServer.renderToString(markdown(fields.content)),
      {
        ignoreHref: true,
        ignoreImage: true,
        singleNewLineParagraphs: true,
        uppercaseHeadings: false,
      },
    ).substring(0, CONTENT_PREVIEW_LENGTH);
    const catsGrouped = _.groupBy(fields.contentCategory, cat => cat.fields.trackParent);
    // captures clicks on article
    // for opening external links in new tab
    const articleClickHandler = (e) => {
      if (e.target.href && fields.openExternalLinksInNewTab !== false) {
        const target = new URL(e.target.href);
        if (!target.host.includes('topcoder')) {
          window.open(e.target.href, '_blank');
          e.preventDefault();
        }
      }
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>{fields.title}</title>
          <meta name="title" property="og:title" content={fields.title} />
          <meta name="description" property="og:description" content={description} />
          <meta name="description" property="description" content={description} />
          <meta name="twitter:title" content={fields.title} />
          <meta name="twitter:description" content={description} />
          <meta name="image" property="og:image" content={fields.featuredImage ? `https:${subData.assets.items[fields.featuredImage.sys.id].fields.file.url}?w=1200&h=630` : DEFAULT_BANNER_IMAGE} />
          <meta name="twitter:image" content={fields.featuredImage ? `https:${subData.assets.items[fields.featuredImage.sys.id].fields.file.url}?w=1200&h=630` : DEFAULT_BANNER_IMAGE} />
          <link rel="alternate" type="application/rss+xml" title="Topcoder Thrive - RSS feed" href="https://topcoder.com/api/feeds/thrive" />
        </Helmet>
        <div className={theme.wrapper}>
          {/* Banner */}
          <div className={fields.featuredImage ? theme.bannerContainer : theme.bannerContainerDefaultImage}>
            <div className={theme.bannerInner}>
              <div className={theme.bannerInnerLeft}>
                <h4 className={theme.articleDate}>{moment(fields.creationDate).format('MMMM D, YYYY')}</h4>
                <h1 className={theme.articleTitle}>{fields.title}</h1>
              </div>
              <div className={theme.bannerInnerRight}>
                {
                fields.featuredImage ? (
                  <div className={theme['site-header-background']}>
                    <svg className={theme.bannerSvg}>
                      <clipPath id="thrive-banner-clip-path" clipPathUnits="objectBoundingBox">
                        <path d="M0.477,1 C0.72,0.999,1,0.804,1,0.56 C1,0.316,0.766,-0.067,0.528,0.021 C0.343,0.089,0.145,-0.088,0.076,0.063 C0.016,0.193,-0.071,0.456,0.101,0.618 C0.274,0.782,0.234,1,0.477,1" />
                      </clipPath>
                    </svg>
                    <div className={theme.bannerClippedImageHolder} style={{ backgroundImage: `url(${subData.assets.items[fields.featuredImage.sys.id].fields.file.url})` }} />
                  </div>
                ) : (
                  <img src={DEFAULT_BANNER_IMAGE} alt="Thrive - default banner" className={theme['site-header-background']} />
                )
              }
              </div>
            </div>
            <img src="https://images.ctfassets.net/piwi0eufbb2g/3StLyQh5ne1Lk9H7C1oVxv/52f17a02122212052e44585d3e79fcf7/29320408-E820-48E1-B0FD-539EAC296910.svg" alt="Thrive banner shape" className={theme.bannerBottShape} />
          </div>
          <div
            className={fields.featuredImage
              ? theme.contentContainerWithBanner : theme.contentContainer}
            style={fixStyle(fields.extraStylesForContainer)}
          >
            <div className={theme.contentLeftBar}>
              {/* Authors */}
              <div className={theme.authorContainer}>
                {
                _.map(fields.contentAuthor, author => (
                  <div key={author.sys.id} className={theme.authorWrapper}>
                    {
                      subData.entries.items[author.sys.id].fields.avatar ? (
                        <ContentfulLoader
                          assetIds={subData.entries.items[author.sys.id].fields.avatar.sys.id}
                          preview={preview}
                          spaceName={spaceName}
                          environment={environment}
                          render={avatarData => (
                            <img src={avatarData.assets.items[subData.entries.items[author.sys.id].fields.avatar.sys.id].fields.file.url} alt="article author avatar" className={theme.avatar} />
                          )}
                          renderPlaceholder={LoadingIndicator}
                        />
                      ) : null
                    }
                    <div className={theme.authorInfos}>
                      <span className={theme.name}>
                        {subData.entries.items[author.sys.id].fields.name}
                      </span>
                      {
                        subData.entries.items[author.sys.id].fields.tcHandle ? (
                          <span className={theme.handle}>
                            {subData.entries.items[author.sys.id].fields.tcHandle}
                          </span>
                        ) : null
                      }
                    </div>
                  </div>
                ))
              }
              </div>
              <div className={theme.separator} />
              <h3 className={theme.label}>DURATION</h3>
              <span className={theme.duration}>{fields.readTime}</span>
              <div className={theme.separator} />
              <h3 className={theme.label}>categories</h3>
              {/* Cats */}
              <div className={theme.catsWrapper}>
                {
                  _.keys(catsGrouped).map(k => (
                    <React.Fragment>
                      <div className={theme.catItem} key={k} title={`Search for articles in ${k} category`}>
                        <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}?${qs.stringify({ track: k })}`} key={k} className={theme.catLink}>{k}</Link>
                      </div>
                      <div className={theme.catsContainer}>
                        {
                          _.map(catsGrouped[k], cat => (
                            <div className={theme.catItem} key={cat.sys.id} title={`Search for articles in ${cat.fields.trackParent}:${cat.fields.name} category`}>
                              <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}?${qs.stringify({ track: cat.fields.trackParent, tax: cat.fields.name })}`} key={`${cat.sys.id}`} className={theme.catLink}>{cat.fields.name}</Link>
                            </div>
                          ))
                        }
                      </div>
                    </React.Fragment>
                  ))
                }
              </div>
              <div className={theme.separator} />
              <h3 className={theme.label}>Tags</h3>
              {/* Tags */}
              <div className={theme.tagContainer}>
                {
                _.map(fields.tags, tag => (
                  <div className={theme.tagItem} key={tag} title={`Search for articles labelled as ${tag}`}>
                    <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify({ tags: tag })}`} key={`${tag}`}>{tag}</Link>
                  </div>
                ))
              }
              </div>
              <div className={theme.separator} />
              <h3 className={theme.label}>share</h3>
              <div className={theme.shareButtons}>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                  <IconLinkedIn />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&src=share_button`} target="_blank" rel="noopener noreferrer">
                  <IconFacebook />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                  <IconTwitter />
                </a>
              </div>
              <div className={theme.mobileSeparator} />
              <div className={theme.leftSidebarContent}>
                <Viewport
                  id={fields.leftSidebarContent
                    ? fields.leftSidebarContent.sys.id : RANDOM_BANNER}
                  preview={preview}
                  spaceName={spaceName}
                  environment={environment}
                />
              </div>
            </div>
            {/* Content */}
            <div
              className={theme.articleContent}
              role="presentation"
              onClick={articleClickHandler}
              onKeyPress={articleClickHandler}
            >
              <MarkdownRenderer markdown={fields.content} {...contentfulConfig} />
              {
              fields.type === 'Video' && fields.contentUrl ? (
                <YouTubeVideo src={fields.contentUrl} />
              ) : null
            }
              {/* Voting */}
              <div className={theme.actionContainer}>
                <div className={theme.action}>
                  <div tabIndex={0} role="button" className={voting ? theme.circleGreenIconDisabled : theme.circleGreenIcon} onClick={() => this.updateVote('up')} onKeyPress={() => this.updateVote('up')}>
                    <GestureIcon />
                  </div>
                  <span>
                    {
                    upvotes
                  }
                  </span>
                </div>
                <div className={theme.action}>
                  <div tabIndex={0} role="button" className={voting ? theme.circleRedIconDisabled : theme.circleRedIcon} onClick={() => this.updateVote('down')} onKeyPress={() => this.updateVote('down')}>
                    <GestureIcon />
                  </div>
                  <span>{downvotes}</span>
                </div>
              </div>
              {/* Discord */}
              <div className={theme.actionContainer}>
                <PrimaryButton
                  to="https://discord.gg/topcoder?ref=thrive-article"
                  openNewTab
                  theme={{
                    button: tc['primary-green-md'],
                  }}
                >
                  <DiscordIconWhite style={{ marginRight: '5px' }} /> Chat on Discord
                </PrimaryButton>
              </div>
            </div>
          </div>
          {/* Recommended */}
          {
          fields.recommended ? (
            <div className={theme.recommendedContainer}>
              <div className={theme.recommendedTopShape} />
              <h3 className={theme.recommendedTitle}>Recommended for you</h3>
              <div className={theme.recommended}>
                {
                  _.map(fields.recommended, rec => (
                    <div key={rec.sys.id} className={theme.recommendedCard}>
                      {
                        subData.entries.items[rec.sys.id].fields.featuredImage ? (
                          <ContentfulLoader
                            assetIds={subData.entries.items[rec.sys.id].fields.featuredImage.sys.id}
                            preview={preview}
                            spaceName={spaceName}
                            environment={environment}
                            render={imageData => (
                              <React.Fragment>
                                <div
                                  style={{ backgroundImage: `url(${imageData.assets.items[subData.entries.items[rec.sys.id].fields.featuredImage.sys.id].fields.file.url})` }}
                                  className={theme.recommendedImage}
                                />
                                <div className={theme.recommendedImageBottomShape} />
                              </React.Fragment>
                            )}
                            renderPlaceholder={LoadingIndicator}
                          />
                        ) : null
                      }
                      <h3 className={theme.recommendedCardTitle}>
                        {
                          subData.entries.items[rec.sys.id].fields.externalArticle
                            && subData.entries.items[rec.sys.id].fields.contentUrl ? (
                              <a href={subData.entries.items[rec.sys.id].fields.contentUrl} target="_blank" rel="noopener noreferrer">
                                {subData.entries.items[rec.sys.id].fields.title}
                              </a>
                            ) : (
                              <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${subData.entries.items[rec.sys.id].fields.slug || subData.entries.items[rec.sys.id].fields.title}`}>
                                {subData.entries.items[rec.sys.id].fields.title}
                              </Link>
                            )
                        }
                      </h3>
                      <div className={theme.recommendedCardContent}>
                        {
                          `${htmlToText.fromString(
                            ReactDOMServer.renderToString(markdown(
                              subData.entries.items[rec.sys.id].fields.content,
                            )),
                            {
                              ignoreHref: true,
                              ignoreImage: true,
                              singleNewLineParagraphs: true,
                              uppercaseHeadings: false,
                            },
                          ).substring(0, CONTENT_PREVIEW_LENGTH)}...`
                        }
                      </div>
                      {
                        subData.entries.items[rec.sys.id].fields.externalArticle
                          && subData.entries.items[rec.sys.id].fields.contentUrl ? (
                            <a href={subData.entries.items[rec.sys.id].fields.contentUrl} target="_blank" rel="noopener noreferrer" className={theme.readMore}>
                              Read More <ReadMoreArrow />
                            </a>
                          ) : (
                            <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${subData.entries.items[rec.sys.id].fields.slug || subData.entries.items[rec.sys.id].fields.title}`} className={theme.readMore}>
                              Read More <ReadMoreArrow />
                            </Link>
                          )
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          ) : null
        }
        </div>
        {
          showLogin && (
          <LoginModal
            // eslint-disable-next-line no-restricted-globals
            retUrl={isomorphy.isClientSide() ? location.href : null}
            onCancel={() => this.setState({ showLogin: false })}
            modalTitle="Want to vote?"
            modalText="You must be a Topcoder member to do that."
            utmSource="thrive_article"
            infoNode={<p className={modalStyle.regTxt}>Discover <a href="/community/learn" target="_blank" rel="noreferrer">other features</a> you can access by becoming a member.</p>}
          />
          )
        }
      </React.Fragment>
    );
  }
}

Article.defaultProps = {
  spaceName: null,
  environment: null,
  auth: null,
};

Article.propTypes = {
  id: PT.string.isRequired,
  fields: PT.shape().isRequired,
  theme: PT.shape().isRequired,
  subData: PT.shape().isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  auth: PT.shape(),
};

function mapStateToProps(state) {
  const auth = state.auth && state.auth.profile ? { ...state.auth } : null;
  return {
    auth,
  };
}

export default connect(
  mapStateToProps,
)(Article);
