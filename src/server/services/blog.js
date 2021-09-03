/**
 * Service that fetches blog rss and parses it
 */

import fs from 'fs';
import path from 'path';
import RSSParser from 'rss-parser';
import { isomorphy } from 'topcoder-react-utils';
import _ from 'lodash';

const MOCK_DATA_PATH = path.resolve(__dirname, '../../assets/mock-data/mock-blog-feed.rss');
const mockBlogs = isomorphy.isServerSide()
  ? new RSSParser().parseString(fs.readFileSync(MOCK_DATA_PATH)) : Promise.resolve();

/**
 * Gets blogs and returns as a list
 * @param {number} limit The number of blogs to return
 * @param {string} category blog category to fetch
 * @return {Promise} Resulting blogs.
 */
export default async function getBlogs(limit, category = null) {
  const blogs = await mockBlogs;
  const filteredBlogs = category
    ? blogs.items.filter(
      blog => _.get(blog, 'categories', []).map(c => c.trim()).includes(category),
    ) : blogs.items;
  return filteredBlogs
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, limit);
}
