import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: import.meta.env.FB_API_KEY,
    authDomain: import.meta.env.FB_AUTH_DOMAIN,
    projectId: import.meta.env.FB_PROJECT_ID,
    storageBucket: import.meta.env.FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FB_MESSAGING_SENDER_ID,
    appId: import.meta.env.FB_APP_ID,
    measurementId: import.meta.env.FB_MEASUREMENT_ID
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Vérification si l'email a été vérifié
        if (user.emailVerified) {
            window.location.href = "/admin.html"; // Redirection vers la page admin après connexion
        } else {
            alert("Veuillez vérifier votre email avant de vous connecter.");
        }
    } catch (error) {
        alert("Erreur de connexion : " + error.message);
    }
});