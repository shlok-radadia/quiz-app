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
    getFirestore, collection, onSnapshot, getDocs,
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
    onSnapshot(user_data, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            user.push({ ...doc.data(), id: doc.id })
        })
        if (user[0].role != "admin") {
            document.getElementById("go_create_quiz").remove();
        }
        console.log(user)
        document.getElementById('profile').getElementsByTagName('img')[0].src = user[0].pfp
        loadQuizzes("created_at");
    })
}

function loadQuizzes(e) {
    const quiz_col = collection(db, 'quizzes');
    const q = query(quiz_col, orderBy(e, 'desc'));

    // onSnapshot(q, (snapshot) => {
    //     let quizzes = [];
    //     snapshot.docs.forEach((doc) => {
    //         quizzes.push({ ...doc.data(), id: doc.id });
    //     });
    //     renderQuizzes(quizzes);
    // });

    getDocs(q)
    .then(snapshot => {
        let quizzes = [];
        snapshot.docs.forEach((doc) => {
            quizzes.push({ ...doc.data(), id: doc.id });
        });
        renderQuizzes(quizzes);
    })
    .catch(err => {
        console.log(err.message)
    })
}

function renderQuizzes(quizzes) {
    let quiz_str = "";
    for (const i of quizzes) {
        if (i.upvotes_by.includes(user[0].username)) {
            if(i.attempted_by.includes(user[0].username)){
                quiz_str += `
                    <div id="${i.quiz_id}" class="quiz">
                        <span class="title">${i.title}</span>
                        <span class="description">${i.description}<br>(Duration: ${i.duration} minutes)</span>
                        <span class="section">${i.section}</span>
                        <span class="created_by">Created By: ${i.created_by}</span>
                        <button class="start" style="display: none;" onclick="start.call(this)">Start</button>
                        <button class="analyse" onclick="analyse.call(this)">Analyse</button>
                        <span class="upvotes">Upvotes: ${i.upvotes}</span>
                        <button class="upvote" disabled style="display:none;" name="${i.id} ${i.upvotes} ${i.upvotes_by.join(" ")}" onclick="upvote.call(this)">Upvote&nbsp;<i class="fa-solid fa-circle-arrow-up"></i></button>
                    </div><br><br>
                `;
            }
            else{
                quiz_str += `
                    <div id="${i.quiz_id}" class="quiz">
                        <span class="title">${i.title}</span>
                        <span class="description">${i.description}<br>(Duration: ${i.duration} minutes)</span>
                        <span class="section">${i.section}</span>
                        <span class="created_by">Created By: ${i.created_by}</span>
                        <button class="start" onclick="start.call(this)">Start</button>
                        <button class="analyse" style="display: none;" onclick="analyse.call(this)">Analyse</button>
                        <span class="upvotes">Upvotes: ${i.upvotes}</span>
                        <button class="upvote" disabled style="display:none;" name="${i.id} ${i.upvotes} ${i.upvotes_by.join(" ")}" onclick="upvote.call(this)">Upvote&nbsp;<i class="fa-solid fa-circle-arrow-up"></i></button>
                    </div><br><br>
                `;
            }
        } else {
            if(i.attempted_by.includes(user[0].username)){
                quiz_str += `
                    <div id="${i.quiz_id}" class="quiz">
                        <span class="title">${i.title}</span>
                        <span class="description">${i.description}<br>(Duration: ${i.duration} minutes)</span>
                        <span class="section">${i.section}</span>
                        <span class="created_by">Created By: ${i.created_by}</span>
                        <button class="start" style="display: none;" onclick="start.call(this)">Start</button>
                        <button class="analyse" onclick="analyse.call(this)">Analyse</button>
                        <span class="upvotes">Upvotes: ${i.upvotes}</span>
                        <button class="upvote" name="${i.id} ${i.upvotes} ${i.upvotes_by.join(" ")}" onclick="upvote.call(this)">Upvote&nbsp;<i class="fa-solid fa-circle-arrow-up"></i></button>
                    </div><br><br>
                `;
            }
            else{
                quiz_str += `
                    <div id="${i.quiz_id}" class="quiz">
                        <span class="title">${i.title}</span>
                        <span class="description">${i.description}<br>(Duration: ${i.duration} minutes)</span>
                        <span class="section">${i.section}</span>
                        <span class="created_by">Created By: ${i.created_by}</span>
                        <button class="start" onclick="start.call(this)">Start</button>
                        <button class="analyse" style="display: none;" onclick="analyse.call(this)">Analyse</button>
                        <span class="upvotes">Upvotes: ${i.upvotes}</span>
                        <button class="upvote" name='${i.id} ${i.upvotes} ${i.upvotes_by.join(" ")}' onclick="upvote.call(this)">Upvote&nbsp;<i class="fa-solid fa-circle-arrow-up"></i></button>
                    </div><br><br>
                `;
            }
        }
    }
    document.getElementById("quiz_list").innerHTML = quiz_str;
}

function upvote(){
    console.log(this.name)
    const name = this.name;
    const data = name.split(" ");
    console.log(data)
    const id = data[0]
    const upvotes = parseInt(data[1])
    console.log(upvotes)
    const upvotes_arr = data.slice(2).filter(value => value !== "");
    console.log(upvotes_arr)
    upvotes_arr.push(user[0].username)
    console.log(upvotes_arr)

    let quizzes_update = doc(db, 'quizzes', id)

    updateDoc(quizzes_update, {
        upvotes: upvotes+1,
        upvotes_by: upvotes_arr
    })
    .then(() => {
        const parentDiv = this.parentElement;
        const upvotesSpan = parentDiv.querySelector(".upvotes");
        upvotesSpan.textContent = upvotes+1;
        this.name = `${id} ${upvotes+1} ${upvotes_arr}`
        loadQuizzes(document.getElementById("filter").value)
    })
    
}

function start(){
    const parentDiv = this.parentElement;
    const quiz_id = parseInt(parentDiv.id);
    console.log(quiz_id);
    localStorage.setItem("quiz_id", quiz_id);
    window.open("../quiz/index.html", "_self");
}

function analyse(){
    const parentDiv = this.parentElement;
    const quiz_id = parseInt(parentDiv.id);
    console.log(quiz_id);
    localStorage.setItem("quiz_id_analyse", quiz_id);
    window.open("../analyse/index.html", "_self");
}


document.getElementById("filter").addEventListener('change', () => {
    let filter = document.getElementById("filter").value
    loadQuizzes(filter)
})


window.upvote = upvote;
window.start = start;
window.analyse = analyse;