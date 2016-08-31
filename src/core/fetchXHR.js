import { addExtraParams } from './utils';

export default (url) => {
  url = addExtraParams(url); // eslint-disable-line
  let xhr;
  const promize = new Promise((res) => {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        res({
          json: () => new Promise((res2) => {
            res2(JSON.parse(xhr.responseText));
          })
        });
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  });
  promize.abort = () => { xhr.abort(); };
  return promize;
};
