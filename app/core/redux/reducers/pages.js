app._reducers.pages = (state = [], action) => {
  switch (action.type) {
  case LOAD_PAGES:
    return _.flatten([[], state, action.payload]);
  case PATCH_PAGE:
    return _.map(state, (page) => {
      if (page.slug === action.payload.slug) _.assign(page, action.payload);
      return page;
    });
  default:
    return state;
  }
};
