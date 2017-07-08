class Page {

  isReady = false;

  ready() {
    page('*', this.middleware.bind(this), (ctx, next) => {
      next();
    });
    page('/', (req) => {
      this.changeRoute({
        req: req,
        type: 'parent',
        slugs: {
          parent: 'home'
        }
      });
    });
    page('/:parent', (req) => {
      this.changeRoute({
        req: req,
        type: 'parent',
        slugs: req.params
      });
    });
    page('/:parent/:child', (req) => {
      this.changeRoute({
        req: req,
        type: 'child',
        slugs: req.params
      });
    });
    page('*', (req) => {
      this.changeRoute({
        req: req,
        type: 'parent',
        slugs: {
          parent: '404'
        }
      });
    });
  }

  middleware(ctx, next) {
    if (ctx.canonicalPath.match(/^\/#!\//g)) {
      page.redirect(ctx.canonicalPath.substr(3, ctx.canonicalPath.length - 1));
    }
    next();
  }

  changeRoute(route) {
    const state = store.getState();
    if (this.isReady && state.route && state.route.req
        && state.route.req.canonicalPath === route.req.canonicalPath) return;
    const selectedMenuItem = _.findIndex(_.filter(state.pages, {
      addToMenu: true
    }), { slug: route.slugs.parent });
    if (state.meta.selectedMenuItem !== selectedMenuItem) {
      store.dispatch({
        type: UPDATE_SELECTED_MENU_ITEM,
        payload: selectedMenuItem
      });
    }
    if (state.meta.appLoaded && !this.isReady) this.isReady = true;
    store.dispatch({
      type: CHANGE_ROUTE,
      payload: _.assign({}, route, {
        params: this.getParams(route.req.querystring)
      })
    });
  }

  getParams(querystring) {
    const urlSearchParams = new URLSearchParams(querystring);
    const params = {};
    for (const key of urlSearchParams.keys()) {
      if (key !== 'next') params[key] = urlSearchParams.get(key);
    }
    return params;
  }
}

const _page = new Page();
window.addEventListener('WebComponentsReady', _page.ready.bind(_page));
