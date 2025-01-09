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
    getDoc, updateDoc,
    arrayUnion,
    setDoc
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
        load_quiz();
    })
}


let lastChecked = {};

document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', function () {
        if (lastChecked[this.name] === this) {
            this.checked = false;
            lastChecked[this.name] = null;
        } else {
            lastChecked[this.name] = this;
        }
    });
});



function load_quiz(){
    const colRef = collection(db, 'quizzes')
    const q = query(colRef, where("quiz_id", "==", parseInt(localStorage.getItem("quiz_id"))))
    let questions = []
    let quiz_data_arr = []
    let quiz_data = {}
    onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach(doc => {
            quiz_data_arr.push({ ...doc.data(), id: doc.id })
        })
        quiz_data = quiz_data_arr[0]
        questions = quiz_data.questions
        let str = ""
        for(const i of questions){
            console.log(i)
            str += `
            <div class="questions" name="${i.co}">
                <span class="question_number">Question ${i.question_number}</span>
                <span class="marking_scheme"><span class="positive">+${i.positive}</span>&nbsp;<span class="negative">-${i.negative}</span></span>
                
                <span class="question">${i.question}</span>
                <div class="options">
                    <label>
                        <input type="radio" class="option" name="${i.question_number}" value="1">
                        ${i.o1}
                    </label><br>
                    <label>
                        <input type="radio" class="option" name="${i.question_number}" value="2">
                        ${i.o2}
                    </label><br>
                    <label>
                        <input type="radio" class="option" name="${i.question_number}" value="3">
                        ${i.o3}
                    </label><br>
                    <label>
                        <input type="radio" class="option" name="${i.question_number}" value="4">
                        ${i.o4}
                    </label><br>
                </div>
            </div>

            <br><br><br>
            `
        }
        document.getElementById("complete_quiz").innerHTML = str;
        document.getElementById("title").innerText = quiz_data.title;
        let duration = quiz_data.duration;
        let seconds = 0;
        const timerInterval = setInterval(function() {
            const displayMinutes = duration < 10 ? '0' + duration : duration;
            const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
        
            document.getElementById('timer').innerHTML = `${displayMinutes}:${displaySeconds}`;
        
            if (seconds === 0 && duration > 0) {
                duration--;  
                seconds = 59;
            } else if (seconds > 0) {
                seconds--;
            }
        
            if (duration === 0 && seconds === 0) {
                clearInterval(timerInterval);
                alert('Time is up!');
                document.getElementById("submit").click();
            }
        }, 1000);
    })
}


async function processQuizSubmission(arr, quiz_data, quizId, username) {
    const questions_data = quiz_data.questions;
    const length = questions_data.length;

    let positive = 0;
    let negative = 0;
    let number_of_correct_questions = 0;
    let number_of_incorrect_questions = 0;
    let number_of_questions_not_attempted = 0;

    arr.forEach((answer, i) => {
        if (answer.option_marked === "none") {
            number_of_questions_not_attempted += 1;
        } else {
            const correctOption = questions_data[i].co;
            if (answer.option_marked === correctOption) {
                positive += questions_data[i].positive;
                number_of_correct_questions += 1;
            } else {
                negative += questions_data[i].negative;
                number_of_incorrect_questions += 1;
            }
        }
    });

    console.log("Positive: " + positive);
    console.log("Negative: " + negative);
    console.log("Correct: " + number_of_correct_questions);
    console.log("Incorrect: " + number_of_incorrect_questions);
    console.log("Not Attempted: " + number_of_questions_not_attempted);

    const score = positive - negative;
    console.log("Score: ", score);

    const total_questions_attempted = number_of_correct_questions + number_of_incorrect_questions;
    const accuracy = total_questions_attempted > 0
        ? (number_of_correct_questions / total_questions_attempted) * 100
        : 0;

    console.log("Accuracy: " + accuracy.toFixed(2) + "%");

    try {
        await updateUserAndLeaderboard(
            quizId,
            username,
            score,
            accuracy,
            positive,
            negative,
            number_of_correct_questions,
            number_of_incorrect_questions,
            number_of_questions_not_attempted
        );
    } catch (error) {
        console.error("Error updating leaderboard and user performance:", error);
    }

    await updateAttemptedBy();
}


document.getElementById("quiz").addEventListener("submit", async (e) => {
    e.preventDefault();

    const arr = [];
    const questions = document.querySelectorAll('.questions');

    questions.forEach((question) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        arr.push({
            option_marked: selectedOption ? parseInt(selectedOption.value) : "none",
            question: parseInt(question.querySelector('.question_number').textContent.slice(9)),
        });
    });

    console.log(arr);

    const colRef = collection(db, "quizzes");
    const q = query(colRef, where("quiz_id", "==", parseInt(localStorage.getItem("quiz_id"))));

    try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const quizData = snapshot.docs[0].data();
            const quizId = quizData.quiz_id;
            const username = user[0]?.username;

            await processQuizSubmission(arr, quizData, quizId, username);

            localStorage.setItem("quiz_id_analyse", localStorage.getItem("quiz_id"))
            window.location.href = "../analyse/index.html";
            
        } else {
            console.error("Quiz not found.");
        }
    } catch (error) {
        console.error("Error processing quiz submission:", error);
    }
});


async function updateAttemptedBy() {
    const colRef = collection(db, 'quizzes');
    const quizId = parseInt(localStorage.getItem("quiz_id"));

    try {
        const quizQuery = query(colRef, where("quiz_id", "==", quizId));
        const quizSnapshot = await getDocs(quizQuery);

        if (!quizSnapshot.empty) {
            const quizDoc = quizSnapshot.docs[0];
            const quizDocId = quizDoc.id;

            console.log("Quiz Document ID:", quizDocId);

            const quizDocRef = doc(db, 'quizzes', quizDocId);

            await updateDoc(quizDocRef, {
                attempted_by: arrayUnion(user[0].username)
            });

            console.log('Updated "attempted_by" successfully!');
        } else {
            console.error(`No quiz found with quiz_id: ${quizId}`);
        }
    } catch (error) {
        console.error('Error updating "attempted_by":', error);
    }
}


let leaderboardUpdating = false;

async function updateUserAndLeaderboard(quizId, username, score, accuracy, positive, negative, number_of_correct_questions, number_of_incorrect_questions, number_of_questions_not_attempted) {
    try {
        await updateUserPerformanceData(score, accuracy, positive, negative, number_of_correct_questions, number_of_incorrect_questions, number_of_questions_not_attempted);

        if (!leaderboardUpdating) {
            leaderboardUpdating = true;
            await updateLeaderboard(quizId, username, score, accuracy);
        }
    } finally {
        leaderboardUpdating = false;
    }
}

async function updateUserPerformanceData(score, accuracy, positive, negative, number_of_correct_questions, number_of_incorrect_questions, number_of_questions_not_attempted) {
    const currentQuizId = parseInt(localStorage.getItem("quiz_id"));
    
    const newQuizHistoryEntry = {
        quiz_id: currentQuizId,
        score: score,
        accuracy: accuracy,
        positive: positive,
        negative: negative,
        number_of_correct_questions: number_of_correct_questions,
        number_of_incorrect_questions: number_of_incorrect_questions,
        number_of_questions_not_attempted: number_of_questions_not_attempted,
    };

    const newQuizHistory = user[0].quiz_history || [];

    const existingQuizIndex = newQuizHistory.findIndex(entry => entry.quiz_id === currentQuizId);

    if (existingQuizIndex === -1) {
        newQuizHistory.push(newQuizHistoryEntry);

        const totalQuizzes = (user[0].performance_analytics?.total_quiz || 0) + 1;
        const currentAvgAccuracy = user[0].performance_analytics?.avg_accuracy || 0;
        const newAvgAccuracy = ((currentAvgAccuracy * (totalQuizzes - 1)) + accuracy) / totalQuizzes;

        const userRef = doc(db, "Users", user[0].id);

        try {
            await updateDoc(userRef, {
                "performance_analytics.total_quiz": totalQuizzes,
                "performance_analytics.avg_accuracy": parseFloat(newAvgAccuracy.toFixed(2)),
                "quiz_history": newQuizHistory,
            });
            console.log("User performance data updated successfully!");
        } catch (error) {
            console.error("Error updating user performance data:", error);
        }
    } else {
        console.log("Quiz already exists in history, skipping updates.");
    }
}

async function updateLeaderboard(quizId, username, score, accuracy) {
    if (!quizId || !username || score === undefined || accuracy === undefined) {
        console.error("Invalid data: quizId, username, score, or accuracy is undefined");
        return;
    }

    const leaderboardRef = collection(db, "leaderboards");

    try {
        const leaderboardQuery = query(leaderboardRef, where("quiz_id", "==", quizId));
        const querySnapshot = await getDocs(leaderboardQuery);

        if (!querySnapshot.empty) {
            const leaderboardDoc = querySnapshot.docs[0];
            const leaderboardDocRef = doc(db, "leaderboards", leaderboardDoc.id);

            await updateDoc(leaderboardDocRef, {
                rankings: arrayUnion({ username, score, accuracy })
            });
            console.log("Leaderboard updated successfully!");
        } else {
            const newLeaderboardData = {
                quiz_id: quizId,
                rankings: [{ username, score, accuracy }]
            };

            const docRef = await addDoc(leaderboardRef, newLeaderboardData);
            console.log("Leaderboard created and updated with random ID:", docRef.id);
        }
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
}