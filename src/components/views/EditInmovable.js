import React, { Component } from 'react';
import { consumerFirebase } from '../../helpers';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ImageUploader from 'react-images-upload';
import { v4 as uuidv4 } from 'uuid';
import { createKeyword } from '../../sessions/actions/Keyword'

const style = {
    container: {
        paddingTop: "8px"
    },
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    link: {
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    homeIcon: {
        width: 20,
        height: 20,
        marginRight: "4px"
    },
    submit: {
        marginTop: 15,
        marginBottom: 10
    },
    imageFiles: {
        height: "100px"
    }
}

class EditInmovable extends Component {

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

    onChangeTextInputs = e => {
        let inmovable_ = Object.assign({}, this.state.inmovable);
        inmovable_[e.target.name] = e.target.value;
        this.setState({
            inmovable: inmovable_
        })
    }

    onSubmitImages = images => {

        const { inmovable } = this.state;
        const { id } = this.props.match.params; // Capturar el valor del parametro

        Object.keys(images).forEach(key => {
            let codeDinamic = uuidv4();
            let imageName = images[key].name;
            let imageExt = imageName.split('.').pop();
            images[key].alias = (`${imageName.split('.')[0]}_${codeDinamic}.${imageExt}`).replace(/\s/g, "_").toLowerCase();
        })

        this.props.firebase.saveDocuments(images).then(urlImages => {
            inmovable.listImages = inmovable.listImages.concat(urlImages);
            this.props.firebase.db.collection('inmovables').doc(id).set(inmovable, { merge: true }).then(result => {
                this.setState({
                    inmovable
                })
            })
        })
    }

    onRemoveImage = image => async () => {
        const { inmovable } = this.state;
        const { id } = this.props.match.params; // Capturar el valor del parametro 

        let photoId = image.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
        photoId = photoId[0];

        await this.props.firebase.removeDocument(photoId);

        let listImages = this.state.inmovable.listImages.filter(imageObject => {
            return imageObject !== image
        })

        inmovable.listImages = listImages;

        this.props.firebase.db
            .collection('inmovables')
            .doc(id)
            .set(inmovable, { merge: true })
            .then(result => {
                this.setState({
                    inmovable
                })
            });
    }

    onSaveChanges = () => {
        const { id } = this.props.match.params; // Capturar el valor del parametro 
        
        const { inmovable } = this.state;
        const searchTxt = inmovable.address + " " + inmovable.city + " " + inmovable.country;
        const keyWords = createKeyword(searchTxt);

        inmovable.keywords = keyWords;

        this.props.firebase.db
            .collection('inmovables')
            .doc(id)
            .set(inmovable, { merge: true })
            .then(result => {
                this.props.history.push('/');
            })

    }

    async componentDidMount() {

        const { id } = this.props.match.params; // Capturar el valor del parametro 
        const inmovableCollection = this.props.firebase.db.collection('inmovables');
        const inmovableDB = await inmovableCollection.doc(id).get();

        this.setState({
            inmovable: inmovableDB.data()
        })

    }

    render() {
        let imageKey = uuidv4();

        return (
            <Container style={style.container}>
                <Paper style={style.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={style.link} href="/" >
                                    <HomeIcon style={style.homeIcon} />
                                    Home
                                </Link>
                                <Typography color="textPrimary">Editar Inmueble</Typography>
                            </Breadcrumbs>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <TextField
                                name="address"
                                label="Direccion del Inmbueble"
                                fullWidth
                                value={this.state.inmovable.address}
                                onChange={this.onChangeTextInputs}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="city"
                                label="Ciudad"
                                fullWidth
                                value={this.state.inmovable.city}
                                onChange={this.onChangeTextInputs}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="country"
                                label="Pais"
                                fullWidth
                                value={this.state.inmovable.country}
                                onChange={this.onChangeTextInputs}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="inDatails"
                                label="Descripcion del Interior"
                                fullWidth
                                multiline
                                value={this.state.inmovable.inDatails}
                                onChange={this.onChangeTextInputs}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="outDetails"
                                label="Descripcion del Exterior"
                                fullWidth
                                multiline
                                value={this.state.inmovable.outDetails}
                                onChange={this.onChangeTextInputs}
                            />
                        </Grid>
                    </Grid>

                    <Grid container justify="center">
                        <Grid item xs={12} sm={6}>
                            <ImageUploader
                                key={imageKey}
                                withIcon={true}
                                buttonText="Select Images"
                                onChange={this.onSubmitImages}
                                imgExtension={['.jpg', '.jpeg', '.png', '.gif']}
                                maxFileSize={5242880}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Table>
                                <TableBody>
                                    {this.state.inmovable.listImages
                                        ? this.state.inmovable.listImages.map((element, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="left">
                                                    <img src={element} style={style.imageFiles} alt={element} />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={this.onRemoveImage(element)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                        ))
                                        : ""
                                    }
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
                                style={style.submit}
                                onClick={this.onSaveChanges}
                            >
                                Save
                                </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }
}

export default consumerFirebase(EditInmovable) 