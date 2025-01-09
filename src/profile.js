function pfp_square() {
    const profile = document.getElementById('profile');
    const profile_pfp = document.getElementById('profile_pfp')
    const pfp_edit = document.getElementById('pfp_edit')
    const pfp_preview = document.getElementById('pfp_preview_container')
    const height = profile.offsetHeight;
    profile.style.width = `${height}px`;
    const height1 = profile_pfp.offsetHeight;
    profile_pfp.style.width = `${height1}px`
    pfp_edit.style.width = `${height1}px`
    const height2 = pfp_preview.offsetHeight;
    pfp_preview.style.width = `${height2}px`
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
let id;


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
  /*  const unsubuserCol = onSnapshot(user_data, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            user.push({ ...doc.data(), id: doc.id })
        })
        console.log(user)
        document.getElementById('profile').getElementsByTagName('img')[0].src = user[0].pfp
        document.getElementById('username').innerText = user[0].username
        document.getElementById('email').innerText = user[0].email
        document.getElementById('role').innerText = user[0].role
        document.getElementById('avg_accuracy').innerText = user[0].performance_analytics.avg_accuracy
        document.getElementById('total_quiz').innerText = user[0].performance_analytics.total_quiz
    }) */


    getDocs(user_data)
    .then(snapshot => {
        // console.log(snapshot.docs)
        snapshot.docs.forEach(doc => {
        user.push({ ...doc.data(), id: doc.id })
        })
        if (user[0].role != "admin") {
            document.getElementById("go_create_quiz").remove();
        }
        console.log(user)
        document.getElementById('profile').getElementsByTagName('img')[0].src = user[0].pfp
        document.getElementById('username').innerText = user[0].username
        document.getElementById('email').innerText = user[0].email
        document.getElementById('role').innerText = user[0].role
        document.getElementById('avg_accuracy').innerText = user[0].performance_analytics.avg_accuracy
        document.getElementById('total_quiz').innerText = user[0].performance_analytics.total_quiz
        document.getElementById('profile_pfp').src = user[0].pfp
        document.getElementById('pfp_preview').src = user[0].pfp
        id = user[0].id
    })
    .catch(err => {
        console.log(err.message)
    })
}

document.getElementById('logout').addEventListener('click', () => {
    signOut(auth)
    .then(() => {
      console.log('user signed out')
      window.open("../../main/index.html", "_self");
    })
    .catch(err => {
      console.log(err.message)
    })
})







let uploadedFile = null; // Variable to hold the uploaded file

// File input change event
document.getElementById("file_upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    let save_button = document.getElementById("new_pfp_save")
    if (file) {
        uploadedFile = file; // Store the file
        save_button.disabled = false; // Enable upload button
        save_button.style.color = '#ffffff';
        save_button.style.borderColor = '#00ff00';
        save_button.style.cursor = 'pointer';
        const objectURL = URL.createObjectURL(file); // Create a temporary URL for the file
        document.getElementById('pfp_preview').src = objectURL;
    } else {
        console.error("No file selected.");
        uploadedFile = null;
        save_button.disabled = true; // Disable upload button
        save_button.style.color = '#ffffff22';
        save_button.style.borderColor = '#00ff0022';
        save_button.style.cursor = 'not-allowed';
    }
});

// Upload button click event
document.getElementById("new_pfp_save").addEventListener("click", async () => {
    if (!uploadedFile) {
    console.error("No file to upload.");
    return;
    }

    // Prepare the form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("upload_preset", "unsigned_preset"); // Replace with your unsigned preset name

    try {
    // Upload to Cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/duskoe3ir/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Uploaded Image URL:", data.secure_url);
        let docRef = doc(db, 'Users', id)

        updateDoc(docRef, {
            pfp: data.secure_url
        })
        .then(() => {
            document.querySelector(".from_above").classList.add("from_above_close")
            document.querySelector(".from_above").classList.remove("from_above_open")
            const user_col = collection(db, 'Users')
            const user_data = query(user_col, where("email", "==", emailid))
            let new_user_data = [];
            getDocs(user_data)
            .then(snapshot => {
                // console.log(snapshot.docs)
                snapshot.docs.forEach(doc => {
                    new_user_data.push({ ...doc.data(), id: doc.id })
                })
                console.log(new_user_data)
                document.getElementById('profile').getElementsByTagName('img')[0].src = new_user_data[0].pfp
                document.getElementById('profile_pfp').src = new_user_data[0].pfp
            })
            .catch(err => {
                console.log(err.message)
            })
        })
    } catch (error) {
        console.error("Error uploading image:", error);
    }
});
/*
document.getElementById('imageUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create FormData object to upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset'); // Replace with your upload preset

    try {
      // Upload to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/duskoe3ir/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Uploaded image URL:', data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  });

*/

document.getElementById("close_pfp").addEventListener('click', () => {
    document.querySelector(".from_above").classList.add("from_above_close")
    document.querySelector(".from_above").classList.remove("from_above_open")
})
document.getElementById("pfp_edit").addEventListener('click', () => {
    document.querySelector(".from_above").classList.add("from_above_open")
    document.querySelector(".from_above").classList.remove("from_above_close")
})