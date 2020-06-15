import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import BarSession from "./BarSession";
import { withStyles } from "@material-ui/styles";
import { compose } from "recompose";
import { consumerFirebase } from "../../helpers";
import { StateContext } from "../../sessions/store";

const styles = (theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
});

class NavBar extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
  };

  componentDidMount() {
    const { firebase } = this.state; //local state
    const [{ session }, dispatch] = this.context; // global state

    if (firebase.auth.currentUser !== null && !session) {
      firebase.db
      .collection('users')
      .doc(firebase.auth.currentUser.uid)
      .get()
      .then(doc => {
        // console.log(doc.data())
        const userDb = doc.data();
        dispatch({
          type: 'SIGN_IN',
          session: userDb,
          auth: true,
        });
      }).catch(err => {
        console.error(err);
      })
    }

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newObjects = {};
    if (nextProps.firebase !== prevState.firebase) {
      newObjects.firebase = nextProps.firebase;
    }
    return newObjects;
  }

  render() {

    // eslint-disable-next-line
    const [{ session }, dispatch] = this.context;


    return session ? (session.auth ? (
      <div>
        <AppBar position="static">
          <BarSession />
        </AppBar>
      </div>
    )
      : null
    )
      : null;
  }
}
export default compose(withStyles(styles), consumerFirebase)(NavBar);
