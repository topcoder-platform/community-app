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
    const data = await getService('EDU', 'master', true).queryEntries({
      content_type: 'article',
      limit: 20,
      order: '-sys.createdAt',
      include: 2,
    });
    const feed = new RSS({
      title: 'Topcoder Thrive - RSS feed',
      description: 'Tutorials And Workshops That Matter | Thrive | Topcoder',
      feed_url: 'https://topcoder.com/api/feeds/thrive',
      site_url: 'https://topcoder.com/thrive',
      image_url: 'https://images.ctfassets.net/b5f1djy59z3a/5kicYrFi5GoMqWs0ccsMsM/d3f4a4315588df5bdf0096208eb13581/Topcoder_Logo_200px.png',
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
          url: `https://topcoder.com/thrive/articles/${entry.fields.slug || encodeURIComponent(entry.fields.title)}`,
          date: entry.fields.creationDate,
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
