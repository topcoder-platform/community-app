/* eslint-disable class-methods-use-this */
/**
 * The core article card rendering.
 */

import _ from 'lodash';
import { fixStyle } from 'utils/contentful';
import { localTime } from 'utils/tc';
import { logger } from 'topcoder-react-lib';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import { config, Link } from 'topcoder-react-utils';
import markdown from 'utils/markdown';
import ReactDOMServer from 'react-dom/server';
// SVG assets
import ThumbUpIcon from 'assets/images/ico-thumb-up.svg';
import CommentIcon from 'assets/images/ico-comment.svg';
import TodayIcon from 'assets/images/ico-today.svg';
import PersonIcon from 'assets/images/ico-person.svg';
import PlayIcon from 'assets/images/ico-play.svg';
import ReadMoreArrow from 'assets/images/read-more-arrow.svg';
import qs from 'qs';

const htmlToText = require('html-to-text');

// date/time format to use for the creation date
const FORMAT = 'MMM DD, YYYY';
// date/time format for 'Forum post' cards is different from others
const FORUM_POST_FORMAT = 'MMM DD, YYYY [at] h:mm A';
// max length for the title of the 'Article small' cards
const ART_SMALL_TITLE_MAX_LENGTH = 60;
// Article large card 'breakpoint'
const ARTICLE_LARGE_BREAKPOINT = 473;
// character length for the content preview
const CONTENT_PREVIEW_LENGTH = 110;

class ArticleCard extends React.Component {
  constructor(props) {
    super(props);
    // containerRef is used to get the card width, in order to customize
    // the appearance of 'Article large' cards.
    this.containerRef = React.createRef();
  }

  cardClick(e, articlePageUrl, articlePageTarget) {
    // do nothing for clicks on links
    if (e.target.tagName.toLowerCase() === 'a') return;
    if (articlePageTarget === '_self') {
      window.location.href = articlePageUrl;
    } else {
      window.open(articlePageUrl, articlePageTarget);
    }
  }

  render() {
    const {
      id,
      article,
      articleCard,
      contentAuthor,
      featuredImage,
      theme,
      themeName,
    } = this.props;

    if (!theme) {
      // eslint-disable-next-line no-console
      console.log('ArticleCard: missing theme property');
    }

    // determine if article cards will redirect to external link or article details page
    const articlePageUrl = article.externalArticle && article.contentUrl
      ? article.contentUrl
      : `${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/${article.slug || article.title}`;
    const articlePageTarget = article.externalArticle && article.contentUrl
      ? '_blank'
      : '_self';

    /**
     * Applies additional styles (background img) to the container
     * Only for 'Video' cards when a featuredImage is available
     */
    const getContainerStyle = () => {
      if (themeName === 'Video' && featuredImage) {
        return _.merge({
          backgroundImage: `url(${featuredImage.file.url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }, fixStyle(articleCard.extraStylesForContainer));
      }
      return fixStyle(articleCard.extraStylesForContainer);
    };

    /**
     * format counts (upvotes and comments count) when greater than 999
     */
    const formatCount = (count) => {
      if (typeof count !== 'number') {
        logger.error("'count' (article 'upvotes' or 'commentsCount' property) should be a number");
      }
      if (count > 999) {
        return `${(Math.floor(count / 1000))}K`;
      }
      return count;
    };

    /**
     * On desktops, the appearance of the 'Article large' card changes
     * depending on the card width: if the card width is lower than
     * `ARTICLE_LARGE_BREAKPOINT`, then the creation date and read time
     * won't be displayed.
     */
    const showArticleInfo = () => {
      if (themeName !== 'Article large') {
        // this method is only relevant to the 'Article large'
        // cards. Showing / hiding element for other types of card
        // will be handled by CSS rules
        return true;
      }
      if (
        this.containerRef
        && this.containerRef.current
        && this.containerRef.current.offsetWidth < ARTICLE_LARGE_BREAKPOINT
      ) {
        // hide element when width < breakpoint
        return false;
      }
      // show element
      return true;
    };

    // truncate title for 'Article small' cards
    const title = (
      themeName === 'Article small'
      && article.title.length > ART_SMALL_TITLE_MAX_LENGTH)
      ? `${article.title.substring(0, ART_SMALL_TITLE_MAX_LENGTH)}...`
      : article.title;

    // truncate content for 'Article large' cards
    const content = themeName === 'Article large' || themeName === 'Recommended'
      ? `${htmlToText.fromString(
        ReactDOMServer.renderToString(markdown(article.content)),
        {
          ignoreHref: true,
          ignoreImage: true,
          singleNewLineParagraphs: true,
          uppercaseHeadings: false,
        },
      ).substring(0, CONTENT_PREVIEW_LENGTH)}...`
      : undefined;

    // set the correct format to apply to the `article.creationDate`
    let datetimeFormat = FORMAT;
    if (themeName === 'Forum post') {
      datetimeFormat = FORUM_POST_FORMAT;
    }

    return (
      <div
        id={id}
        ref={this.containerRef}
        className={theme.container}
        style={getContainerStyle()}
      >
        <div
          className={theme.contentWrapper}
          style={fixStyle(articleCard.extraStylesForContentWrapper)}
        >
          <div
            className={theme.content}
            onClick={e => this.cardClick(e, articlePageUrl, articlePageTarget)}
            onKeyPress={e => this.cardClick(e, articlePageUrl, articlePageTarget)}
            role="button"
            tabIndex="0"
          >
            <div className={theme.main}>
              <div className={theme.playIconContainer}>
                <div className={theme.playIconWrapper}>
                  <PlayIcon className={theme.playIcon} />
                </div>
              </div>
              <div className={theme.tags}>
                {
                  /* eslint-disable react/no-array-index-key */
                  themeName !== 'Recommended' && article.tags && article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={theme.tag}
                      title={`Search for articles labelled as ${tag}`}
                    >
                      <Link to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify({ tags: tag })}`} key={`${tag}`}>{tag}</Link>
                    </span>
                  ))
                  /* eslint-enable react/no-array-index-key */
                }
              </div>
              <div className={theme.readTime}>
                <p>{article.readTime}</p>
              </div>
              <h3 className={theme.title}>
                <Link
                  to={articlePageUrl}
                  openNewTab={articlePageTarget === '_blank'}
                  title={article.title}
                >
                  {title}
                </Link>
              </h3>
              <div className={theme.contentPreview}>
                <p>{content}</p>
              </div>
              {
                themeName !== 'Recommended' ? (
                  <div className={theme.infoContainer}>
                    <div className={theme.articleInfo}>
                      <div className={theme.authors}>
                        {
                          contentAuthor && contentAuthor.length > 0 ? (
                            contentAuthor.map(author => (
                              <div key={author.key || author.name} className={theme.author}>
                                {
                                  author.file ? (
                                    <div className={theme.avatarWrapper}>
                                      <img src={author.file.url} alt={`${author.name} avatar`} />
                                    </div>
                                  ) : (
                                    <div className={theme.iconWrapper}>
                                      <PersonIcon className={theme.personIcon} />
                                    </div>
                                  )
                                }
                                <Link
                                  to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify({ author: author.name })}`}
                                  key={`${author.name}`}
                                  title={`Search for articles from ${author.name}`}
                                  className={theme.authorLink}
                                >
                                  {author.tcHandle}
                                </Link>
                              </div>
                            ))
                          ) : null
                        }
                      </div>
                      {
                        showArticleInfo() && (
                          <div className={theme.creationDate}>
                            <TodayIcon className={theme.calendarIcon} />
                            <p>{localTime(article.creationDate, datetimeFormat)}</p>
                          </div>
                        )
                      }
                      {
                        showArticleInfo() && (
                          <p className={theme.readTimeInfo}>
                            {themeName === 'Article large' && contentAuthor && contentAuthor.length > 0 ? <span>&nbsp;.&nbsp;</span> : null}
                            {
                              contentAuthor && contentAuthor.length > 0 ? (
                                <Link
                                  to={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}?${qs.stringify({ author: contentAuthor[0].name })}`}
                                  key={`${contentAuthor[0].name}`}
                                  title={`Search for articles from ${contentAuthor[0].name}`}
                                >
                                  {contentAuthor[0].name}
                                </Link>
                              ) : null
                            }
                          </p>
                        )
                      }
                    </div>
                    {
                      (article.upvotes || article.commentsCount) && (
                        <div className={theme.articleStats}>
                          {
                            article.upvotes && (
                              <div className={theme.stat}>
                                <ThumbUpIcon className={theme.statIcon} />
                                <p>{formatCount(article.upvotes)}</p>
                              </div>
                            )
                          }
                          {
                            article.commentsCount && (
                              <div className={theme.stat}>
                                <CommentIcon className={theme.statIcon} />
                                <p>{formatCount(article.commentsCount)}</p>
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                ) : (
                  <Link
                    to={articlePageUrl}
                    className={theme.readMore}
                    openNewTab={articlePageTarget === '_blank'}
                  >
                    Read More <ReadMoreArrow />
                  </Link>
                )
              }
            </div>
            {
              (
                (themeName === 'Article small' || themeName === 'Article large' || themeName === 'Recommended')
                && featuredImage
                && (
                  <div
                    className={themeName === 'Recommended' ? theme.imageRecommended : theme.image}
                    style={{
                      backgroundImage: `url(${featuredImage.file.url})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                    }}
                  />
                )
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

ArticleCard.defaultProps = {
  contentAuthor: null,
  featuredImage: null,
};

ArticleCard.propTypes = {
  id: PT.string.isRequired,
  article: PT.shape().isRequired,
  articleCard: PT.shape().isRequired,
  contentAuthor: PT.arrayOf(PT.shape()),
  featuredImage: PT.shape(),
  theme: PT.shape({
    container: PT.string.isRequired,
    contentWrapper: PT.string.isRequired,
    content: PT.string.isRequired,
    main: PT.string.isRequired,
    playIconContainer: PT.string.isRequired,
    playIconWrapper: PT.string.isRequired,
    playIcon: PT.string.isRequired,
    tags: PT.string,
    tag: PT.string,
    readTime: PT.string.isRequired,
    title: PT.string.isRequired,
    contentPreview: PT.string.isRequired,
    infoContainer: PT.string.isRequired,
    articleInfo: PT.string.isRequired,
    authors: PT.string.isRequired,
    author: PT.string.isRequired,
    avatarWrapper: PT.string.isRequired,
    iconWrapper: PT.string.isRequired,
    personIcon: PT.string.isRequired,
    creationDate: PT.string.isRequired,
    calendarIcon: PT.string.isRequired,
    readTimeInfo: PT.string.isRequired,
    articleStats: PT.string.isRequired,
    stat: PT.string.isRequired,
    statIcon: PT.string.isRequired,
    image: PT.string.isRequired,
    imageRecommended: PT.string,
    readMore: PT.string,
    authorLink: PT.string,
  }).isRequired,
  themeName: PT.string.isRequired,
};

export default themr('ArticleCard')(ArticleCard);
