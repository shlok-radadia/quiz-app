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
    onSnapshot(user_data, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            user.push({ ...doc.data(), id: doc.id })
        })
        if (user[0].role != "admin") {
            document.getElementById("go_create_quiz").remove();
        }
        console.log(user)
        document.getElementById('profile').getElementsByTagName('img')[0].src = user[0].pfp
        const result = user[0].quiz_history.filter(item => item.quiz_id === parseInt(localStorage.getItem('quiz_id_analyse')))[0];
        console.log(result)
        chart_1(result)
        document.getElementById("score").innerHTML = result.score
        document.getElementById("positive").innerHTML = result.positive
        document.getElementById("negative").innerHTML = result.negative
        document.getElementById("accuracy").innerHTML = result.accuracy+"%"
        document.getElementById("number_of_correct_questions").innerHTML = result.number_of_correct_questions
        document.getElementById("number_of_incorrect_questions").innerHTML = result.number_of_incorrect_questions
        document.getElementById("number_of_questions_not_attempted").innerHTML = result.number_of_questions_not_attempted
    })
}

function chart_1(result){
    const ctx = document.getElementById('quizChart').getContext('2d');

    const data = {
        labels: ['Correct Questions', 'Incorrect Questions', 'Not Attempted'],
        datasets: [{
            label: 'Quiz Performance',
            data: [result.number_of_correct_questions, result.number_of_incorrect_questions, result.number_of_questions_not_attempted], // Values: correct, incorrect, not attempted
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
            borderColor: ['#4CAF50', '#F44336', '#FFC107'],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#444444', // Grid lines for Y-axis
                },
                ticks: {
                    color: '#888888', // Ticks on the Y-axis
                },
                title: {
                    color: '#ffffff', // Title of the Y-axis (if any)
                }
            },
            x: {
                grid: {
                    color: '#444444', // Grid lines for Y-axis
                },
                ticks: {
                    color: '#888888', // Ticks on the Y-axis
                },
                title: {
                    color: '#ffffff', // Title of the Y-axis (if any)
                }
            }
        }
    };

    const quizChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}


const leaderboards = collection(db, 'leaderboards');
const leaderboard_data = query(leaderboards, where("quiz_id", "==", parseInt(localStorage.getItem("quiz_id_analyse"))));
const leaderboardTable = document.getElementById('leaderboardTable').querySelector("tbody"); // Your <table> element for leaderboard

onSnapshot(leaderboard_data, (snapshot) => {
    let leaderboard_arr = [];
    snapshot.docs.forEach(doc => {
        leaderboard_arr.push({ ...doc.data(), id: doc.id });
    });

    // Assuming there's always at least one leaderboard data document
    let leaderboard_rank = leaderboard_arr[0].rankings;

    // Sort the leaderboard by score and get only the top 10
    let leaderboard = leaderboard_rank
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 10); // Get top 10 only

    console.log(leaderboard);

    // Building the string for table rows dynamically
    let str = "";
    let rank = 1;
    for (const i of leaderboard) {
        str += `
            <tr>
                <td>${rank}</td>
                <td>${i.username}</td>
                <td>${i.score}</td>
                <td>${i.accuracy}%</td>
            </tr>
        `;
        rank++; // Increment the rank
    }

    // Update the leaderboard table's body with generated rows
    leaderboardTable.innerHTML = str;
});


document.getElementById("report_button").addEventListener('click', () => {
    document.getElementById("report").style.display = "block";
    document.getElementById("leaderboard").style.display = "none";
})

document.getElementById("leaderboard_button").addEventListener('click', () => {
    document.getElementById("report").style.display = "none";
    document.getElementById("leaderboard").style.display = "flex";
})