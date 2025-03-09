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

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sélection du formulaire
const form = document.getElementById("articleForm");

// Vérification de l'état de l'authentification de l'utilisateur
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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").value || "";
    const meme = document.getElementById("meme").value || "";
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const date = new Date();

    try {
        await addDoc(collection(db, "articles"), {
            title: title,
            content: content,
            image: image,
            category: category,
            author: author,
            meme: meme,
            timestamp: date.getDate() + '/' +  date.getMonth() + '/' + date.getFullYear()
        });

        alert("Article publié !");
        form.reset();
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de la publication.");
    }
});
