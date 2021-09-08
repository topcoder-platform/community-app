/**
 * Service that fetches blog rss and parses it
 */
import RSSParser from 'rss-parser';
import { config } from 'topcoder-react-utils';
import { logger } from 'topcoder-react-lib';
import _ from 'lodash';

/**
 * Gets blogs and returns as a list
 * @param {number} limit The number of blogs to return
 * @param {string} category blog category to fetch
 * @return {Promise} Resulting blogs.
 */
export default async function getBlogs(limit, category = null) {
  try {
    const feed = await fetch(config.URL.BLOG_FEED);
    const rss = await feed.text();
    const feedBlogs = new RSSParser().parseString(rss.replace('<![CDATA[]]>', ''));
    const blogs = await feedBlogs;
    const filteredBlogs = category
      ? blogs.items.filter(
        blog => _.get(blog, 'categories', []).map(c => c.trim()).includes(category),
      ) : blogs.items;
    return filteredBlogs
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, limit);
  } catch (e) {
    logger.error('getBlogs error', e);
    return [];
  }
}
