import sessionReducer from "./sessionReducer";
import snackBarReducer from "./snackBarReducer";

/**
 * Middleware Reduce
 */
export const mainReducer = ({ session, snackBar }, action) => {
  return {
    session: sessionReducer(session, action),
    snackBar: snackBarReducer(snackBar, action),
  };
};
