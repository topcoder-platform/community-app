import express from 'express';

import getBlogs from '../services/blog';

const router = express.Router();

router.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit);
    const { category } = req.query;
    res.send(await getBlogs(limit, category));
  } catch (err) { next(err); }
});

export default router;
