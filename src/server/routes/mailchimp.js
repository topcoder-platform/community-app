/**
 * The routes that expose our content to Content Delivery Networks.
 */

import express from 'express';
import MailchimpService from '../services/mailchimp';

const routes = express.Router();
/* Sets Access-Control-Allow-Origin header to avoid CORS error.
 * TODO: Replace the wildcard value by an appropriate origin filtering. */
routes.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, content-type');
  next();
});

/* do regist member to mailchimp server. */
routes.post('/:listId/members', (req, res, next) => new MailchimpService(req.query.mailchimpBaseUrl).doRegistMember(req).then(res.send.bind(res), next));

routes.get('/:listId/members/:emailHash', (req, res) => new MailchimpService(req.query.mailchimpBaseUrl).checkSubscription(req).then(res.send.bind(res)));

export default routes;
