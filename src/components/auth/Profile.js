import React, { useState, useEffect } from 'react';
import { useStateValue } from '../../sessions/store'
import { Container, Avatar, Typography, Grid, TextField, Button } from '@material-ui/core'
import reactPhotoDefault from '../../logo.svg';
import { consumerFirebase } from '../../helpers/'
import { openWindowsMessage } from '../../sessions/actions/snackbarAction';
import ImageUploader from 'react-images-upload';

const styles = {
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%",
        marginTop: 20
    },
    submit: {
        marginTop: 15,
        marginBottom: 20
    }
}

const Profile = props => {
    const [{ session }, dispatch] = useStateValue();
    const firebase = props.firebase;

    let [stateObject, changeStateObject] = useState({
        userId: '',
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        avatar: ''
    });

    const onChangeStateObject = e => {
        const { name, value } = e.target;
        changeStateObject(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        if (stateObject.userId === '') {
            if (session) {
                changeStateObject(session.user);
            }
        }
    })

    const onSaveChanges = e => {
        e.preventDefault();

        firebase.db.collection("users").doc(firebase.auth.currentUser.uid).set(stateObject, { merge: true }).then(result => {
            console.log(result);
            dispatch({
                type: "SIGN_IN",
                session: stateObject,
                auth: true

            });

            openWindowsMessage(dispatch, {
                open: true,
                message: "Cambios guardados!"
            })

        }).catch(err => {
            openWindowsMessage(dispatch, {
                open: true,
                message: `Error: ${err.message}`
            })
            console.error(err);
        })
    }

    const onSubmitImage = images => {
        const image = images[0];
        const imageExt = image.name.split('.').pop();
        const imageAlias = `${firebase.auth.currentUser.uid}_${Date.now()}.${imageExt}`;

        firebase.saveDocument(imageAlias, image).then(metadata => {
            firebase.returnDocument(imageAlias).then(imageUrl => {
                stateObject.avatar = imageUrl;
                firebase.db.collection("users").doc(firebase.auth.currentUser.uid).set({
                    avatar: imageUrl
                }, { merge: true }).then(result => {
                    dispatch({
                        type: 'SIGN_IN',
                        session: stateObject,
                        auth: true
                    });

                    openWindowsMessage(dispatch, {
                        open: true,
                        message: "Image Saved!"
                    })
                }).catch(err => {
                    console.error(err);
                })
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }

    return (session
        ? (
            <Container component="main" maxWidth="md" justify='center'>
                <div style={styles.paper}>
                    <Avatar style={styles.avatar} src={stateObject.avatar || reactPhotoDefault} />
                    <Typography component="h1" variant="h5">
                        Perfil de Cuenta
                    </Typography>
                    <form style={styles.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField name="firstname" variant="outlined" fullWidth label="Nombres" value={stateObject.firstname} onChange={onChangeStateObject} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="lastName" variant="outlined" fullWidth label="Apellidos" value={stateObject.lastName} onChange={onChangeStateObject} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="username" variant="outlined" fullWidth label="Username" value={stateObject.username} onChange={onChangeStateObject} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="email" variant="outlined" fullWidth label="Email" value={stateObject.email} onChange={onChangeStateObject} disabled />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="phone" variant="outlined" fullWidth label="Phone Number" value={stateObject.phone} onChange={onChangeStateObject} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <ImageUploader
                                    withIcon={false}
                                    key={Date.now()}
                                    singleImage={true}
                                    buttonText="Select Image"
                                    onChange={onSubmitImage}
                                    imgExtension={[".jpg", ".jpeg", "gif", "png"]}
                                    maxFileSize={5242880}
                                />

                            </Grid>

                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button type="submit" fullWidth variant="contained" size="large" color="primary" style={styles.submit} onClick={onSaveChanges}>Save Changes</Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        )
        : null
    );
}

export default consumerFirebase(Profile);
