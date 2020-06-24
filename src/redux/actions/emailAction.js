import axios from 'axios';

export const sendEmailFirebaseFunction = (dispatch, email) => {
    return new Promise(async (resolve, reject) => {
        const rest = await axios.post('https://us-central1-react-curse-7bf6a.cloudfunctions.net/emailsSend', email)
        resolve(rest);
    })
}