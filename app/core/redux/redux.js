const initialState = {
  authors: {},
  pages: [],
  settings: {},
  taxonomies: {},
  route: {},
  meta: {
    appLoaded: false,
    loading: [],
    progress: -1,
    narrow: false,
    selectedMenuItem: -1,
    baseUrl: '',
    hashId: ''
  }
};

const createReducer = (asyncReducers) => {
  return Redux.combineReducers({
    authors: app._reducers.authors,
    meta: app._reducers.meta,
    pages: app._reducers.pages,
    route: app._reducers.route,
    settings: app._reducers.settings,
    taxonomies: app._reducers.taxonomies,
    ...asyncReducers
  });
};

const configureStore = () => {
  const store = Redux.createStore(
    createReducer(),
    Redux.applyMiddleware(ReduxThunk.default)
  );
  store.asyncReducers = {};
  return store;
};

const store = configureStore();

const injectAsyncReducer = (name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducer));
};
