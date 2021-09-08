/**
 * Service that fetches blog rss and parses it
 */

import RSSParser from 'rss-parser';
import { isomorphy } from 'topcoder-react-utils';
import _ from 'lodash';
import Axios from 'axios';

const fetchFeed = async (url) => {
  try {
    const response = await Axios.get(url);
    return response.data.replace('<![CDATA[]]>', ''); // <![CDATA[]]> causes parsing failures
  } catch (err) {
    return '';
  }
};

const fetchBlogs = async () => (isomorphy.isServerSide()
  ? new RSSParser().parseString(await fetchFeed('https://topcoder.com/blog/feed')) : Promise.resolve());

/**
  * Gets blogs and returns as a list
  * @param {number} limit The number of blogs to return
  * @param {string} category blog category to fetch
  * @return {Promise} Resulting blogs.
  */
export default async function getBlogs(limit, category = null) {
  const blogs = await fetchBlogs();
  const filteredBlogs = category
    ? blogs.items.filter(
      blog => _.get(blog, 'categories', []).map(c => c.trim()).includes(category),
    ) : blogs.items;
  return filteredBlogs
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, limit);
}
