import _ from 'lodash';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
// import favicon from 'serve-favicon';

import html from './App';

const app = express();

/* Uncomment once favicon is included into the project. */
// app.use(favicon(path.resolve(__dirname, '../../build/assets/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../../build')));

app.use('/', (req, res) => res.send(html));

/* Catches 404 and forwards it to error handler. */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handler. */
app.use((err, req, res) => {
  /* Sets locals. Errors are provided only in dev. */
  _.assign(res, {
    locals: {
      error: req.app.get('env') === 'development' ? err : {},
      message: err.message,
    },
  });

  /* Returns the error page. */
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app;
