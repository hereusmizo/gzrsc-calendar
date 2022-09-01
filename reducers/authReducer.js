const reducer = (state = null, action) => {
  switch (action.type) {
    case 'AUTH_ADMIN':
      return 1;
    case 'AUTH_STUDENT':
      return 2;
    case 'AUTH_TEACHER':
      return 3;
    case 'AUTH_FAIL':
      return 0;
    default:
      return state;
  }
};
export default reducer;
