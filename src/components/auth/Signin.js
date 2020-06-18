import React, { Component } from "react";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Link
} from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";
import { compose } from "recompose";
import { consumerFirebase } from "../../helpers";

import { signinSession } from "../../sessions/actions/sessionAction";
import { StateContext } from "../../sessions/store";
import { openWindowsMessage } from "../../sessions/actions/snackbarAction";


const style = {
  paper: {
    marginTop: 9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 5,
    backgroundColor: "red"
  },
  form: {
    width: "100%",
    marginTop: 8
  },
  submit: {
    marginTop: 10,
    marginBottom: 20
  },
  textFields: {
    marginTop: 10,
    marginBottom: 10
  }
};

class Signin extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    user: {
      email: "",
      password: "",
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebase === prevState.firebase) {
      return null;
    }

    return {
      firebase: nextProps.firebase,
    };
  }

  onChange = (e) => {
    let user = Object.assign({}, this.state.user);
    user[e.target.name] = e.target.value;
    this.setState({
      user: user,
    });
  };

  onSignin = async (e) => {
    e.preventDefault();

    // eslint-disable-next-line
    const [{ session }, dispatch] = this.context;
    const { firebase, user } = this.state;
    const { email, password } = user;
    await signinSession(dispatch, firebase, email, password)
      .then((res) => {
        // console.log(res);
        this.props.history.push("/");
      })
      .catch((err) => {
        // console.error(err);
        openWindowsMessage(dispatch, {
          open: true,
          message: err.message.message,
        });
      });

    /*
    firebase.auth.signInWithEmailAndPassword(user.email, user.password).then(response => {
        console.info(response);
        this.props.history.push('/') 
    }).catch(err => {
        console.error(err);
    });
    */
  };

  onForgotPassword = () => {
    const { firebase, user } = this.state;
    const [{ session }, dispatch] = this.context;

    firebase.auth.sendPasswordResetEmail(user.email).then(result => {
      openWindowsMessage(dispatch, {
        open: true,
        message: "An email has been sent to your mailbox"
      })
    }).catch(err => {
      console.error(err);
      openWindowsMessage(dispatch, {
        open: true,
        message: err.message
      })
    })
  }

  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            SIGN IN
          </Typography>
          <form style={style.form}>
            <TextField
              variant="outlined"
              name="email"
              fullWidth
              label="Email"
              style={style.textFields}
              value={this.state.user.email}
              onChange={this.onChange}
            />
            <TextField
              variant="outlined"
              type="password"
              name="password"
              fullWidth
              label="Password"
              style={style.textFields}
              value={this.state.user.password}
              onChange={this.onChange}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              style={style.submit}
              onClick={this.onSignin}
            >
              SIGN IN
                </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={this.onForgotPassword}>
                  {"Forgot password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signup" variant="body2">
                  {"Need Account? Signup"}
                </Link>
              </Grid>
            </Grid>

          </form>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={style.submit}
            href="/auth/signinmobile"
          >
            Sign in with your phone number
                    </Button>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Signin);
