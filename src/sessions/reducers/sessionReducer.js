export const initialState = {
  user: {
    userId: '',
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    avatar: ''
  },
  auth: false,
}


const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        user: action.session,
        auth: action.auth,
      };
    case "CHANGE_SESSION":
      return {
        ...state,
        user: action.newUser,
        auth: action.auth,
      };
    case "SIGN_OUT":
      return {
        ...state,
        user: action.session,
        auth: action.auth,
      };
    default:
      return state;
  }
};

export default sessionReducer;
