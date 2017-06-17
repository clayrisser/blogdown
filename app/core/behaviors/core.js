const BlogdownBody = {};

const BlogdownPage = {
  properties: {
    page: {
      type: Object,
      value: {},
      observer: '_pageChanged'
    }
  },
  ready: function() {
    this.set('isReady', true);
    app.runHook('pageReady', {
      page: this.page
    });
  },
  attached: function() {
    app.runHook('pageAttached', {
      page: this.page
    });
    this._safeRerender();
  },
  _pageChanged: function() {
    if (this.isReady) this._safeRerender();
  },
  _safeRerender() {
    if (this.rerender) this.rerender();
  }
};

const BlogdownPosts = {
  properties: {
    page: {
      type: Object,
      value: {},
      observer: '_pageChanged'
    },
    posts: {
      type: Array,
      value: [],
      observer: '_postsChanged'
    }
  },
  ready: function() {
    this.set('isReady', true);
    app.runHook('postsReady', {
      page: this.page,
      posts: this.posts
    });
  },
  attached: function() {
    app.runHook('postsAttached', {
      page: this.page,
      posts: this.posts
    });
  },
  _pageChanged: function() {
    this._safeRerender();
  },
  _postsChanged: function() {
    this._safeRestamp();
  },
  _safeRerender: function() {
    if (this.rerender) this.rerender();
  },
  _safeRestamp: function() {
    if (this.restamp) this.restamp();
  }
};

const BlogdownPost = {
  properties: {
    post: {
      type: Object,
      value: {},
      observer: '_postChanged'
    }
  },
  ready: function() {
    this.set('isReady', true);
    app.runHook('postReady', {
      post: this.post
    });
  },
  attached: function() {
    app.runHook('postAttached', {
      post: this.post
    });
    this._safeRerender();
  },
  _postChanged: function() {
    if (this.isReady) this._safeRerender();
  },
  _safeRerender: function() {
    if (this.rerender) this.rerender();
  }
};

const BlogdownHooks = {
  ready: function() {
    this._hookID = moment().format('x');
    if (!app._hooks) app._hooks = {};
    _.each(this.registerHooks(), (hook, key) => {
      if (!app._hooks[key]) app._hooks[key] = {};
      app._hooks[key][this._hookID] = hook;
    });
  },
  detached: function() {
    _.each(this.registerHooks(), (hook, key) => {
      delete app._hooks[key][this._hookID];
    });
  }
};
