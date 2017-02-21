((document) => {
  'use strict';
  var app = document.getElementById('app');

  _setBaseUrl();

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

function _setBaseUrl() {
  var matches = window.location.href.match(/[\w\d\.:\/\\]+(?=\/#!)/g);
  var baseUrl = window.location.href;
  if (matches) {
    baseUrl = matches[0];
  } else {
    if (baseUrl[baseUrl.length - 1] === '/') baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }
  store.dispatch({
    type: SET_BASE_URL,
    baseUrl: baseUrl
  });
}

function _appLoaded() {
  var state = store.getState();
  var route = state.route;
  var slugs = route.slugs ? route.slugs : {};
  var parent = '/' + (slugs.parent ? slugs.parent : '');
  var child = slugs.child ? '/' + slugs.child : '';
  app.go.to(parent + child);
  store.dispatch({ type: APP_LOADED });
  document.getElementById('loading').innerHTML = '';
  app.log.info(state.settings.title + ' loaded');
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
