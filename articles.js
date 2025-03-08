import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Extension Showdown pour les petits textes
showdown.extension('smallText', function() {
    return [{
        type: 'lang',
        regex: /-# (.*?)(\n|$)/g,
        replace: '<small>$1</small>$2'
    }];
});

// Initialiser Showdown avec l'extension
let converter = new showdown.Converter({
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    extensions: ['smallText']
});

// Fonction pour charger les articles
async function loadArticles() {
    const articlesRef = collection(db, "articles");  // Assure-toi que ta collection s'appelle bien "articles"
    const querySnapshot = await getDocs(articlesRef);

    let articlesContainer = document.getElementById("articles-container");

    querySnapshot.forEach((doc) => {
        let article = doc.data();

        // Récupérer les 200 premiers caractères de l'article
        let previewText = article.content.substring(0, 200);

        // Convertir les 200 premiers caractères en HTML
        let previewHTML = converter.makeHtml(previewText);

        // Créer l'élément article avec l'aperçu
        let articleElement = document.createElement("div");
        articleElement.classList.add("article-card");
        articleElement.innerHTML = `
            <a href="article.html?id=${doc.id}" class="article-link">
                <h2>${article.title}</h2>
                <p>Auteur : ${article.author} - Publié le : ${article.timestamp} - Catégorie : ${article.category}</p>
                <div>${previewHTML}...</div>
                ${article.meme ? `<img src="${article.meme}" alt="Meme" class="article-image">` : ''}
            </a>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

// Charger les articles au chargement de la page
window.onload = loadArticles;