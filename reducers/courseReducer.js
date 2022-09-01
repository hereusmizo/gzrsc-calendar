const reducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_COURSE':
      return action.payload;
    case 'CLEAR_COURSE':
      return [];
    default:
      return state;
  }
};
export default reducer;
