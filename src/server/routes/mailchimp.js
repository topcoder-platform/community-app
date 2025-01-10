/**
 * The routes that expose our content to Content Delivery Networks.
 */

import express from 'express';
import MailchimpService from '../services/mailchimp';
import { sendEmail } from '../services/sendGrid';

const routes = express.Router();
/* Sets Access-Control-Allow-Origin header to avoid CORS error.
 * TODO: Replace the wildcard value by an appropriate origin filtering. */
routes.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, content-type');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  next();
});

/* do regist member to mailchimp server. */
routes.post('/:listId/members', (req, res, next) => new MailchimpService().doRegistMember(req).then(res.send.bind(res), next));

routes.get('/:listId/members/:emailHash', (req, res) => new MailchimpService().checkSubscription(req).then(res.send.bind(res)));

routes.put('/:listId/members/:emailHash', (req, res) => new MailchimpService().updateMember(req).then(res.send.bind(res)));

routes.post('/:listId/members/:emailHash/tags', (req, res) => new MailchimpService().subscribeTags(req).then(res.send.bind(res)));

routes.get('/campaign-folders', (req, res) => new MailchimpService().getCampaignFolder(req).then(res.send.bind(res)));

routes.get('/campaigns', (req, res) => new MailchimpService().getCampaigns(req).then(res.send.bind(res)));

routes.post('/email', (req, res) => sendEmail(req, res).then(res.send.bind(res)));

export default routes;