import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCRvve1DM1J5nwN2NBah9Vvzt9MFKCwOvw",
    authDomain: "react-curse-7bf6a.firebaseapp.com",
    databaseURL: "https://react-curse-7bf6a.firebaseio.com",
    projectId: "react-curse-7bf6a",
    storageBucket: "react-curse-7bf6a.appspot.com",
    messagingSenderId: "624723386327",
    appId: "1:624723386327:web:8f31b2785f132c6aa4b592",
    measurementId: "G-CWP61Z5TP8"
  };

export default class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.db = app.firestore();
        this.auth = app.auth();

    }

    initState(){
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }
}