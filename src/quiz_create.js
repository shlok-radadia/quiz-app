function pfp_square() {
    const profile = document.getElementById('profile');
    const height = profile.offsetHeight;
    profile.style.width = `${height}px`;
}
window.addEventListener('load', pfp_square);
window.addEventListener('resize', pfp_square);
document.getElementById("profile").addEventListener('click', () => {
    window.open("../profile/index.html", "_self");
});
document.getElementById("menu_close").addEventListener('click', () => {
    document.getElementById("sliding_menu").classList.add("sliding_menu_close")
    document.getElementById("sliding_menu").classList.remove("sliding_menu_open")
})
document.getElementById("menu_open").addEventListener('click', () => {
    document.getElementById("sliding_menu").classList.add("sliding_menu_open")
    document.getElementById("sliding_menu").classList.remove("sliding_menu_close")
})
document.getElementById("go_home").addEventListener('click', () => {
    window.open("../home/index.html", "_self");
})
document.getElementById("go_profile").addEventListener('click', () => {
    window.open("../profile/index.html", "_self");
})
document.getElementById("go_create_quiz").addEventListener('click', () => {
    window.open("../quiz_create/index.html", "_self");
})


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

let emailid = ""
let user=[];

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
    if(!user){
        window.open("../../main/index.html", "_self");
    }
    else{
        emailid = user.email
        console.log(emailid)
        get_user_data()
    }
})

function get_user_data(){
    const user_col = collection(db, 'Users')
    const user_data = query(user_col, where("email", "==", emailid))
    const unsubuserCol = onSnapshot(user_data, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            user.push({ ...doc.data(), id: doc.id })
        })
        console.log(user)
        document.getElementById('profile').getElementsByTagName('img')[0].src = user[0].pfp
    })
}

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBrUeovmR_O0pa4S57FFxG2zXVblTL69MU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function getDynamicPrompt(topic) {
    const randomId = Math.random().toString(36).substring(7); // Create a unique identifier
    return `Create a random question on topic: ${topic} with context "${randomId}" and also provide 4 options. It should be of json format like {question: <question>, opt1: <option1>, opt2: <option2>, opt3: <option3>, opt4: <option4>, correct_opt: <correct option number>}`;
}

// async function generate(topic){
//     const prompt = getDynamicPrompt(topic);
//     const result = await model.generateContent(prompt);
//     let rawString = await result.response.text();
//     rawString = rawString.replace(/```/g, '').trim();
//     rawString = rawString.replace(/^json\s*/, '').trim();
//     const jsonObject = JSON.parse(rawString);
//     return jsonObject
// }

let questions = []
let question_number = 0
let q_str = ""
document.getElementById('add').addEventListener('click', () => {
    question_number+=1
    const q = document.getElementById("question").value
    const o1 = document.getElementById("opt1").value
    const o2 = document.getElementById("opt2").value
    const o3 = document.getElementById("opt3").value
    const o4 = document.getElementById("opt4").value
    const co = document.getElementById("correct_option").value
    questions.push({
        "question": q,
        "o1": o1,
        "o2": o2,
        "o3": o3,
        "o4": o4,
        "co": co,
        "question_number": question_number
    })
    document.getElementById("question").value = ""
    document.getElementById("opt1").value = ""
    document.getElementById("opt2").value = ""
    document.getElementById("opt3").value = ""
    document.getElementById("opt4").value = ""
    document.getElementById("correct_option").value = ""
    console.log(questions)
    q_str += "Question " + question_number + ":<br>" + q + "<br><br>Option 1: " + o1 + "<br>Option 2: " + o2 + "<br>Option 3: " + o3 + "<br>Option 4: " + o4 + "<br><br>Correct Option: " + co + "<br><br><br><br>"
    document.getElementById("preview").innerHTML = q_str
})

document.getElementById('gemini').addEventListener('click', async () => {
    const prompt = getDynamicPrompt(document.getElementById("section").value);
    const result = await model.generateContent(prompt);
    let rawString = await result.response.text();
    rawString = rawString.replace(/```/g, '').trim();
    rawString = rawString.replace(/^json\s*/, '').trim();
    const jsonObject = JSON.parse(rawString);
    const a = jsonObject
    question_number+=1
    const q = a.question
    const o1 = a.opt1
    const o2 = a.opt2
    const o3 = a.opt3
    const o4 = a.opt4
    const co = a.correct_opt
    questions.push({
        "question": q,
        "o1": o1,
        "o2": o2,
        "o3": o3,
        "o4": o4,
        "co": co,
        "question_number": question_number
    })
    console.log(questions)
    q_str += "Question " + question_number + ":<br>" + q + "<br><br>Option 1: " + o1 + "<br>Option 2: " + o2 + "<br>Option 3: " + o3 + "<br>Option 4: " + o4 + "<br><br>Correct Option: " + co + "<br><br><br><br>"
    document.getElementById("preview").innerHTML = q_str
})