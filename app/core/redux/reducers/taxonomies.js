app._reducers.taxonomies = (state = {}, action) => {
  switch (action.type) {
  case LOAD_TAXONOMIES:
    return _.assign({}, state, action.payload);
  case PATCH_POST:
    return _.assign({}, state, _.map(state[action.payload.taxonomy], (post) => {
      if (post.slug === action.payload.post.slug) _.assign(post, action.payload.post);
      return post;
    }));
  default:
    return state;
  }
};
