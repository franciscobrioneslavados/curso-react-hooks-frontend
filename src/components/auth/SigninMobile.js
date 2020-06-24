import React, { Component } from 'react';
// eslint-disable-next-line
import * as firebaseui from 'firebaseui';
import { Link, Container, Avatar, Typography, Grid, DialogContentText, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import LockOpenOutlined from '@material-ui/icons/LockOpenOutlined'
import { consumerFirebase } from '../../helpers';
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
    },
    captcha: {
        flexGrow: 1,
        marginBottom: 10
    }
};

class SigninMobile extends Component {
    static contextType = StateContext;

    state = {
        openDialog: false,
        disable: true,
        confirmCode: '',
        user: {
            phoneNumber: '',
            verifyCode: ''
        }

    }

    componentDidMount() {
        const { firebase } = this.props;
        firebase.auth.languageCode = "es";
        window.recaptchaVerifier = new firebase.authorization.RecaptchaVerifier(
            this.recaptcha,
            {
                size: "normal",
                callback: response => {
                    this.setState({
                        disable: false
                    })
                },
                "expired-callback": function () {
                    this.setState({
                        disable: true
                    });

                    window.location.reload();
                }
            }
        );

        window.recaptchaVerifier.render().then(function (widgetID) {
            window.recaptchaVerifierId = widgetID;
        });
    }

    verifyPhoneNumber = e => {
        e.preventDefault();
        // eslint-disable-next-line
        const [{ session }, dispatch] = this.context;

        const { firebase } = this.props;
        const onVerify = window.recaptchaVerifier;
        firebase.auth.signInWithPhoneNumber(this.state.user.phoneNumber, onVerify).then(codeSend => {
            this.setState({
                openDialog: true,
                confirmCode: codeSend
            })
        }).catch(err => {
            openWindowsMessage(dispatch, {
                open: true,
                message: err.message
            })
        })
    }

    onChangeTextInputs = e => {
        let user = Object.assign({}, this.state.user);
        user[e.target.name] = e.target.value;
        this.setState({ user })
    }

    signInWithPhone = () => {

        const { firebase } = this.props;

        let credential = firebase.authorization.PhoneAuthProvider.credential(
            this.state.confirmCode.verificationId,
            this.state.user.verifyCode
        );

        // eslint-disable-next-line
        const [{ user }, dispatch] = this.context;

        firebase.auth
            .signInAndRetrieveDataWithCredential(credential)
            .then(authUser => {
                firebase.db
                    .collection("users")
                    .doc(authUser.user.uid)
                    .set({
                        userId: authUser.user.uid,
                        phoneNumber: authUser.user.phoneNumber
                    }, { merge: true }).then(result => {
                        firebase.db.collection('users').doc(authUser.user.uid).get().then(doc => {
                            dispatch({
                                type: 'SIGN_IN',
                                session: doc.data(),
                                auth: true
                            });
                            // this.props.history.push('/')
                            window.location.replace('/');

                        })
                    })
            }).catch(err => {
                openWindowsMessage(dispatch, {
                    open: true,
                    message: err.message
                })
            })
    }

    render() {
        return (
            <Container maxWidth="xs">

                <Dialog open={this.state.openDialog} onClose={() => { this.setState({ openDialog: false }) }}>
                    <DialogTitle>Push the code</DialogTitle>
                    <DialogContent>
                        <DialogContentText>

                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="verifyCode"
                            fullWidth
                            onChange={this.onChangeTextInputs}
                            value={this.state.user.verifyCode}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button color="primary" onClick={() => { this.setState({ openDialog: false }) }}>Cancel</Button>
                        <Button color="primary" onClick={this.signInWithPhone}>Verify</Button>
                    </DialogActions>

                </Dialog>

                <div style={style.paper}>
                    <Avatar style={style.avatar}>
                        <LockOpenOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Phone Number
              </Typography>
                    <form style={style.form}>
                        <Grid container style={style.captcha} justify="center">
                            <div ref={ref => (this.recaptcha = ref)}></div>
                        </Grid>

                        <TextField
                            variant="outlined"
                            fullWidth
                            name="phoneNumber"
                            label="Enter Phone Number"
                            onChange={this.onChangeTextInputs}
                            value={this.state.user.phoneNumber}

                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={style.submit}
                            onClick={this.verifyPhoneNumber}
                            disabled={this.state.disable}
                        >
                            Send
                        </Button>

                        <Grid container>
                            <Grid item xs>
                                <Link href="/auth/signin" variant="body2">
                                    {"Signin with email and password"}
                                </Link>
                            </Grid>

                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

export default consumerFirebase(SigninMobile);