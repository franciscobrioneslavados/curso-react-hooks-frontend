import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/** Import Themes */
import MuithemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from "./theme/theme";

/** Imports Components */
import Navbar from "./components/layout/Navbar";
import ListInmovables from "./components/views/ListInmovables";

class App extends Component {
  render() {
    return (
      <Router>
        <MuithemeProvider theme={theme}>
          <Navbar />
          <Grid container>
            <Switch>
              <Route path="/" exact component={ListInmovables}></Route>
            </Switch>
          </Grid>
        </MuithemeProvider>
      </Router>
    );
  }
}

export default App;
