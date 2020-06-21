import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAcUnNMvGGIR1hH9sPaDy_0dWSgh4un9d4",
  authDomain: "react-fire-hooks.firebaseapp.com",
  databaseURL: "https://react-fire-hooks.firebaseio.com",
  projectId: "react-fire-hooks",
  storageBucket: "react-fire-hooks.appspot.com",
  messagingSenderId: "827383811073",
  appId: "1:827383811073:web:4c4b30fe6a973c291e4400"
}

const app = firebase.initializeApp(firebaseConfig)

export default app
