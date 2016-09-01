
import 'babel-polyfill';
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { port } from './config';
import {
  serverSideRender
} from './serverMiddleWares';

if (process.env.NODE_ENV === 'production') {
  // http://www.slideshare.net/denisizmaylov/isomorphic-react-applications-performance-and-scalability
  // https://github.com/facebook/react/issues/812#issuecomment-172929366
  process.env = JSON.parse(JSON.stringify(process.env));
}

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
serverSideRender(app);

//
// Error handling
// -----------------------------------------------------------------------------

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(err, { pid: process.pid, remoteAddress: req.connection.remoteAddress });

  const template = require('./views/error.jade'); // eslint-disable-line global-require
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

//
// Launch the server
app.listen(port, () => {
  console.log(`${process.env.NODE_ENV} The server is running at http://localhost:${port}/`);
});