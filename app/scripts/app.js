(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // Load settings
  app.settingsResponse = function() {
    for (var setting in app.settings) {
      if (app.settings.hasOwnProperty(setting)) {
        app.debug('app.settings.' + setting + ' = ' + app.settings[setting]);
      }
    }
    var pageLoading = document.createElement('page-loading');
    app.$.loading.appendChild(pageLoading);
    app.pageTitle = app.settings.title;
  };
  app.settingsError = function() {
    console.warn('App failed to load settings');
  };

  // Writes to the console if debugging is enabled
  app.debug = function(message, type) {
    if (app.settings.debugging) {
      if (type === 'warn') {
        console.warn(message);
      } else {
        console.log(message);
      }
    }
  };

  // App toast
  app.toast = function(message, link, target) {
    app.$.toast.text = message;
    if (link) {
      app.toastLink = link;
      app.toastTarget = target;
    }
    app.$.toast.show();
  };
  
  // Toast clicked
  app.toastClicked = function() {
    if (!app.toastTarget) {
      app.toastTarget = '_self';
    }
    window.open(app.toastLink, app.toastTarget);
  };

  // Redirects app to another page
  app.goTo = function(route) {
    window.open('/#' + route, '_self');
    if (app.mobile) { // Close drawer when page redirects
      app.closeDrawer();
    }
  };

  // Closes the drawer
  app.closeDrawer = function() {
    this.$.rootPage.drawer.closeDrawer();
  };

})(document);
