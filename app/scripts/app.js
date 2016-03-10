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

  // Force one page application
  app.isEqual = function(x, y) {
    if (app.progress === true) { // Remove progress and hide loading bar
      app.loading = false;
    }
    app.progress = false;
    return x === y;
  };

  // App toast
  app.toast = function(text) {
    app.$.toast.text = text;
    app.$.toast.show();
  }

  // Drawer links
  app.pageHome = function() {
    app.goTo('/');
  };

  app.pagePosts = function() {
    app.goTo('/posts');
  };

  app.pageContact = function() {
    app.goTo('/contact');
  };

  // Redirects app to another page with a given title and optional temporay value
  app.goTo = function(route, temp) {
    // Set temparary variable <app.temp>
    if ((temp === undefined || temp === null) && app.temp !== '') {
      app.temp = '';
    } else if (temp !== undefined && temp !== null) {
      app.temp = temp;
      app.debug('app.temp = ' + app.temp);
    }
    page.redirect(route); // Redirect page
    if (app.mobile) { // Close drawer when page redirects
      app.$.drawer.closeDrawer();
    }
  };


  //*******************************************************************//

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

})(document);
