import React, { useState, useEffect } from 'react';
import { Container, Paper, Grid, Table, TableBody, TableRow, TableCell, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getUsersFromFirebaseFunctions } from '../../redux/actions/userAction';
import { sendEmailFirebaseFunction } from '../../redux/actions/emailAction';
import { useStateValue } from '../../sessions/store';
import { openWindowsMessage } from '../../sessions/actions/snackbarAction';

const style = {
    container: {
        paddingTop: '8px',
    },
    paper: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
    },

}

const ListUsers = props => {

    // eslint-disable-next-line
    const [{ session }, dispatch] = useStateValue();
    const [isLoading, setIsLoading] = useState(false);
    const listArray = useSelector(state => state.userRedux.users);
    const dispatchRedux = useDispatch();

    useEffect(() => {
        /*
        async function getData() {
            await getUsersFromFirebaseFunctions(dispatch);
        }

        if (!isLoading) {
            setIsLoading(true);
            getData();
        }
        */

        if (!isLoading) {
            getUsersFromFirebaseFunctions(dispatchRedux).then(sucess => {
                setIsLoading(true)
            })
        }
    })

    const sendingEmail = (email) => {
        const object = {
            email: email,
            title: "Mensaje from client",
            message: "message | body"
        }
        sendEmailFirebaseFunction(object).then(response => {
            console.info(response);

            openWindowsMessage(dispatch, {
                open: true,
                message: "Email sended"
            })
        });
    }
    return (
        <Container style={style.container}>
            <Paper style={style.paper}>
                <Grid container justify="center">
                    <Grid item xs={12} sm={12}>
                        <Table>
                            <TableBody>
                                {
                                    listArray
                                        ?
                                        listArray.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="left">{row.email || row.phoneNumber}</TableCell>
                                                <TableCell align="left">{row.firstname || row.lastName}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" size="small">Roles</Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" size="small" onClick={() => sendingEmail(row.email)}>Send Message</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        null
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}


export default ListUsers;