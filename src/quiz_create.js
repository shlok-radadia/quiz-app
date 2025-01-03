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
let username = "";

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
        username = user[0].username
    })
}

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBrUeovmR_O0pa4S57FFxG2zXVblTL69MU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function getDynamicPrompt(topic) {
    return `Generate a unique multiple-choice question on the topic "${topic}". 
    Ensure that:
    - Each question addresses a distinct subtopic.
    - No two questions can resemble each other in structure or content.
    - Provide varied scenarios or contexts for the same topic.
    Format the result as a JSON:
    {
        "question": "<question>",
        "opt1": "<option1>",
        "opt2": "<option2>",
        "opt3": "<option3>",
        "opt4": "<option4>",
        "correct_opt": "<correct option number>"
    }.`;
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
    const q = document.getElementById("question").value
    const o1 = document.getElementById("opt1").value
    const o2 = document.getElementById("opt2").value
    const o3 = document.getElementById("opt3").value
    const o4 = document.getElementById("opt4").value
    const co = parseInt(document.getElementById("correct_option").value)
    const positive = parseInt(document.getElementById("positive").value)
    const negative = parseInt(document.getElementById("negative").value)

    question_number+=1

    if(!q || !o1 || !o2 || !o3 || !o4 || !co || !positive || !negative){
        alert("Please enter all the necessary details to add a question.")
    }

    else{
        questions.push({
            "question": q,
            "o1": o1,
            "o2": o2,
            "o3": o3,
            "o4": o4,
            "co": co,
            "question_number": question_number,
            "positive": positive,
            "negative": negative
        })
        document.getElementById("question").value = ""
        document.getElementById("opt1").value = ""
        document.getElementById("opt2").value = ""
        document.getElementById("opt3").value = ""
        document.getElementById("opt4").value = ""
        document.getElementById("correct_option").value = ""
        document.getElementById("positive").value = ""
        document.getElementById("negative").value = ""
        console.log(questions)
        q_str += "Question " + question_number + ":<br>" + q 
        q_str += "<br><br>Option 1: " + o1 + "<br>Option 2: " + o2 + "<br>Option 3: " + o3 + "<br>Option 4: " + o4 
        q_str += "<br><br>Correct Option: " + co + "<br>Positive Marks: " + positive + "<br>Negative Marks: " + negative 
        q_str += "<br><br><button onclick='delete_question.call(this)' class='delete_question' name='" + question_number + "'>Delete</button>"
        q_str += "<br><br><br><br>"
        document.getElementById("preview").innerHTML = q_str
    }
})

const generatedQuestions = new Set();

function isDuplicateQuestion(newQuestion) {
    for (const question of generatedQuestions) {
        if (question.includes(newQuestion.slice(0, 30))) return true; // Simple similarity check
    }
    return false;
}

async function fetchUniqueQuestion(prompt, retries = 5) {
    for (let i = 0; i < retries; i++) {
        const result = await model.generateContent(prompt);
        let rawString = await result.response.text();
        rawString = rawString.replace(/```/g, '').trim().replace(/^json\s*/, '').trim();

        try {
            const jsonObject = JSON.parse(rawString);
            const { question } = jsonObject;

            if (question && !isDuplicateQuestion(question)) {
                generatedQuestions.add(question);
                return jsonObject;
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
    throw new Error("Failed to generate a unique question.");
}

document.getElementById('gemini').addEventListener('click', async () => {
    const positive = parseInt(document.getElementById("positive").value);
    const negative = parseInt(document.getElementById("negative").value);
    const section = document.getElementById("section").value;

    if (!positive || !negative) {
        alert("Please enter positive and negative marks for the question to be generated.");
        return;
    }

    if (!section) {
        alert("Please choose a section.");
        return;
    }

    const prompt = getDynamicPrompt(section);

    try {
        const questionObject = await fetchUniqueQuestion(prompt);
        question_number += 1;

        questions.push({
            "question": questionObject.question,
            "o1": questionObject.opt1,
            "o2": questionObject.opt2,
            "o3": questionObject.opt3,
            "o4": questionObject.opt4,
            "co": parseInt(questionObject.correct_opt),
            "question_number": question_number,
            "positive": positive,
            "negative": negative
        });

        q_str += `
            Question ${question_number}:<br>${questionObject.question}<br><br>
            Option 1: ${questionObject.opt1}<br>
            Option 2: ${questionObject.opt2}<br>
            Option 3: ${questionObject.opt3}<br>
            Option 4: ${questionObject.opt4}<br><br>
            Correct Option: ${questionObject.correct_opt}<br>
            Positive Marks: ${positive}<br>
            Negative Marks: ${negative}<br><br>
            <button onclick='delete_question.call(this)' class='delete_question' name='${question_number}'>Delete</button>
            <br><br><br><br>
        `;

        document.getElementById("preview").innerHTML = q_str;

        // Clear input fields
        document.getElementById("question").value = "";
        document.getElementById("opt1").value = "";
        document.getElementById("opt2").value = "";
        document.getElementById("opt3").value = "";
        document.getElementById("opt4").value = "";
        document.getElementById("correct_option").value = "";
        document.getElementById("positive").value = "";
        document.getElementById("negative").value = "";
        console.log(questions)

    } catch (error) {
        console.error("Error generating question:", error);
        alert("Could not generate a unique question. Please try again.");
    }
});


function delete_question(){
    const questionNumberToDelete = parseInt(this.name, 10);

    // Filter out the question to delete
    questions = questions.filter(item => item.question_number !== questionNumberToDelete);

    // Reduce the question number of the remaining questions with higher numbers
    questions = questions.map(item => {
        if (item.question_number > questionNumberToDelete) {
            return {
                ...item, // Spread operator to copy all other properties
                question_number: item.question_number - 1 // Decrement question_number
            };
        }
        return item;
    });

    // console.log(`Deleted question number: ${questionNumberToDelete}`);
    console.log("Updated questions:", questions);
    question_number -= 1
    q_str = ""
    for(const a of questions){
        const q = a.question
        const o1 = a.o1
        const o2 = a.o2
        const o3 = a.o3
        const o4 = a.o4
        const co = a.co
        const qn = a.question_number
        const p = a.positive
        const n = a.negative
        q_str += "Question " + qn + ":<br>" + q 
        q_str += "<br><br>Option 1: " + o1 + "<br>Option 2: " + o2 + "<br>Option 3: " + o3 + "<br>Option 4: " + o4 
        q_str += "<br><br>Correct Option: " + co + "<br>Positive Marks: " + p + "<br>Negative Marks: " + n 
        q_str += "<br><br><button onclick='delete_question.call(this)' class='delete_question' name='" + qn + "'>Delete</button>"
        q_str += "<br><br><br><br>"
    }
    document.getElementById("preview").innerHTML = q_str
}


document.getElementById('duration').addEventListener('input', function(e) {
    if (this.value < 0) {
        alert("Please enter a value greater than 0.")
        this.value = "";
    }
});


document.getElementById("create").addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.getElementById("title").value
    const description = document.getElementById("desc").value
    const section = document.getElementById("section").value
    const duration = parseInt(document.getElementById("duration").value)
    
    if(!title || !description || !section || !duration){
        alert("Please fill all details.")
    }
    else if(!Array.isArray(questions) || questions.length === 0){
        alert("Please add atleast 1 question.")
    }
    else{
        const quiz_col = collection(db, 'quizzes')

        let analytics_update = doc(db, 'analytics', analytics[0].id)

        total_quiz += 1

        updateDoc(analytics_update, {
            total_quizzes: total_quiz
        })
        .then(() => {
            console.log("analytics updated.")
        })
        // realtime collection data
        addDoc(quiz_col, {
            quiz_id: total_quiz,
            title: document.getElementById("title").value,
            description: document.getElementById("desc").value,
            created_by: username,
            section: document.getElementById("section").value,
            duration: parseInt(document.getElementById("duration").value),
            questions: questions,
            upvotes: 0,
            upvotes_by: [],
            attempted_by: [],
            created_at: serverTimestamp()
          })
          .then(() => {
            window.open("../home/index.html", "_self");
          })
    }
})

const analytics_col = collection(db, 'analytics')
let analytics = [];
let total_quiz = 0;
onSnapshot(analytics_col, (snapshot) => {
    snapshot.docs.forEach(doc => {
        analytics.push({ ...doc.data(), id: doc.id })
    })
    console.log(analytics)
    total_quiz = analytics[0].total_quizzes;
    console.log(total_quiz)
})









window.delete_question = delete_question;