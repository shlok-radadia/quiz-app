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

const emailDomains = [
    ".com",  // Commercial
    ".org",  // Organization
    ".net",  // Network
    ".edu",  // Educational institutions
    ".gov",  // Government
    ".mil",  // Military
    ".int",  // International organizations
    ".info", // Information services
    ".biz",  // Business
    ".name", // Personal names
    ".pro",  // Professionals
    ".aero", // Aviation industry
    ".coop", // Cooperatives
    ".museum", // Museums
    ".io",  // Tech startups, developers
    ".tech", // Technology services
    ".me",  // Personal branding
    ".online", // General online services
    ".xyz", // General use
    ".store", // E-commerce
    ".app",  // Mobile and web applications
    ".ai",  // Artificial intelligence, startups
    ".co",  // Business, tech, global use
    ".uk",  // United Kingdom
    ".us",  // United States
    ".in",  // India
    ".de",  // Germany
    ".cn",  // China
    ".au",  // Australia
    ".ca",  // Canada
    ".jp",  // Japan
    ".fr",  // France
    ".ru",  // Russia
    ".br",  // Brazil
    ".za"   // South Africa
];

const isValidDomain = (email) => {
    const emailDomain = email.split("@")[1]?.split(".").slice(-2).join(".");
    return emailDomains.includes("." + emailDomain.split(".").slice(-1)[0]);
};

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
    else if(isValidDomain(email) == false){
        alert("Please enter a valid email address.")
    }
    else if(password != re_password){
        alert("Password not matching.")
    }
    else if(password.length <= 6){
        alert("Password should atleast have 7 characters.")
    }
    else{

        addDoc(user_col, {
            username: username,
            email: email,
            pfp: "../../../images/default_pfp.png",
            role: role,
            quiz_history: [],
            performance_analytics: {
                total_quiz: 0,
                avg_accuracy: 0
            },
            quiz_history: []
        })
        .then(() => {
            createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                console.log('user created:', cred.user)
                window.open("../app/home/index.html", "_self");
            })
            .catch(err => {
                console.log(err.message)
            })
            signup.reset()
        })
    }
})

window.home = home;