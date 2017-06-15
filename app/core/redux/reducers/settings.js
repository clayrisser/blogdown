_reducers.settings = (state = {}, action) => {
  switch (action.type) {
  case LOAD_SETTINGS:
    return _.assign({}, state, action.payload);
  default:
    return state;
  }
};
