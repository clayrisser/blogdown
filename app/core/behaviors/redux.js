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
