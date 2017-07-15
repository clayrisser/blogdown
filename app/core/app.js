class App {

  logger = {
    hook: Logdown({ prefix: '⥽' }),
    notification: Logdown({ prefix: 'notification' })
  };

  log = Logdown({ prefix: 'blogdown' });

  _hooks = {};

  _reducers = {};

  _renderers = {
    md: 'renderer-md',
    pdf: 'renderer-pdf'
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
    const process = { env: {} };
    this.baseUrl = this.getBaseUrl();
    if (process.env.NODE_ENV === 'production') {
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

  getThemeSettings() {
    const state = store.getState();
    const theme = state.settings.theme;
    return _.isString(theme) ? {} : (theme[1] || {});
  }

  getModuleSettings(moduleName) {
    const matches = moduleName.match(/^mod-/g);
    if (matches && matches.length > 0) {
      moduleName = moduleName.substr(4, moduleName.length - 1);
    }
    const state = store.getState();
    return !_.isNil(state.settings.modules) ? state.settings.modules[moduleName] || {} : {};
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
    this.logger.hook.info(hookName);
    const promises = _.map(this._hooks[hookName], (hookInstance, key) => {
      if (typeof hookInstance.then === 'function') return hookInstance(cx);
      return new Promise((resolve, reject) => {
        return resolve(hookInstance(cx));
      });
    });
    return Promise.all(promises);
  }

  getImageSrc(src) {
    return document.createElement('blogdown-img').getSrc(src);
  }

  handleError(err) {
    if (_.isNil(err.message)) {
      err = {
        message: err,
        code: 500
      };
    }
    let type = 'error';
    if (200 <= err.code && err.code < 500) type = 'warn';
    if (type === 'error') {
      this.logger.notification[type](err);
    } else {
      this.logger.notification[type](err.message);
    }
    return store.dispatch({
      type: PUSH_NOTIFICATION,
      payload: {
        message: err.message,
        type,
        link: '',
        code: err.code
      }
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
