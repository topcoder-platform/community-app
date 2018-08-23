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
  next();
});

/* do regist member to mailchimp server. */
routes.use('/:listId/members', (req, res, next) => MailchimpService.doRegistMember(req).then(res.send.bind(res), next));

export default routes;
