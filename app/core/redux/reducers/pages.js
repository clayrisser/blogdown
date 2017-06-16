app._reducers.pages = (state = [], action) => {
  switch (action.type) {
  case LOAD_PAGES:
    return _.flatten([[], state, action.payload]);
  default:
    return state;
  }
};
