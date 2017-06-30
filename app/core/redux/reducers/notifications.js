app._reducers.notifications = (state = initialState.notifications, action) => {
  switch (action.type) {
  case PUSH_NOTIFICATION:
    return _.flatten([state.notifications, [action.payload]]);
  default:
    return state;
  }
};
