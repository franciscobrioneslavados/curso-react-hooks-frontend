import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom'

export const LeftMenu = ({ classes }) => (
    <div className={classes.list}>
        <List>
            <ListItem component={Link} button to="/main/profile">
                <i className='material-icons'>account_box</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="perfil" />
            </ListItem>
            <Divider />
            <ListItem component={Link} button to="/main/newinmovable">
                <i className="material-icons">add_box</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="new Inmueble" />
            </ListItem>
            <ListItem component={Link} button to="">
                <i className="material-icons">business</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="Inmuebles" />
            </ListItem>
            <ListItem component={Link} button to="/main/listusers">
                <i className="material-icons">people</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="List Users" />
            </ListItem>
        </List>
    </div>
)