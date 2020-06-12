import React from 'react';
import { List, Link, ListItemText, ListItem, Avatar } from '@material-ui/core';

export const RightMenu = ({ classes, user, textUser, photoUser, signOut }) => (
    <div className={classes.list}>
        <List>
            <ListItem button component={Link} to="/auth/signup">
                <Avatar
                    
                    src={photoUser}
                />
                <ListItemText classes={{ primary: classes.listItemText }} primary={textUser} />
            </ListItem>
            <ListItem button onClick={signOut}>
                <ListItemText classes={{ primary: classes.listItemText }} primary="SIGN OUT" />
            </ListItem>
        </List>

    </div>
)