import React, { Component } from "react";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";
import { compose } from "recompose";
import { consumerFirebase } from "../../helpers";


import { signupSession } from "../../sessions/actions/sessionAction";
import { StateContext } from "../../sessions/store";
import { openWindowsMessage } from "../../sessions/actions/snackbarAction";

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 8,
    backgroundColor: "#e53935",
  },
  form: {
    width: "100%",
    marginTop: 10,
  },
  submit: {
    margin: 10,
  },
  textFields: {
    margin: 10,
  },
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
      <Container maxWidth="md">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            SIGN UP
          </Typography>
          <form style={style.form}>
            <Grid container justify="center">
              <Grid item md={6} xs={12}>
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
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item xs={12} md={6}>
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
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Signup);
