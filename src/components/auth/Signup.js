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


import { signupSession } from "../../sessions/actions/sessionAction";
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

// eslint-disable-next-line
const userDefault = {
  username: "",
  email: "",
  password: "",
};
class Signup extends Component {
  static contextType = StateContext;
  state = {
    firebase: null,
    user: {
      username: "",
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

  onSignup = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    const [{ session }, dispatch] = this.context;
    const { firebase, user } = this.state;
    await signupSession(dispatch, firebase, user).then(res => {
      this.props.history.push("/");
    }).catch(err => {
      openWindowsMessage(dispatch, {
        open: true,
        message: err.message.message,
      });
    })

  };
  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            SIGN UP
          </Typography>
          <form style={style.form}>

            <TextField
              variant="outlined"
              name="username"
              fullWidth
              label="Username"
              style={style.textFields}
              value={this.state.user.username}
              onChange={this.onChange}
            />
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
              onClick={this.onSignup}
            >
              SIGN UP
                </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/auth/signin" variant="body2">
                  {"Already have an account?"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Signup);
