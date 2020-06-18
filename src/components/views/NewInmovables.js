import React, { Component } from "react";
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../helpers";
import ImageUploader from 'react-images-upload';
import { v4 as uuidv4 } from 'uuid';
import { createKeyword } from '../../sessions/actions/Keyword';

const styles = {
    container: {
        paddingTop: "8px",
    },
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
    },
    link: {
        display: "flex",
    },
    homeIcon: {
        width: 20,
        height: 20,
        marginRight: "4px",
    },
    submit: {
        marginTop: 15,
        margintBottom: 10,
    },
    imageFiles: {
        height: "100px",

    }
};

class NewInmovables extends Component {

    state = {
        inmovable: {
            address: '',
            city: '',
            country: '',
            inDatails: '',
            outDetails: '',
            listImages: [],
        },
        imageFiles: []
    }

    onChangeStateObject = e => {
        let inmovable_ = Object.assign({}, this.state.inmovable);
        inmovable_[e.target.name] = e.target.value;
        this.setState({
            inmovable: inmovable_
        })
    }

    onSubmitImagesToList = elements => {
        Object.keys(elements).forEach(function (key) {
            elements[key].urlTemp = URL.createObjectURL(elements[key]);
        })
        this.setState({
            imageFiles: this.state.imageFiles.concat(elements),
        })
    }

    onSubmitStateObject = () => {
        const { imageFiles, inmovable } = this.state;

        Object.keys(imageFiles).forEach(function (key) {
            let dinamicValue = Math.floor(new Date().getTime() / 1000);
            let imageName = imageFiles[key].name;
            let imageExt = imageName.split('.').pop();
            imageFiles[key].alias = (
                imageName.split('.')[0] +
                "_" +
                dinamicValue +
                "." +
                imageExt)
                .replace(/\s/g, "_")
                .toLowerCase();
        })

        const searchTxt = inmovable.address + ' ' + inmovable.city + ' ' + inmovable.country;
        let keywords = createKeyword(searchTxt);

        this.props.firebase.saveDocuments(imageFiles).then(urlList => {
            inmovable.listImages = urlList;
            inmovable.keywords = keywords;
            inmovable.userId = this.props.firebase.auth.currentUser.uid;

            this.props.firebase.db.collection('inmovables').add(inmovable).then(result => {
                this.props.history.push('/')
            }).catch(err => {
                console.error(err);
            })
        })

    }

    onRemoveImageFromList = elementName => () => {
        this.setState({
            imageFiles: this.state.imageFiles.filter(archivo => {
                return archivo.name !== elementName;
            })
        });
    }

    render() {
        let imageKey = uuidv4();
        return (
            <Container style={styles.container}>
                <Paper style={styles.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={styles.link} href="/">
                                    <HomeIcon style={styles.homeIcon} />
                                    Home
                                    </Link>
                                <Typography color="textPrimary">New Inmovable </Typography>
                            </Breadcrumbs>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <TextField
                                name="address"
                                label="Direccion del Inmbueble"
                                fullWidth
                                value={this.state.inmovable.address}
                                onChange={this.onChangeStateObject}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="city"
                                label="Ciudad"
                                fullWidth
                                value={this.state.inmovable.city}
                                onChange={this.onChangeStateObject}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="country"
                                label="Pais"
                                fullWidth
                                value={this.state.inmovable.country}
                                onChange={this.onChangeStateObject}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="inDatails"
                                label="Descripcion del Interior"
                                fullWidth
                                multiline
                                value={this.state.inmovable.inDatails}
                                onChange={this.onChangeStateObject}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="outDetails"
                                label="Descripcion del Exterior"
                                fullWidth
                                multiline
                                value={this.state.inmovable.outDetails}
                                onChange={this.onChangeStateObject}
                            />
                        </Grid>

                    </Grid>

                    <Grid container justify="center">
                        <Grid item xs={12} sm={6}>
                            <ImageUploader
                                key={imageKey}
                                withIcon={true}
                                buttonText="Select Images"
                                onChange={this.onSubmitImagesToList}
                                imgExtension={['.jpg', '.jpeg', '.png', '.gif']}
                                maxFileSize={5242880}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Table>
                                <TableBody>
                                    {this.state.imageFiles.map((element, i) => (
                                        <TableRow key={i}>
                                            <TableCell align="left">
                                                <img src={element.urlTemp} style={styles.imageFiles} alt={element} />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={this.onRemoveImageFromList(element.name)}
                                                >
                                                    Remove
                                                    </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>

                    </Grid>

                    <Grid container justify="center">
                        <Grid item xs={12} md={6}>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                size="large"
                                color="primary"
                                style={styles.submit}
                                onClick={this.onSubmitStateObject}
                            >
                                Save
                                </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container >
        );
    }
}

export default consumerFirebase(NewInmovables);