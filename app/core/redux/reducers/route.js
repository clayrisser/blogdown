app._reducers.route = (state = {}, action) => {
  switch (action.type) {
  case CHANGE_ROUTE:
    return _.clone(action.payload);
  default:
    return state;
  }
};
