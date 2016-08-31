import { getParameterByName, addParamToUrl } from '../../core/utils';

import React from 'react';
import App from '../../components/App';
import ErrorPage from './ErrorPage';

export default {

  path: '/error',

  action({ render, context, error, path }) {
    if (process.env.BROWSER) {
      path = window.location.href; //eslint-disable-line
      const refreshedOnce = getParameterByName('refreshed', path);
      // Hard refresh the page only once if on error.
      // Stop from refreshing again and again on error.
      if (!refreshedOnce) {
        const refreshpath = addParamToUrl(path, { refreshed: 1 });
        window.location.href = refreshpath;
        return;
      }
    }
    render(
      <App context={context} error={error}>
        <ErrorPage error={error} />
      </App>,
      error.status || 500
    );
  },

};
