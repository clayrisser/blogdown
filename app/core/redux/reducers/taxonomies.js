_reducers.taxonomies = (state = {}, action) => {
  switch (action.type) {
  case LOAD_TAXONOMIES:
    return _.assign({}, state, action.payload);
  default:
    return state;
  }
};
