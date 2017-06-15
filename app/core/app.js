class App {

  app = document.getElementById('app');

  constructor() {
    this.app.addEventListener('dom-change', () => {
      this.domReady();
    });
    window.addEventListener('WebComponentsReady', () => {
      this.webComponentsReady();
    });
  }

  domReady() {
    console.info('DOM Ready');
  }

  webComponentsReady() {
    this.boot([
      'settings',
      'globals',
      'meta',
      'authors',
      'pages',
      'taxonomies',
      'style',
      'theme',
      'app'
    ]).then(() => {
      this.app.runHook('appLoaded');
    });
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
  new App();
})(document);
