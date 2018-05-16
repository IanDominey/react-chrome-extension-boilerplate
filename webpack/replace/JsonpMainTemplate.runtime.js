/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

/* global hotAddUpdateChunk, parentHotUpdateCallback, document, XMLHttpRequest, $require$, */
/* global $hotChunkFilename$, $hotMainFilename$, hotCurrentHash, */
/* global __webpack_require__ */

module.exports = () => {
  function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
    hotAddUpdateChunk(chunkId, moreModules);
    if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
  }

  const that = this;

  function evalCode(code, context) {
    return (() => {
      return eval(code); //eslint-disable-line no-eval
    }).call(context);
  }

  that.hotDownloadUpdateChunk = (chunkId) => { // eslint-disable-line no-unused-vars
    const src = `${__webpack_require__.p}${chunkId}.${hotCurrentHash}.hot-update.js`;

    const request = new XMLHttpRequest();

    request.onload = () => {
      evalCode(this.responseText, that);
    };
    request.open('get', src, true);
    request.send();
  };

  function hotDownloadManifest(timeout = 1000) {
    return new Promise((resolve, reject) => {
      if (typeof XMLHttpRequest === 'undefined') {
        return reject(new Error('No browser support'));
      }
      const request = new XMLHttpRequest();
      const requestPath = $require$.p + $hotMainFilename$;
      try {
        request.open('GET', requestPath, true);
        request.timeout = timeout;
        request.send(null);
      } catch (err) {
        return reject(err);
      }
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;
        if (request.status === 0) {
          // timeout
          reject(new Error(`Manifest request to ${requestPath} timed out.`));
        } else if (request.status === 404) {
          // no update available
          reject(new Error('no update available'));
        } else if (request.status !== 200 && request.status !== 304) {
          // other failure
          reject(new Error(`"Manifest request to ${requestPath} failed.`));
        } else {
          // success
          let update = null;
          try {
            update = JSON.parse(request.responseText);
          } catch (e) {
            callback(e);
            return;
          }
          resolve(update);
        }
      };
    });
  }
};
