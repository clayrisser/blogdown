_reducers.meta = (state = {}, action) => {
  switch (action.type) {
  case APP_LOADED:
    return _.assign({}, state, {
      appLoaded: true
    });
  case START_LOADING:
    return _.assign({}, state, {
      loading: _.clone(state.loading).push(action.payload)
    });
  case FINISH_LOADING:
    return _.assign({}, state, {
      loading: _.remove(_.clone(state.loading), (item) => {
        return item !== action.payload;
      })
    });
  case APP_PROGRESS:
    return _.assign({}, state, {
      progress: action.payload
    });
  case UPDATE_NARROW:
    return _.assign({}, state, {
      narrow: action.payload
    });
  case UPDATE_SELECTED_MENU_ITEM:
    return _.assign({}, state, {
      selectedMenuItem: action.payload
    });
  case SET_BASE_URL:
    return _.assign({}, state, {
      baseUrl: action.payload
    });
  case SET_HASH_ID:
    return _.assign({}, state, {
      hashId: action.payload
    });
  default:
    return state;
  }
};
