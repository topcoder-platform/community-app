/**
 * Routes for demo API of tc-communities
 */

import express from 'express';

const router = express.Router();

/**
 * Endpoint for communities header
 */
router.get('/:communityId/header', (req, res) => {
  const communityId = req.params.communityId;
  const respond = {
    communityId,
    logoUrl: 'http://predix.topcoder.com/wp-content/uploads/sites/7/2016/11/topcoder-hat-logo.png',
    menuItems: [
      {
        title: 'HOME',
        url: '/home',
      }, {
        title: 'GET STARTED',
        url: '/get-started',
      }, {
        title: 'ABOUT PREDIX',
        url: '/about',
      }, {
        title: 'RESOURCES',
        url: '/resources',
      }, {
        title: 'COMPETE',
        url: '/complete',
      },
    ],
  };

  if (communityId === 'custom-theme-red') {
    respond.style = '/themes/red/Header.css';
  }

  if (communityId === 'custom-theme-green') {
    respond.style = '/themes/green/Header.css';
  }

  if (['default-theme', 'custom-theme-red', 'custom-theme-green'].includes(communityId)) {
    res.json(respond);
  } else {
    res.status(404).send();
  }
});

export default router;
