export const openWindowsMessage = (dispatch, openMessage) => {
  dispatch({
    type: "OPEN_SNACKBAR",
    openMessage: openMessage,
  });
};
