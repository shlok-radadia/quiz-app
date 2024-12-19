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

function home(){
    window.open("../main/index.html", "_self");
}

const signup = document.querySelector('#signup_form')
signup.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signup.email.value
    const username = signup.username.value
    const password = signup.password.value
    const re_password = signup.re_password.value
    const role = signup.role.value

    if(!email || !username || !password || !re_password || !role){
        alert("Please enter the details correctly.")
    }
    else if(password != re_password){
        alert("Password not matching.")
    }
    else if(password.length <= 6){
        alert("Password should atleast have 7 characters.")
    }
    else{
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                console.log('user created:', cred.user)
            })
            .catch(err => {
                console.log(err.message)
            })

        addDoc(user_col, {
            username: username,
            email: email,
            pfp: "../../images/default_pfp.png",
            role: role,
            quiz_history: [],
            performance_analytics: {
                total_quiz: 0,
                avg_accuracy: 0
            },
            quiz_history: []
        })
        .then(() => {
            signup.reset()
            window.open("../app/home/index.html", "_self");
        })
    }
})

window.home = home;