import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAjKMEu0O1dge9Na-7ofekph3oXsFONNpQ",
    authDomain: "quinteresting-dd9a4.firebaseapp.com",
    projectId: "quinteresting-dd9a4",
    storageBucket: "quinteresting-dd9a4.firebasestorage.app",
    messagingSenderId: "686126889255",
    appId: "1:686126889255:web:67092510768cb9631f9102"
};

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

const user_col = collection(db, 'Users')

const unsubCol = onSnapshot(user_col, (snapshot) => {
    let users = []
    snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id })
    })
    console.log(users)
})

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
    if(user){
        window.open("../main/index.html", "_self");
    }
})

const login = document.querySelector('#login_form')
login.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = login.email.value
  const password = login.password.value

  if(!email || !password){
    alert("Please fill the details correctly.")
  }
  else{
    signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)
      login.reset()
      window.open("../app/home/index.html", "_self");
    })
    .catch(err => {
      alert("Incorrect credentials.")
    })
  }
})


function home(){
    window.open("../main/index.html", "_self");
}

window.home = home;