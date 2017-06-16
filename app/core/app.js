class App {

  log = {
    error: function(err) {
      if (store.getState().settings.logLevel.value === 1) {
        if (err.message) {
          console.log(err.message);
          return;
        }
      }
      if (store.getState().settings.logLevel.value > 1) {
        console.error(err);
        return;
      }
    },
    warn: function(err) {
      if (store.getState().settings.logLevel.value === 2) {
        if (err.message) {
          console.log(err.message);
          return;
        }
      }
      if (store.getState().settings.logLevel.value > 2) {
        console.warn(err);
        return;
      }
    },
    info: function(info) {
      if (store.getState().settings.logLevel.value >= 3) console.info(info);
    },
    debug: function(info) {
      if (store.getState().settings.logLevel.value >= 4) console.debug(info);
    },
    silly: function(info) {
      if (store.getState().settings.logLevel.value >= 5) console.log(info);
    }
  };

  go = {
    to: function(route) {
      page.redirect(route);
    },
    back: function() {
      window.history.back();
    }
  };

  domReady() {
    console.info('DOM Ready');
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
      'app'
    ]).then(() => {
      this.runHook('bootFinished');
    });
  }

  runHook(hookName, cx) {
    this.log.info(`⥽: ${hookName}`);
    if (!app._hooks) app._hooks = {};
    const promises = _.map(app._hooks[hookName], (hookInstance, key) => {
      if (typeof hookInstance.then === 'function') return hookInstance(cx);
      return new Promise((resolve, reject) => {
        return resolve(hookInstance(cx));
      });
    });
    return Promise.all(promises);
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
      console.error(err);
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
