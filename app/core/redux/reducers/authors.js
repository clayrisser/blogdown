_reducers.authors = (state = {}, action) => {
  switch (action.type) {
  case LOAD_AUTHORS:
    return _.assign({}, state, action.payload);
  default:
    return state;
  }
};
