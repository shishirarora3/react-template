import { catalogDomain } from './urls';
import qs from 'qs';

/* Returns query string with object's key values pairs as
?key1=value1&key2=value2 and so-on */
export function stringifyQueryParams(obj) {
  let queryString = '';
  // To-Do  Please remove filter and map chaining , It can be done with
  // single iteration .
  Object.keys(obj).filter((key) => {
    return (!!obj[key] !== false);
  }).map((key) => {
    return (queryString += `${key}=${obj[key]}&`);
  });
  return queryString.length ? `?${queryString.substr(0, queryString.length - 1)}` : '';
}

export function addStaticKeys(payload) {
  const staticKeys = {
    page_count: 1,
    items_per_page: 30,
    resolution: '960x720',
    quality: 'high',
    curated: 1
  };

  return { ...payload, ...staticKeys };
}

export function addGenericKeys(payload) {
  const genericKeys = {
    cat_tree: 1
  };

  return { ...payload, ...genericKeys };
}

export function getResizeUrl(url, width, height = 0) {
  const lastIndex = url.lastIndexOf('/');
  return `${url.substring(0, lastIndex)}/${width}x${height}${url.substr(lastIndex)}`;
}

export function getCookie(name) {
  const re = new RegExp(`${name}=([^;]+)`);
  const value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

export function getParameterByName(names, urls) {
  let url = urls;
  let name = names;
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const urlMapper = item => {
  let itemUrl = '#';
  if (item && item.seourl && (item.seourl.indexOf('http://') === 0 || item.seourl.indexOf('https://') === 0)) {
    if (item.url_type === 'embed' || item.url_type === 'external') {
      itemUrl = item.url || item.seourl;
    } else if (item.url_type && item.url_type.toLowerCase() === 'nolink') {
      itemUrl = item.seourl.replace(`${catalogDomain}/v1/`, '/');
    } else {
      itemUrl = item.seourl.replace(`${catalogDomain}/v1/`, '/shop/');
    }
  } else {
    itemUrl = `/shop/${item.seourl}`;
  }
  return itemUrl;
};

export function encodeHTML(string) {
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

export const urlTypeToTarget = item => {
  switch (item.url_type) {
    case 'external':
    case 'embed':
      return '_blank';
    default: return null;
  }
};

export const getFilteredListByOrder = (list, keyName, searchText, regex) => {
  if (!searchText) {
    return list;
  }

  const searchItems1 = [];
  const searchItems2 = [];
  const searchItems3 = [];
  list.forEach((item) => {
    if (regex.test(item[keyName].substring(0, searchText.length))) {
      searchItems1.push(item);
    } else if (regex.test(item[keyName].substring(searchText.length))) {
      searchItems2.push(item);
    } else if (item[keyName].indexOf(searchText) > -1) {
      searchItems3.push(item);
    }
  });
  return [...searchItems1, ...searchItems2, ...searchItems3];
};

// Todo - write in comments the accept and return format.
export const getFormattedDate = (date) => {
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : `0${month}`;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : `0${day}`;
  return `${day}/${month}/${year}`;
};

export const addParamToUrl = (relativeUrl, queryParam) => {
  const kvp = relativeUrl.split('?');
  let existing = {};
  if (kvp.length > 1) {
    existing = qs.parse(kvp[1]);
  }
  existing = { ...existing, ...queryParam };
  return `${kvp[0]}?${qs.stringify(existing)}`;
};

const currentYPosition = () => {
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) {
    return window.pageYOffset;
  }
  return 0;
};

const callScrollSettimeout = (leapY, time) => {
  setTimeout(() => {
    window.scrollTo(0, leapY);
  }, time);
};

export const scrollToTop = () => {
  const distance = currentYPosition();
  if (distance < 100) {
    window.scrollTo(0, 0); return;
  }
  let speed = Math.round(distance / 100);
  if (speed >= 20) {
    speed = 25;
  }
  const step = Math.round(distance / 25);
  let leapY = distance - step;
  let timer = 0;
  for (let i = distance; i > 0; i -= step) {
    callScrollSettimeout(leapY, timer * speed);
    leapY -= step; if (leapY < 0) leapY = 0; timer++;
  }
};

export const disableBodyScrolling = (condition) => {
  if (condition) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'visible';
  }
};

export const addExtraParams = (url) => {
  return addParamToUrl(url, {
    channel: 'web',
    child_site_id: 1,
    site_id: 1,
    version: 2
  });
};
