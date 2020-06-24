import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/** Import Themes */
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import Grid from "@material-ui/core/Grid";
import { Snackbar } from "@material-ui/core";

/** Imports Components */
import Navbar from "./components/layout/Navbar";
import ListInmovables from "./components/views/ListInmovables";
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";
import SigninMobile from './components/auth/SigninMobile';
import Profile from './components/auth/Profile';
import NewInmovables from "./components/views/NewInmovables";
import ListUsers from "./components/views/ListUsers";
import AuthRoutes from './components/auth/AuthRoutes';
import EditInmovable from "./components/views/EditInmovable";

/**FIREBASE  */
import { FirebaseContext } from "./helpers";
import { useStateValue } from "./sessions/store";

/** REDUX */
import store from './redux/store';
import { Provider } from 'react-redux';


function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [initAuth, initFirebase] = React.useState(false);

  const [{ snackBar }, dispatch] = useStateValue();

  useEffect(() => {
    firebase
      .initState()
      .then((val) => {
        initFirebase(val);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  return initAuth !== false ? (
    <Provider store={store}>
      <React.Fragment>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackBar ? snackBar.open : false}
          autoHideDuration={5000}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={
            <span id="message-id">{snackBar ? snackBar.message : ""}</span>
          }
          onClose={() =>
            dispatch({
              type: "OPEN_SNACKBAR",
              openMessage: { open: false, message: "" },
            })
          }
        ></Snackbar>
        <Router>
          <MuiThemeProvider theme={theme}>
            <Navbar />
            <Grid container>
              <Switch>
                <AuthRoutes exact path="/" authFirebase={firebase.auth.currentUser} component={ListInmovables}></AuthRoutes>
                <AuthRoutes exact path="/main/profile" authFirebase={firebase.auth.currentUser} component={Profile}></AuthRoutes>
                <AuthRoutes exact path="/main/newinmovable" authFirebase={firebase.auth.currentUser} component={NewInmovables}></AuthRoutes>
                <AuthRoutes exact path="/main/inmovable/:id" authFirebase={firebase.auth.currentUser} component={EditInmovable}></AuthRoutes>
                <AuthRoutes exact path="/main/listusers" authFirebase={firebase.auth.currentUser} component={ListUsers}></AuthRoutes>

                <Route path="/auth/signup" component={Signup}></Route>
                <Route path="/auth/signin" component={Signin}></Route>
                <Route path="/auth/signinmobile" component={SigninMobile}></Route>
              </Switch>
            </Grid>
          </MuiThemeProvider>
        </Router>
      </React.Fragment>
    </Provider>

  ) : null;
}

export default App;
