import React from 'react';
import fetch from '../../core/fetch';
import { gitHubBaseUrl, usersUri } from '../../core/urls';
import memoize from 'memoizee';

async function getHomePageData() {
  const data = await fetch(`${gitHubBaseUrl}${usersUri}/shishirarora3`);
  const json = await data.json();
  const homePageData = await json;
  if (!homePageData) throw new Error('Failed to load products');
  return homePageData;
}

export const memoized = memoize(getHomePageData, { maxAge: 600000 });

export default {

  path: '/',
  async action() {
    const homePageData = await memoized();
    return new Promise(resolve => {
      if (process.env.BROWSER) {
        require.ensure(['./Home'], (require) => {
          const Home = require('./Home').default;  // eslint-disable-line global-require
          resolve(<Home data={homePageData} />);
        }, 'Home');
      } else {
        const Home = require('./Home').default;  // eslint-disable-line
        resolve(<Home data={homePageData} />);
      }
    });
  }
};
