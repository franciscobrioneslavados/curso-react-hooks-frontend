import React, { Component } from "react";
import { Toolbar, Typography, Button, IconButton, Drawer, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { consumerFirebase } from '../../helpers';
import { compose } from 'recompose';
import { StateContext } from '../../sessions/store';

import { signoutSession } from '../../sessions/actions/sessionAction';

import { RightMenu } from './RightMenu';
import { LeftMenu } from './LeftMenu';
import tempUserPhoto from '../../logo.svg'
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';



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
  grow: {
    flexGrow: 1,
  },

  listItemText: {
    fontSize: "14px",
    fontWeight: 600,
    paddingLeft: "15px",
    color: "#212121"

  },
  avatarSize: {
    width: 40,
    height: 40
  },
  list: {
    width: 250
  }

});

class BarSession extends Component {

  static contextType = StateContext;

  state = {
    firebase: null,
    right: false,
    left: false
  }

  signOut = () => {
    const { firebase } = this.state;
    const [{ session }, dispatch] = this.context;

    signoutSession(dispatch, firebase).then(success => {
      // console.log(response);
      this.props.history.push("/auth/signin");
    }).catch(err => {
      console.error(err);
    })
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    })
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
    const { firebase } = this.state;
    const { user } = session;
    const { classes } = this.props;
    let textUser = user.username ? user.username : user.email;

    if (!user) {
      signoutSession(dispatch, firebase).then(success => {
        this.props.history.push("/auth/login");
      });
    }

    return (
      <div>
        {/* Menu izquierda */}
        <Drawer
          open={this.state.left}
          onClose={this.toggleDrawer("left", false)}
          anchor="left"
        >
          <div
            role="button"
            onClick={this.toggleDrawer("left", false)}
            onKeyDown={this.toggleDrawer("left", false)}>
            <LeftMenu
              classes={classes}
            ></LeftMenu>
          </div>

        </Drawer>

        {/* Menu Derecha */}
        <Drawer
          open={this.state.right}
          onClose={this.toggleDrawer("right", false)}
          anchor="right"
        >
          <div
            role="button"
            onClick={this.toggleDrawer("right", false)}
            onKeyDown={this.toggleDrawer("right", false)}>
            <RightMenu
              classes={classes}
              user={user}
              textUser={textUser}
              photoUser={tempUserPhoto}
              signOut={this.signOut}
            ></RightMenu>
          </div>

        </Drawer>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={this.toggleDrawer('left', true)}>
            <i className="material-icons">menu</i>
          </IconButton>

          <Typography variant="h6">CURSO REACT</Typography>
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit" component={Link} to=""><i className="material-icons">mail_outline</i></IconButton>
            <Button color="inherit" onClick={this.signOut}>SIGN OUT</Button>
            <Button color="inherit">{user.username}</Button>
            <Avatar src={tempUserPhoto}></Avatar>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              color="inherit"
              onClick={this.toggleDrawer("right", true)}
            >
              <i className="material-icons">more_vert</i>
            </IconButton>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export default compose(withRouter, consumerFirebase, withStyles(styles))(BarSession);
