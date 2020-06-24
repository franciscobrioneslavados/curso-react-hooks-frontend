import axios from 'axios';

export const getUsersFromFirebaseFunctions = (dispatch) => {
    return new Promise(async (resolve, reject) => {
        const listUsers = await axios.get('https://us-central1-react-curse-7bf6a.cloudfunctions.net/usersList/list');

        // console.info(listUsers);
        dispatch({
            type: 'LIST_USERS',
            payload: listUsers.data.listUsers
        })

        resolve();
    })
}

export const updateRoles = (dispatch, user) => {
    return new Promise(async (resolve, reject) => {
        const rest = await axios.post('https://us-central1-react-curse-7bf6a.cloudfunctions.net/usersMantainer', user);

        dispatch({
            type: 'UPDATE_ROLES',
            payload: rest.data
        })

        resolve();
    })
}