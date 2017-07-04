app._reducers.notifications = (state = initialState.notifications, action) => {
  switch (action.type) {
  case PUSH_NOTIFICATION:
    const notifications = _.clone(state);
    notifications.push(action.payload);
    return notifications;
  default:
    return state;
  }
};
