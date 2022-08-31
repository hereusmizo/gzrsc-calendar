const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_DECODED':
      return action.payload;
    case 'CLEAR_DECODED':
      return {};
    default:
      return state;
  }
};
export default reducer;
