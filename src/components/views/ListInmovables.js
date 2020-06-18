import React, { Component } from "react";
import { Button, Container, Paper, Grid, Breadcrumbs, Typography, TextField, CardMedia, Card, CardContent, CardActions, Link, ButtonGroup } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import { consumerFirebase } from '../../helpers';
import tempImage from '../../logo.svg'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import { getData, getDataPrev } from "../../sessions/actions/inmovableAction";

const styles = {
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8
  },
  paper: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    minHeight: 650
  },
  link: {
    display: "flex"
  },
  gridTextfield: {
    marginTop: "20px"
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%"
  },
  cardContent: {
    flexGrow: 1
  },
  groupButton: {
    marginTop: "20px"
  },

}


class ListInmovables extends Component {

  state = {
    listInmovables: [],
    searchTxt: '',
    pages: [],
    sizePage: 1,
    initPage: null,
    currentPage: 0,

  }

  onChangeTextInputs = e => {

    const self = this;
    self.setState({
      [e.target.name]: e.target.value
    })

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      name: e.target.value,
      typing: false,
      typingTimeout: setTimeout(goTime => {
        const firebase = this.props.firebase;
        const { sizePage } = this.state;

        getDataPrev(firebase, sizePage, 0, self.state.searchTxt).then(resultData => {
          const page = {
            startValue: resultData.startValue,
            finishValue: resultData.finishValue,

          }
          const pages = [];
          pages.push(page);

          this.setState({
            currentPage: 0,
            pages,
            listInmovables: resultData.listInmovables
          })
        })



        /*
        let objectQuery = this.props.firebase.db
          .collection('inmovables')
          .orderBy('address')
          .where('keywords', 'array-contains', self.state.searchTxt.toLowerCase());


        if (self.state.searchTxt.trim() === '') {
          objectQuery = this.props.firebase.db
            .collection('inmovables')
            .orderBy('address');
        }

        objectQuery.get().then(snapshot => {
          const arrayInmovables = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return {
              id,
              ...data
            }
          })
          this.setState({
            listInmovables: arrayInmovables
          })
        })
        */
      }, 500)
    })

  }

  async componentDidMount() {

    const { sizePage, searchTxt, initPage, pages } = this.state;
    const firebase = this.props.firebase;
    const returnData = await getData(firebase, sizePage, initPage, searchTxt);
    const page = {
      startValue: returnData.startValue,
      finishValue: returnData.finishValue,
    }

    pages.push(page);

    this.setState({
      listInmovables: returnData.listInmovables,
      pages,
      currentPage: 0
    })


    /*
    let objectQuery = this.props.firebase.db.collection('inmovables').orderBy('address');
    const snapshot = await objectQuery.get();
    const listInmovable = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;
      return {
        id,
        ...data
      }
    });

    this.setState({
      listInmovables: listInmovable
    })
    */
  }

  onNextPage = () => {
    const { currentPage, sizePage, searchTxt, pages } = this.state;
    const firebase = this.props.firebase;

    getData(firebase, sizePage, pages[currentPage].finishValue, searchTxt).then(returnData => {
      if (returnData.listInmovables.length > 0) {
        const page = {
          startValue: returnData.startValue,
          finishValue: returnData.finishValue,
        }

        pages.push(page);

        this.setState({
          pages,
          currentPage: currentPage + 1,
          listInmovables: returnData.listInmovables
        })
      }
    });

  }

  onPrevPage = () => {
    const { currentPage, sizePage, searchTxt, pages } = this.state;
    const firebase = this.props.firebase;
    if (currentPage > 0) {
      getDataPrev(firebase, sizePage, pages[currentPage - 1].startValue, searchTxt).then(resultData => {

        const page = {
          startValue: resultData.startValue,
          finishValue: resultData.finishValue
        }

        pages.push(page);

        this.setState({
          pages,
          currentPage: currentPage - 1,
          listInmovables: resultData.listInmovables
        })
      })
    }

  }

  onRemoveInmovable = id => {
    this.props.firebase.db
      .collection('inmovables')
      .doc(id)
      .delete()
      .then(result => {
        this.onRemoveIdFromList(id);
      })
      .catch(err => {
        console.error(err)
      })
  }

  onRemoveIdFromList = id => {
    const newListInmovable = this.state.listInmovables.filter(
      inmovable => inmovable.id !== id
    )

    this.setState({
      listInmovables: newListInmovable
    })
  }

  onEditInmovable = id => {
    this.props.history.push('/main/inmovable/' + id)
  }

  render() {
    return (
      <Container style={styles.cardGrid}>
        <Paper style={styles.paper}>
          <Grid item xs={12} sm={12}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={styles.link} href="/">
                <HomeIcon />
                Home
              </Link>
              <Typography color="textPrimary">My Inmovables</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} sm={6} style={styles.gridTextfield}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              name="searchTxt"
              variant="outlined"
              label="Search"
              onChange={this.onChangeTextInputs}
              value={this.state.searchTxt}
            ></TextField>
          </Grid>

          <Grid item xs={12} sm={12} style={styles.groupButton}>
            <Grid container spacing={1} direction="column" alignItems="flex-end">
              <ButtonGroup size="small" aria-label="Small outlined grouo">
                <Button onClick={this.onPrevPage}>
                  <ArrowLeft />
                </Button>
                <Button onClick={this.onNextPage} >
                  <ArrowRight />
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} style={styles.gridTextfield}>
            <Grid container spacing={4}>
              {this.state.listInmovables.map(card => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <Card style={styles.card}>
                    <CardMedia
                      style={styles.cardMedia}
                      image={
                        card.listImages
                          ? card.listImages[0]
                            ? card.listImages[0]
                            : tempImage
                          : tempImage
                      }
                      title="My Inmovable"
                    />
                    <CardContent
                      style={styles.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.city + ", " + card.country}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.onEditInmovable(card.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.onRemoveInmovable(card.id)}
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(ListInmovables);
