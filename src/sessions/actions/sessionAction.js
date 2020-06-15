export const signinSession = (dispatch, firebase, email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        firebase.db
          .collection("users")
          .doc(auth.user.uid)
          .get()
          .then((user) => {
            const userDb = user.data();
            dispatch({
              type: "SIGN_IN",
              session: userDb,
              auth: true,
            });
            resolve({ status: true });
          })
          .catch((err) => {
            // console.error(err);
            reject({ status: false, message: err });
          });
      })
      .catch((err) => {
        // console.error(err);
        reject({ status: false, message: err });
      });
  });
};

export const signupSession = (dispatch, firebase, user) => {
  return new Promise((resolve, reject) => {
    firebase.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((auth) => {
        firebase.db
          .collection("users")
          .doc(auth.user.uid)
          .set(
            {
              userId: auth.user.uid,
              email: user.email,
              username: user.username,
            },
            { merge: true }
          )
          .then((data) => {
            user.userId = auth.user.uid;
            dispatch({
              type: "SIGN_IN",
              session: user,
              auth: true,
            });
            resolve({ status: true });
          })
          .catch((err) => {
            // console.error(err);
            reject({ status: false, message: err });
          });
      })
      .catch((err) => {
        // console.error(err);
        reject({ status: false, message: err });
      });
  });
};

export const signoutSession = (dispatch, firebase) => {
  console.log(firebase);

  return new Promise((resolve, reject) => {
    firebase.auth.signOut().then(out => {
      dispatch({
        type: "SIGN_OUT",
        session: {
          username: "",
          name: "",
          lastname: "",
          email: "",
          phone: "",
          avatar: "",
        },
        auth: false,
      });
      resolve();
    })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
