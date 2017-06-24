class App {

  hookLogger = Logdown({ prefix: '⥽' });

  log = Logdown({ prefix: 'blogdown' });

  _hooks = {};

  _reducers = {};

  _renderers = {
    md: 'renderer-md'
  };

  _timestamp = moment().format('x');

  baseUrl = '';

  go = {
    to: function(route) {
      page.redirect(route);
    },
    back: function() {
      window.history.back();
    }
  };

  constructor() {
    this.baseUrl = this.getBaseUrl();
    if (typeof process !== 'undefined'
        && process.env && process.env.NODE_ENV === 'production') {
      Logdown.disable('*');
    }
  }

  getTimestamp() {
    const state = store.getState();
    let cacheBusting = 'session';
    if (state && state.settings && state.settings.cacheBusting) {
      cacheBusting = state.settings.cacheBusting;
    }
    switch (cacheBusting) {
    case 'always':
      return moment().format('x');
    case 'never':
      return moment(murmurHash3.x86.hash32(state.settings.version)).format('x');
    }
    return this._timestamp;
  }

  domReady() {
    this.log.info('DOM Ready');
  }

  webComponentsReady() {
    this.boot([
      'settings',
      'meta',
      'authors',
      'pages',
      'taxonomies',
      'style',
      'theme',
      'root'
    ]).then(() => {
      this.runHook('bootFinished');
    });
  }

  runHook(hookName, cx) {
    this.hookLogger.info(`${hookName}`);
    const promises = _.map(this._hooks[hookName], (hookInstance, key) => {
      if (typeof hookInstance.then === 'function') return hookInstance(cx);
      return new Promise((resolve, reject) => {
        return resolve(hookInstance(cx));
      });
    });
    return Promise.all(promises);
  }

  getImageSrc(src) {
    const state = store.getState();
    if (state.settings.cacheBusting !== 'always') {
      const cachedImages = store.getState().meta.cachedImages;
      if (_.includes(_.keys(cachedImages), src)) {
        return Promise.resolve(cachedImages[src]);
      }
    }
    return document.createElement('blogdown-img').getSrc(src).then((newSrc) => {
      if (state.settings.cacheBusting !== 'always') {
        store.dispatch(this._cacheImage(src, newSrc));
      }
      return newSrc;
    });
  }

  boot(bootSteps) {
    const promises = [];
    _.each(bootSteps, (bootStep) => {
      promises.push(this._runBootStep.bind(this, bootStep));
    });
    let promiseChain = Promise.resolve();
    _.each(promises, (promise) => {
      promiseChain = promiseChain.then(promise);
    });
    return promiseChain.then((res) => {
      return res;
    }).catch((err) => {
      this.log.error(err);
    });
  }

  _runBootStep(bootStep) {
    const bootStepElement = document.createElement('boot-' + bootStep);
    return bootStepElement.init().then((res) => {
      return res;
    });
  }

  _cacheImage(src, newSrc) {
    return (dispatch) => {
      const payload = {};
      payload[src] = newSrc;
      dispatch({
        type: CACHE_IMAGE,
        payload
      });
    };
  }

  getBaseUrl() {
    const matches = window.location.href.match(/[\w\d\.:\/\\]+(?=\/#!)/g);
    let baseUrl = window.location.href;
    if (matches) {
      baseUrl = matches[0];
    } else {
      if (baseUrl[baseUrl.length - 1] === '/') baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }
    return baseUrl;
  }
}

((document) => {
  const app = document.getElementById('app');
  const _app = new App();
  _.each(_.keys(_app), (key) => {
    app[key] = _app[key];
  });
  _.each(Object.getOwnPropertyNames(Object.getPrototypeOf(_app)), (key) => {
    if (key !== 'constructor') {
      app[key] = App.prototype[key];
    }
  });
  app.addEventListener('dom-change', () => {
    app.domReady();
  });
  window.addEventListener('WebComponentsReady', () => {
    app.webComponentsReady();
  });
})(document);
