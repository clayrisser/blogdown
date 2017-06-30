const ReduxActions = {
  actions: {
    startLoading: (actionType) => {
      return (dispatch) => {
        dispatch({
          type: START_LOADING,
          payload: actionType
        });
      };
    },
    finishLoading: (actionType) => {
      return (dispatch) => {
        dispatch({
          type: FINISH_LOADING,
          payload: actionType
        });
      };
    },
    pushNotification: (notification) => {
      return (dispatch) => {
        dispatch({
          PUSH_NOTIFICATION,
          payload: notification
        });
      };
    },
    patchPage: (page) => {
      return (dispatch) => {
        dispatch({
          type: PATCH_PAGE,
          payload: page
        });
      };
    },
    patchPost: (taxonomy, post) => {
      return (dispatch) => {
        dispatch({
          type: PATCH_POST,
          payload: { taxonomy, post }
        });
      };
    }
  }
};

const ReduxReducer = {
  ready: () => {
    const reducer = this.registerReducer();
    _.each(reducer.constants, (constant) => {
      constant = _.toUpper(constant);
      window[constant] = constant;
    });
    injectAsyncReducer(reducer.name, reducer.reducer);
  }
};

const ReduxState = PolymerRedux(store);
