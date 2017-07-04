const ReduxStateBehavior = PolymerRedux(store);

const ReduxActionsBehavior = {
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
    pushNotification: (message, type = 'info') => {
      return (dispatch) => {
        dispatch({
          PUSH_NOTIFICATION,
          payload: {
            message,
            type
          }
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
  },

  ready: function() {
    if (this.registerReducer) {
      const reducer = this.registerReducer();
      _.each(reducer.constants, (constant) => {
        constant = _.toUpper(constant);
        window[constant] = constant;
      });
      injectAsyncReducer(reducer.name, reducer.reducer);
    }
  }
};
