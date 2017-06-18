window.addEventListener('WebComponentsReady', () => {
  const state = store.getState();

  if (window.location.port === '') {
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  function middleware(ctx, next) {
    next();
  }

  function changeRoute(route) {
    const pages = _.filter(state.pages, (page) => {
      return page.addToMenu;
    });
    let selectedMenuItem = -1;
    for (let i = 0; pages.length > i; i++) {
      const page = pages[i];
      if (route.slugs.parent === page.slug) {
        selectedMenuItem = i;
        break;
      }
    }
    store.dispatch({
      type: CHANGE_ROUTE,
      payload: route
    });
    if (state.meta.selectedMenuItem !== selectedMenuItem) {
      store.dispatch({
        type: UPDATE_SELECTED_MENU_ITEM,
        payload: selectedMenuItem
      });
    }
  }

  page('*', middleware, (ctx, next) => {
    next();
  });

  page('/', (req) => {
    changeRoute({
      type: 'parent',
      slugs: {
        parent: 'home'
      }
    });
  });

  page('/:parent', (req) => {
    changeRoute({
      type: 'parent',
      slugs: req.params
    });
  });

  page('/:parent/:child', (req) => {
    changeRoute({
      type: 'child',
      slugs: req.params
    });
  });

  page('*', (req) => {
    changeRoute({
      type: 'parent',
      slugs: {
        parent: '404'
      }
    });
  });

  page({
    hashbang: true
  });
});
