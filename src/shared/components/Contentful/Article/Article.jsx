/* eslint-disable react/no-unused-state */
/**
 * The core article rendering.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { fixStyle } from 'utils/contentful';
import { getService } from 'services/contentful';
import MarkdownRenderer from 'components/MarkdownRenderer';
import ReactDOMServer from 'react-dom/server';
import markdown from 'utils/markdown';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import YouTubeVideo from 'components/YouTubeVideo';
import moment from 'moment';
import localStorage from 'localStorage';
import { Helmet } from 'react-helmet';
import {
  config, Link, isomorphy,
} from 'topcoder-react-utils';
import qs from 'qs';
// SVGs and assets
import GestureIcon from 'assets/images/icon-gesture.svg';
import ReadMoreArrow from 'assets/images/read-more-arrow.svg';
import IconFacebook from 'assets/images/icon-facebook.svg';
import IconTwitter from 'assets/images/icon-twitter.svg';
import IconLinkedIn from 'assets/images/icon-linkedIn.svg';

const htmlToText = require('html-to-text');

// character length for the content preview
const CONTENT_PREVIEW_LENGTH = 110;
// Votes local storage key
const LOCAL_STORAGE_KEY = 'VENBcnRpY2xlVm90ZXM=';

export default class Article extends React.Component {
  componentDidMount() {
    const { fields } = this.props;
    this.setState({
      upvotes: fields.upvotes || 0,
      downvotes: fields.downvotes || 0,
    });
  }

  updateVote(type) {
    let userVotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    userVotes = userVotes ? JSON.parse(userVotes) : {};
    const {
      id, spaceName, environment, preview,
    } = this.props;
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
    getService({ spaceName, environment, preview }).articleVote(id, {
      upvotes,
      downvotes,
    })
      .then(() => {
        // Only when Contentful enntry was succesfully updated
        // then we update the local store and the state
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userVotes));
        this.setState({
          upvotes,
          downvotes,
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
    const { upvotes, downvotes } = this.state || {};
    let shareUrl;
    if (isomorphy.isClientSide()) {
      shareUrl = encodeURIComponent(window.location.href);
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

    return (
      <React.Fragment>
        <Helmet>
          <title>{fields.title}</title>
          <meta name="title" property="og:title" content={fields.title} />
          <meta name="description" property="og:description" content={description} />
          <meta name="description" property="description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta name="image" property="og:image" content={fields.featuredImage ? `https:${subData.assets.items[fields.featuredImage.sys.id].fields.file.url}` : null} />
          <meta name="twitter:image" content={fields.featuredImage ? `https:${subData.assets.items[fields.featuredImage.sys.id].fields.file.url}` : null} />
        </Helmet>
        {/* Banner */}
        {
          fields.featuredImage ? (
            <div className={theme.bannerContainer}>
              <svg viewBox="0 25 1050 600" version="1.1" preserveAspectRatio="none" className={theme['site-header-background']}>
                <defs>
                  <clipPath id="user-space" clipPathUnits="userSpaceOnUse">
                    <path id="jagged-top" d="M955.643,455.426c113.929-152.899,130.923-281.812-19.966-387.73 C883.769,31.258,814.91-10.997,685,3c-87.558,9.434-218,32-332,9c-48.207-9.726-146.137-5.765-167.796,6.768 C45.296,99.719-82.626,352.551,69.262,473.459c151.887,120.908,379.734,0.979,533.623,75.92 C756.773,624.319,841.715,608.326,955.643,455.426" />
                  </clipPath>
                </defs>
                <image width="100%" height="100%" preserveAspectRatio="none" href={subData.assets.items[fields.featuredImage.sys.id].fields.file.url} clipPath="url(#user-space)" />
              </svg>
            </div>
          ) : null
        }
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
            <h3 className={theme.label}>categories & Tags</h3>
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
          </div>
          {/* Content */}
          <div className={theme.articleContent}>
            <div className={theme.articleContentTop}>
              <h4 className={theme.articleDate}>{moment(fields.creationDate).format('MMMM D, YYYY')}</h4>
              <h1 className={theme.articleTitle}>{fields.title}</h1>
            </div>
            <MarkdownRenderer markdown={fields.content} {...contentfulConfig} />
            {
              fields.type === 'Video' && fields.contentUrl ? (
                <YouTubeVideo src={fields.contentUrl} />
              ) : null
            }
            {/* Voting */}
            <div className={theme.actionContainer}>
              <div className={theme.action}>
                <div tabIndex={0} role="button" className={theme.circleGreenIcon} onClick={() => this.updateVote('up')} onKeyPress={() => this.updateVote('up')}>
                  <GestureIcon />
                </div>
                <span>
                  {
                    upvotes
                  }
                </span>
              </div>
              <div className={theme.action}>
                <div tabIndex={0} role="button" className={theme.circleRedIcon} onClick={() => this.updateVote('down')} onKeyPress={() => this.updateVote('down')}>
                  <GestureIcon />
                </div>
                <span>{downvotes}</span>
              </div>
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
      </React.Fragment>
    );
  }
}

Article.defaultProps = {
  spaceName: null,
  environment: null,
};

Article.propTypes = {
  id: PT.string.isRequired,
  fields: PT.shape().isRequired,
  theme: PT.shape().isRequired,
  subData: PT.shape().isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
};
