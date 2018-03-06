import express from 'express';

import getAvatar from '../services/avatar';

const router = express.Router();

router.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

router.use('/:path', async (req, res) => {
  const path = decodeURIComponent(req.params.path);
  const size = Number(req.query.size);
  res.send(await getAvatar(path, size));
});

export default router;
