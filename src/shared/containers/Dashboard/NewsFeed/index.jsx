/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/**
 * SlashTC NewsFeed container component
 */
import React, { useState, useEffect } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import Masonry from 'react-masonry-css';
import { config } from 'topcoder-react-utils';
import moment from 'moment';
import darkTheme from './themes/dark.scss';

const htmlToText = require('html-to-text');

const THEMES = {
  dark: darkTheme,
};
const MAX_NEWS_TEXT_LEN = 85;

function NewsFeedContainer() {
  const [newsData, setNewsData] = useState();
  const theme = THEMES.dark; // for v1 only dark theme

  useEffect(() => {
    async function fetchData() {
      const isProd = config.URL.FORUMS_VANILLA === 'https://discussions.topcoder.com';
      const result = await fetch(`/api/cdn/public/forums/discussions?categoryID=${isProd ? 1441 : 2716}`);
      const data = await result.json();
      setNewsData(data.slice(0, 6));
    }
    fetchData();
  }, []);

  return !newsData ? <LoadingIndicator /> : (
    <div className={theme.container}>
      <div className={theme.head}>
        <h6>News Feed</h6>
        <a href={`${config.URL.FORUMS_VANILLA}/categories/topcoder-news-updates`} target="_blank" rel="noreferrer">View all</a>
      </div>
      <Masonry
        breakpointCols={{
          default: 3,
          1024: 2,
          425: 1,
        }}
        className="newsfeed-masonry-grid"
        columnClassName="newsfeed-masonry-grid_column"
      >
        {
          newsData.map((item) => {
            const cont = htmlToText.fromString(
              item.body,
              {
                ignoreHref: true,
                ignoreImage: true,
                singleNewLineParagraphs: true,
                uppercaseHeadings: false,
              },
            );
            return (
              <div className="newsItem" key={item.discussionID}>
                <div className="date">{moment(item.dateInserted).format('MMM D, YYYY')}</div>
                <a className="title" target="_blank" rel="noreferrer" href={item.url}>{item.name}</a>
                <div className="cont">
                  {
                    cont.length > MAX_NEWS_TEXT_LEN ? (
                      <React.Fragment>
                        {`${cont.substring(0, MAX_NEWS_TEXT_LEN)}... `}
                        <a className="readmore" target="_blank" rel="noreferrer" href={item.url}>Read more</a>
                      </React.Fragment>
                    ) : cont
                  }
                </div>
              </div>
            );
          })
        }
      </Masonry>
    </div>
  );
}

export default NewsFeedContainer;
