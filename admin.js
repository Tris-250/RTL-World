import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: import.meta.env.FB_API_KEY,
    authDomain: import.meta.env.FB_AUTH_DOMAIN,
    projectId: import.meta.env.FB_PROJECT_ID,
    storageBucket: import.meta.env.FB_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FB_MESSAGING_SENDER_ID,
    appId: import.meta.env.FB_APP_ID,
    measurementId: import.meta.env.FB_MEASUREMENT_ID
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
        // L'utilisateur est connecté
        // Vous pouvez ajouter une vérification supplémentaire pour savoir si l'utilisateur est autorisé
        if (!isUserAuthorized(user)) {
            alert("Accès refusé : Vous n'êtes pas autorisé à accéder à cette page.");
            window.location.href = "index.html"; // Redirection vers la page d'accueil ou une autre page
        }
    } else {
        // L'utilisateur n'est pas connecté
        alert("Veuillez vous connecter pour accéder à cette page.");
        window.location.href = "/login.html"; // Redirection vers la page de connexion
    }
});

// Fonction pour vérifier si l'utilisateur est autorisé (par exemple, vérifier son email)
function isUserAuthorized(user) {
    const authorizedEmails = ["tpillot27@gmail.com"]; // Liste d'emails autorisés
    return authorizedEmails.includes(user.email);
}

// Quand on soumet le formulaire
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").value || "";
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value;
    const date = new Date();

    try {
        // Ajout dans Firestore
        await addDoc(collection(db, "articles"), {
            title: title,
            content: content,
            image: image,
            category: category,
            author: author,
            timestamp: date.getDate() + '/' +  date.getMonth() + '/' + date.getFullYear() // Ajoute la date actuelle
        });

        alert("Article publié !");
        form.reset();
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de la publication.");
    }
});
