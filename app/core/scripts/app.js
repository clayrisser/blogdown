((document) => {
  'use strict';
  var app = document.getElementById('app');

  var scriptElements = document.getElementsByTagName('script');
  _.each(scriptElements, (scriptElement) => {
    var source = scriptElement.src;
    if (source.indexOf('/core/scripts/app.js') > -1) {
      app.rootURL = source.substring(0, source.indexOf('core/scripts/app.js'));
    }
  });
  app.baseUrl = app.rootURL.substring(window.location.origin.length, app.rootURL.length);

  _loadApp([
    'settings',
    'globals',
    'authors',
    'pages',
    'taxonomies',
    'style',
    'theme'
  ]).then((message) => {
    window.setTimeout(function() {
      _appLoaded();
    }, 1000);
  });

  app.toastClicked = function() {
    if (!app.toastTarget) {
      app.toastTarget = '_self';
    }
    window.open(app.toastLink, app.toastTarget);
  };

  app.displayInstalledToast = function() {
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      console.log('caching disabled');
    } else {
      console.log('caching enabled');
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  window.addEventListener('WebComponentsReady', function() {
    console.log('web components are ready');
  });
})(document);

function _appLoaded() {
  store.dispatch({ type: APP_LOADED });
  document.getElementById('loading').innerHTML = '';
  app.log.info(store.getState().settings.title + ' loaded');
}

function _loadApp(loaders) {
  var promises = [];
  _.each(loaders, (loader) => {
    promises.push(_runLoader.bind(this, loader));
  });
  var promiseChain = Promise.resolve();
  _.each(promises, (promise) => {
    promiseChain = promiseChain.then(promise);
  });
  return promiseChain.then((res) => {
    return res;
  }).catch((err) => {
    console.error(err);
  });
}

function _runLoader(loader) {
  var loaderElement = document.createElement('load-' + loader);
  return loaderElement.load().then((res) => {
    return res;
  });
}
