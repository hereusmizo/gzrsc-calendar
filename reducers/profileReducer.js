const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_PROFILE':
      return action.payload;
    case 'CLEAR_PROFILE':
      return {};
    default:
      return state;
  }
};
export default reducer;
