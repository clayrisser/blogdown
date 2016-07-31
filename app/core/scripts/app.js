/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  var scriptElements = document.getElementsByTagName('script'); // find root url
  for (var i = 0; i < scriptElements.length; i++) {
    var source = scriptElements[i].src;
    if (source.indexOf('/core/scripts/app.js') > -1) {
      app.rootURL = source.substring(0, source.indexOf('core/scripts/app.js'));
    }
  }
  app.baseUrl = app.rootURL.substring(window.location.origin.length, app.rootURL.length);

  // Load settings (runs before app._loadTheApp)
  app.settingsResponse = function() {
    var isObjectArray = function(a) {
        return (!!a) && ((a.constructor === Array) || (a.constructor === Object));
    };
    for (var setting in app.settings) {
      if (app.settings.hasOwnProperty(setting)) {
        if (isObjectArray(app.settings[setting])) {
          app.debug('app.settings.' + setting + ' =');
          app.debug(app.settings[setting]);
        } else {
          app.debug('app.settings.' + setting + ' = ' + app.settings[setting]);
        }
      }
    }
    app._init();
    app._loadStyle();
    app._loadTheApp();
  };
  app.settingsError = function() {
    console.warn('App failed to load settings');
  };

  app._init = function() { // first code to run after settings have loaded
    document.title = app.settings.title; // update page title
  },

  app._loadStyle = function() { // Load style
    var style = 'default';
    if (app.settings.style) {
      style = app.settings.style;
    }
    if (localStorage.style) {
      style = localStorage.style;
    }
    this.importHref(app.rootURL + 'content/styles/style-' + style + '.html', function() {
      app.debug('style-' + style + ' loaded');
    }.bind(this), function() {
        app.debug('WARNING: style-' + style + 'failed to load');
    }.bind(this));
  }

  app._loadTheApp = function() { // Load the app
    var pageLoading = document.createElement('page-loading');
    app.$.loading.appendChild(pageLoading);
    app.pageTitle = app.settings.title;
  }

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
    page.redirect(route);
  };

  // Scroll page to top and expand header
  app.scrollToTop = function() {
  //  app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
 //   app.$.paperDrawerPanel.closeDrawer();
  };

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);
