import 'babel-polyfill';
import ReactDOM from 'react-dom';
import { match } from 'universal-router';
import routes from './routes';
import history from './core/history';
import configureStore from './store/configureStore';
import { addEventListener, removeEventListener } from './core/DOMUtils';

const context = {
  store: null,
  insertCss: styles => styles._insertCss(), // eslint-disable-line no-underscore-dangle
  setTitle: value => (document.title = value),
  setMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName('meta');
    Array.from(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document
      .getElementsByTagName('head')[0]
      .appendChild(meta);
  },
};

// Restore the scroll position if it was saved into the state
function restoreScrollPosition(state) {
  if (state && state.scrollY !== undefined) {
    window.scrollTo(state.scrollX, state.scrollY);
  } else {
    window.scrollTo(0, 0);
  }
}

let renderComplete = (state, callback) => {
  const elem = document.getElementById('css');
  if (elem) elem.parentNode.removeChild(elem);
  callback(true);
  renderComplete = (s) => {
    restoreScrollPosition(s);
    callback(true);
  };
};

function render(container, state, component) {
  return new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        component,
        container,
        renderComplete.bind(undefined, state, resolve)
      );
    } catch (err) {
      reject(err);
    }
  });
}

function run() {
  let currentLocation = null;
  const container = document.getElementById('app');
  const initialState = JSON.parse(
    document.getElementById('source').getAttribute('data-initial-state')
  );

  context.store = configureStore(initialState, {});

  // Re-render the app when window.location changes
  const removeHistoryListener = history.listen(location => {
    currentLocation = location;
    match(routes, {
      path: location.pathname,
      query: location.query,
      state: location.state,
      context,
      // eslint-disable-next-line react/jsx-no-bind
      render: render.bind(undefined, container, location.state),
    }).catch(err => console.error(err)); // eslint-disable-line no-console
  });

  // Save the page scroll position into the current location's state
  const supportPageOffset = window.pageXOffset !== undefined;
  const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
  const setPageOffset = () => {
    currentLocation.state = currentLocation.state || Object.create(null);
    if (supportPageOffset) {
      currentLocation.state.scrollX = window.pageXOffset;
      currentLocation.state.scrollY = window.pageYOffset;
    } else {
      currentLocation.state.scrollX = isCSS1Compat ?
        document.documentElement.scrollLeft : document.body.scrollLeft;
      currentLocation.state.scrollY = isCSS1Compat ?
        document.documentElement.scrollTop : document.body.scrollTop;
    }
  };

  addEventListener(window, 'scroll', setPageOffset);
  addEventListener(window, 'pagehide', () => {
    removeEventListener(window, 'scroll', setPageOffset);
    removeHistoryListener();
  });
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
