(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // Load settings
  app.settingsResponse = function() {
    app.pageTitle = app.settings.title;
    for (var property in app.settings) {
      if (app.settings.hasOwnProperty(property)) {
        app.debug('app.settings.' + property + ' = ' + app.settings[property]);
      }
    }
    var pageLoading = document.createElement('page-loading');
    app.$.loading.appendChild(pageLoading);
  };
  app.settingsError = function() {
    console.log('App failed to load settings');
  };

  // Writes to the console if debugging is enabled
  app.debug = function(message) {
    if (app.settings.debugging) {
      console.log(message);
    }
  };

  // App toast
  app.toast = function(text) {
    app.$.toast.text = text;
    app.$.toast.show();
  }

  app.goTo = function(route, temp) { // Redirects app to another page with a given title and optional temporay value
    if (temp && app.temp !== '') {
      app.temp = '';
    } else if (temp) {
      app.temp = temp;
      app.debug('app.temp = ' + app.temp);
    }
    window.open('/#' + route, '_self');
    if (app.mobile) { // Close drawer when page redirects
      document.getElementById('root-page').drawer.closeDrawer();
    }
  };

})(document);
