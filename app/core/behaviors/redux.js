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

const ReduxBehavior = PolymerRedux(store);
