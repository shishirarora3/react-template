import configureStore from '../store/configureStore';
// import { setRuntimeVariable } from '../actions';
import ReactDOM from 'react-dom/server';
import { match } from 'universal-router';
import routes from '../routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
// import logger from './logger';
import memoize from 'memoizee';
const template = require('../views/index.jade'); // eslint-disable-line global-require
const getTemplateData = (path, data = null) => data && template(data);
const memoized = memoize(getTemplateData, { length: 1, maxAge: 20000 });
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function serverSideRender(app) {
  app.get('*', async(req, res, next) => {
    if (isProduction) {
      const result = memoized(req.path);
      if (result) {
        res.status(200);
        return res.send(result);
      }
      memoized.delete(req.path, true);
    }
    try {
      let css = new Set();
      let statusCode = 200;
      const data = { title: '', description: '', keywords: '',
        css: '', body: '', entry: assets.main.js };

      const store = configureStore({}, {
       cookie: req.headers.cookie,
    });

      await match(routes, {
        path: req.path,
        query: req.query,
        context: {
          store,
          insertCss: styles => css.add(styles._getCss()),
          setTitle: value => (data.title = value),
          setMeta: (key, value) => (data[key] = value),
        },
        render(component, status = 200) {
          css = new Set();
          statusCode = status;
          data.state = JSON.stringify(store.getState());
          data.body = ReactDOM.renderToString(component);
          data.css = [...css].join('');
          return true;
        },
      });
      res.status(statusCode);
      return res.send(isProduction ? memoized(req.path, data) : template(data));
    } catch (err) {
      return next(err);
    }
  });
};
