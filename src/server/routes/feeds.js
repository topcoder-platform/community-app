/**
 * The routes that expose assets and content from Contentful CMS to the CDN.
 */

import express from 'express';
import RSS from 'rss';
import ReactDOMServer from 'react-dom/server';
import md from 'utils/markdown';
import {
  getService,
} from '../services/contentful';

const cors = require('cors');

const routes = express.Router();

// Enables CORS on those routes according config above
// ToDo configure CORS for set of our trusted domains
routes.use(cors());
routes.options('*', cors());

routes.get('/thrive', async (req, res, next) => {
  try {
    console.log('hits thrive route');
    const data = await getService('EDU', 'master', true).queryEntries({
      content_type: 'article',
      limit: 20,
      order: '-sys.createdAt',
      include: 2,
      'sys.firstPublishedAt[exists]': true,
    });
    const feed = new RSS({
      title: 'Topcoder Thrive',
      description: 'Tutorials And Workshops That Matter | Thrive | Topcoder',
      feed_url: 'https://topcoder.com/api/feeds/thrive',
      site_url: 'https://topcoder.com/thrive',
      image_url: 'https://www.topcoder.com/wp-content/uploads/2020/05/cropped-TC-Icon-32x32.png',
      docs: 'https://www.topcoder.com/thrive/tracks?track=Topcoder',
      webMaster: '<kiril@wearetopcoder.com> Kiril Kartunov',
      copyright: '2021 - today, Topcoder',
      language: 'en',
      categories: ['Competitive Programming', 'Data Science', 'Design', 'Development', 'QA', 'Gig work', 'Topcoder'],
      ttl: '60',
    });
    if (data && data.total) {
      data.items.forEach((entry) => {
        feed.item({
          title: entry.fields.title,
          description: ReactDOMServer.renderToString(md(entry.fields.content)),
          url: `https://topcoder.com/thrive/articles/${entry.fields.slug || encodeURIComponent(entry.fields.title)}?utm_source=thrive&utm_campaign=thrive-feed&utm_medium=rss-feed`,
          date: entry.sys.createdAt,
          categories: entry.fields.tags,
          author: entry.fields.contentAuthor[0].fields.name,
        });
      });
    }
    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.xml({ indent: true }));
  } catch (e) {
    next(e);
  }
});

export default routes;
