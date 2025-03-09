import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCaexv-0SVEmPeRNYt-WviKBiUhH-Ju7XQ",
    authDomain: "imago-veritatis.firebaseapp.com",
    projectId: "imago-veritatis",
    storageBucket: "imago-veritatis.firebasestorage.app",
    messagingSenderId: "119028191334",
    appId: "1:119028191334:web:44815ae6a51aac8d959da7",
    measurementId: "G-DGMLVJ767X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("articleForm");

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (!isUserAuthorized(user)) {
            alert("Accès refusé : Vous n'êtes pas autorisé à accéder à cette page.");
            window.location.href = ".";
        }
    } else {
        alert("Veuillez vous connecter pour accéder à cette page.");
        window.location.href = "login.html";
    }
});

function isUserAuthorized(user) {
    const authorizedEmails = ["tpillot27@gmail.com"];
    return authorizedEmails.includes(user.email);
}

async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("https://api.imgbb.com/1/upload?key=f5d17031565550135ce61443068b967a", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.data.url;
    } catch (error) {
        console.error("Erreur d'upload ImgBB :", error);
        return "";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const date = document.getElementById("date").value;

    let imageUrl = "";
    let memeUrl = "";

    if (imageUpload.files.length > 0) {
        imageUrl = await uploadToImgBB(imageUpload.files[0]);
    }
    if (memeUpload.files.length > 0) {
        memeUrl = await uploadToImgBB(memeUpload.files[0]);
    }

    try {
        await addDoc(collection(db, "articles"), {
            title: title,
            content: content,
            image: imageUrl,
            category: category,
            author: author,
            meme: memeUrl,
            timestamp: date
        });

        alert("Article publié !");
        form.reset();
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de la publication.");
    }
});