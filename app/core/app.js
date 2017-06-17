class App {

  hookLogger = Logdown({ prefix: '⥽' });

  log = Logdown({ prefix: 'blogdown' });

  _hooks = {};

  _reducers = {};

  _renderers = {
    md: 'renderer-md'
  };

  go = {
    to: function(route) {
      page.redirect(route);
    },
    back: function() {
      window.history.back();
    }
  };

  constructor() {
    if (typeof process !== 'undefined'
        && process.env && process.env.NODE_ENV === 'production') {
      Logdown.disable('*');
    }
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
    return document.createElement('blogdown-img').getSrc(src);
  }

  boot(bootSteps) {
    const promises = [];
    _.each(bootSteps, (bootStep) => {
      promises.push(this.runBootStep.bind(this, bootStep));
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

  runBootStep(bootStep) {
    const bootStepElement = document.createElement('boot-' + bootStep);
    return bootStepElement.init().then((res) => {
      return res;
    });
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
